<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\DepartmentImage;
use App\Models\DepartmentSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
         $departments = Department::with(['skills', 'images'])
            ->orderBy('created_at', 'desc')
            ->paginate(10) // ✅ pagination instead of get()
            ->withQueryString();

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
        ]);
    }
    public function create()
    {
        return inertia('Departments/Create');
    }

    public function store(Request $request)
    {
        // Accept both slideImages[] / descriptionImages[] AND slide_images[] / description_images[]
        $validated = $request->validate([
            'title_khmer'            => 'required|string|max:255',
            'title_eng'              => 'required|string|max:255|unique:departments,title_eng',
            'description'            => 'nullable|string',
            'skills'                 => 'nullable|array',
            'skills.*'               => 'string',
            'post_date'              => 'required|date',

            'slideImages'            => 'nullable|array',
            'slideImages.*'          => 'image|max:4096',
            'descriptionImages'      => 'nullable|array',
            'descriptionImages.*'    => 'image|max:4096',

            'slide_images'           => 'nullable|array',
            'slide_images.*'         => 'image|max:4096',
            'description_images'     => 'nullable|array',
            'description_images.*'   => 'image|max:4096',
        ]);

        // Normalize files from either camelCase or snake_case
        $slideFiles = $request->file('slideImages') ?? $request->file('slide_images') ?? [];
        $descFiles  = $request->file('descriptionImages') ?? $request->file('description_images') ?? [];

        return DB::transaction(function () use ($validated, $slideFiles, $descFiles) {
            $department = Department::create([
                'title_khmer'      => $validated['title_khmer'],
                'title_eng' => $validated['title_eng'],
                'description'=> $validated['description'] ?? null,
                'post_date'  => $validated['post_date'],
            ]);

            // Skills
            if (!empty($validated['skills'])) {
                foreach ($validated['skills'] as $skill) {
                    if ($skill !== null && $skill !== '') {
                        $department->skills()->create(['skill' => $skill]);
                    }
                }
            }

            // Slides (unique filenames)
            foreach ($slideFiles as $file) {
                // either: fully unique UUID name
                $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
                $path = $file->storeAs('slides-image-depart', $filename, 'public');

                // (alternative: keep original base name but ensure uniqueness)
                // $base = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                // $safe = Str::slug(mb_substr($base, 0, 60));
                // $filename = $safe.'-'.Str::random(8).'.'.$file->getClientOriginalExtension();
                // $path = $file->storeAs('slides-image-depart', $filename, 'public');

                $department->images()->create(['path' => $path, 'type' => 'slide']);
            }

            // Descriptions (unique filenames)
            foreach ($descFiles as $file) {
                $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
                $path = $file->storeAs('descriptions-image-depart', $filename, 'public');

                $department->images()->create(['path' => $path, 'type' => 'description']);
            }

            return response()->json([
                'message' => 'Department created successfully',
                'data'    => $department->load('skills', 'images'),
            ], 201);
        });
    }

    public function departmentsEdit(Department $department)
    {
        $department->load(['skills', 'images']);
        return Inertia::render('Departments/Edit', [
            'department' => $department,
        ]);
    }

    public function departmentsUpdate(Request $request, Department $department)
    {
        $request->validate([
            'title_khmer'          => 'required|string|max:255|unique:departments,title_khmer,' . $department->id,
            'title_eng'            => 'required|string|max:255|unique:departments,title_eng,' . $department->id,
            'description'          => 'nullable|string',
            'new_skills'           => 'nullable|array',
            'new_skills.*'         => 'string',
            'remove_skills'        => 'nullable|array',
            'remove_skills.*'      => 'integer|exists:department_skills,id',
            'remove_images'        => 'nullable|array',
            'remove_images.*'      => 'integer|exists:department_images,id',
            'slide_images'         => 'nullable|array',
            'slide_images.*'       => 'image|max:4096',
            'description_images'   => 'nullable|array',
            'description_images.*' => 'image|max:4096',
        ]);

        DB::transaction(function () use ($request, $department) {
            $department->update([
                'title_khmer' => $request->title_khmer,
                'title_eng'   => $request->title_eng,
                'description' => $request->description,
            ]);

            // Remove selected skills
            if ($request->filled('remove_skills')) {
                DepartmentSkill::whereIn('id', $request->remove_skills)
                    ->where('department_id', $department->id)
                    ->delete();
            }

            // Add new skills
            foreach (($request->new_skills ?? []) as $skill) {
                if (trim($skill) !== '') {
                    $department->skills()->create(['skill' => trim($skill)]);
                }
            }

            // Remove selected images (and files)
            if ($request->filled('remove_images')) {
                $imgs = DepartmentImage::whereIn('id', $request->remove_images)
                    ->where('department_id', $department->id)->get();
                foreach ($imgs as $img) {
                    Storage::disk('public')->delete($img->path);
                    $img->delete();
                }
            }

            // Upload new slide images
            foreach ($request->file('slide_images', []) as $file) {
                $path = $file->storeAs('slides-image-depart', Str::uuid().'.'.$file->getClientOriginalExtension(), 'public');
                $department->images()->create(['path' => $path, 'type' => 'slide']);
            }

            // Upload new description images
            foreach ($request->file('description_images', []) as $file) {
                $path = $file->storeAs('descriptions-image-depart', Str::uuid().'.'.$file->getClientOriginalExtension(), 'public');
                $department->images()->create(['path' => $path, 'type' => 'description']);
            }
        });

        return redirect()->route('departments.index')->with('success', 'Department updated successfully.');
    }
}
