<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentApiController extends Controller
{
    public function index()
    {
        return response()->json(Student::orderBy('created_at', 'desc')->paginate(20));
    }

    public function show(Student $student)
    {
        return response()->json($student);
    }

    public function store(Request $request)
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
            'photo'          => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('students/photos', 'public');
        }

        $student = Student::create([
            'last_name_kh'   => $validated['last_name_kh'],
            'first_name_kh'  => $validated['first_name_kh'],
            'last_name_en'   => $validated['last_name_en'],
            'first_name_en'  => $validated['first_name_en'],
            'gender'         => $validated['gender'] ?? null,
            'dob'            => $validated['dob'] ?? null,
            'national_id'    => $validated['national_id'] ?? null,
            'phone'          => $validated['phone'],
            'email'          => $validated['email'] ?? null,
            'province'       => $validated['province'] ?? null,
            'address'        => $validated['address'] ?? null,
            'guardian_name'  => $validated['guardian_name'] ?? null,
            'guardian_phone' => $validated['guardian_phone'] ?? null,
            'major'          => $validated['major'],
            'year'           => $validated['year'],
            'photo_path'     => $photoPath,
        ]);

        return response()->json([
            'message' => 'Student registered successfully.',
            'data'    => $student,
        ], 201);
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

        return response()->json(['message' => 'Student updated.', 'data' => $student]);
    }

    public function destroy(Student $student)
    {
        if ($student->photo_path) {
            Storage::disk('public')->delete($student->photo_path);
        }
        $student->delete();

        return response()->json(['message' => 'Student deleted.']);
    }
}
