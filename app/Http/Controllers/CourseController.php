<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Department;
use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Semester;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;


class CourseController extends Controller
{
    public function index()
    {
        // Eager-load department + semesters + subjects
        $perPage = 10;

        $courses = Course::with([
            'department:id,title_khmer', // only load id + title_khmer from departments
            'semesters.subjects' // loads semesters and nested subjects
        ])
        ->orderBy('id', 'desc')
        ->paginate($perPage)
        ->withQueryString();

        // Inertia will serialize the LengthAwarePaginator and include:
        // -> { data: [...], meta: { current_page, last_page, ... }, links: [...] }
        return Inertia::render('Courses/Index', [
            'courses' => $courses,
        ]);
    }
    //view create course form
    public function create()
    {
        $departments = Department::orderBy('title_khmer')->get(['id', 'title_khmer']);
        return Inertia::render('Courses/Create', [
            'departments' => $departments,
        ]);
    }
     public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'year' => 'required|in:1,2,3,4,5',
            'semester' => 'required|in:1,2',
            'subjects_text' => 'nullable|string|max:5000', // max ~5000 characters
        ]);

        try {
            DB::beginTransaction();

            // 1) create the course
            $course = Course::create([
                'department_id' => $validated['department_id'],
                'year' => $validated['year'],
            ]);

            // 2) create the semester
            $semesterName = 'Semester ' . $validated['semester'];
            $semester = Semester::create([
                'course_id' => $course->id,
                'name' => $semesterName,
            ]);

            // 3) if there is subjects_text, parse and create subjects
            if (!empty($validated['subjects_text'])) {
                $lines = preg_split('/\r\n|\n|\r/', $validated['subjects_text']);
                $createdCount = 0;

                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '') {
                        continue;
                    }

                    // Split by commas if needed
                    $tokens = strpos($line, ',') !== false ? array_map('trim', explode(',', $line)) : [$line];

                    foreach ($tokens as $token) {
                        $name = mb_substr(trim($token), 0, 255);
                        if ($name === '') {
                            continue;
                        }

                        Subject::create([
                            'semester_id' => $semester->id,
                            'name' => $name,
                        ]);

                        $createdCount++;
                    }
                }
            }

            DB::commit();

            return redirect()
                ->route('courses.index')
                ->with('success', 'Course and semester created successfully' . (isset($createdCount) ? " ({$createdCount} subjects added)" : ''));
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create course: ' . $e->getMessage()]);
        }
    }


    public function show(Course $course)
    {
        $course->load(['department', 'semesters.subjects']);

        return Inertia::render('Courses/Show', [
            'course' => $course,
        ]);
    }

    public function edit(Course $course)
    {
        $course->load(['department', 'semesters.subjects']);
        $departments = Department::orderBy('title_khmer')->get(['id', 'title_khmer']);

        return Inertia::render('Courses/Edit', [
            'course'      => $course,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'department_id'              => 'required|exists:departments,id',
            'year'                       => 'required|in:1,2,3,4,5',
            'remove_semesters'           => 'nullable|array',
            'remove_semesters.*'         => 'integer|exists:semesters,id',
            'remove_subjects'            => 'nullable|array',
            'remove_subjects.*'          => 'integer|exists:subjects,id',
            'update_semesters'           => 'nullable|array',
            'update_semesters.*.id'      => 'required|integer|exists:semesters,id',
            'update_semesters.*.name'    => 'required|string|max:255',
            'add_subjects'               => 'nullable|array',
            'new_semesters'              => 'nullable|array',
            'new_semesters.*.name'       => 'required|string|max:255',
            'new_semesters.*.subjects_text' => 'nullable|string|max:5000',
        ]);

        DB::transaction(function () use ($request, $course) {
            $course->update([
                'department_id' => $request->department_id,
                'year'          => $request->year,
            ]);

            // Remove entire semesters (cascades to subjects via DB)
            if (!empty($request->remove_semesters)) {
                Semester::whereIn('id', $request->remove_semesters)
                    ->where('course_id', $course->id)
                    ->each(function ($sem) {
                        $sem->subjects()->delete();
                        $sem->delete();
                    });
            }

            // Remove individual subjects
            if (!empty($request->remove_subjects)) {
                Subject::whereIn('id', $request->remove_subjects)->delete();
            }

            // Update existing semester names
            foreach ($request->update_semesters ?? [] as $item) {
                Semester::where('id', $item['id'])
                    ->where('course_id', $course->id)
                    ->update(['name' => $item['name']]);
            }

            // Add subjects to existing semesters (keyed by semester_id)
            foreach ($request->add_subjects ?? [] as $semId => $text) {
                if (!trim($text)) continue;
                $semester = Semester::where('id', $semId)->where('course_id', $course->id)->first();
                if (!$semester) continue;
                foreach (preg_split('/\r\n|\n|\r/', $text) as $line) {
                    $name = mb_substr(trim($line), 0, 255);
                    if ($name !== '') {
                        Subject::create(['semester_id' => $semester->id, 'name' => $name]);
                    }
                }
            }

            // Add brand-new semesters
            foreach ($request->new_semesters ?? [] as $item) {
                $sem = Semester::create(['course_id' => $course->id, 'name' => $item['name']]);
                foreach (preg_split('/\r\n|\n|\r/', $item['subjects_text'] ?? '') as $line) {
                    $name = mb_substr(trim($line), 0, 255);
                    if ($name !== '') {
                        Subject::create(['semester_id' => $sem->id, 'name' => $name]);
                    }
                }
            }
        });

        return redirect()->route('courses.index')->with('success', 'Course updated successfully.');
    }
}
