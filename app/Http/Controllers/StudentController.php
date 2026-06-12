<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }

    public function show(Student $student)
    {
        return Inertia::render('Students/Show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'last_name_kh'   => ['required', 'string', 'max:255'],
            'first_name_kh'  => ['required', 'string', 'max:255'],
            'last_name_en'   => ['required', 'string', 'max:255'],
            'first_name_en'  => ['required', 'string', 'max:255'],
            'gender'         => ['nullable', 'in:male,female'],
            'dob'            => ['nullable', 'date'],
            'national_id'    => ['nullable', 'string', 'max:100'],
            'phone'          => ['required', 'string', 'max:50'],
            'email'          => ['nullable', 'email', 'max:255'],
            'province'       => ['nullable', 'string', 'max:100'],
            'address'        => ['nullable', 'string', 'max:500'],
            'guardian_name'  => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:50'],
            'major'          => ['required', 'string', 'max:255'],
            'year'           => ['required', 'string', 'max:50'],
        ]);

        $student->update($validated);

        return redirect()->route('students.index')->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        if ($student->photo_path) {
            Storage::disk('public')->delete($student->photo_path);
        }
        $student->delete();

        return redirect()->route('students.index')->with('success', 'Student deleted.');
    }
}
