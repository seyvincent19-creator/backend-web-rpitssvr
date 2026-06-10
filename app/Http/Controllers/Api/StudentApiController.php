<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentApiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lastNameKh'   => ['required', 'string', 'max:255'],
            'firstNameKh'  => ['required', 'string', 'max:255'],
            'lastNameEn'   => ['required', 'string', 'max:255'],
            'firstNameEn'  => ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:50'],
            'email'        => ['nullable', 'email', 'max:255'],
            'department'   => ['nullable', 'string', 'max:255'],
            'major'        => ['required', 'string', 'max:255'],
            'year'         => ['required', 'string', 'max:50'],
            'photo'        => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // 2MB
        ]);

        $photoPath = null;

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('students/photos', 'public');
        }

        $student = Student::create([
            'last_name_kh'  => $validated['lastNameKh'],
            'first_name_kh' => $validated['firstNameKh'],
            'last_name_en'  => $validated['lastNameEn'],
            'first_name_en' => $validated['firstNameEn'],
            'phone'         => $validated['phone'],
            'email'         => $validated['email'] ?? null,
            //'department'    => $validated['department'] ?? null,
            'major'         => $validated['major'],
            'year'          => $validated['year'],
            'photo_path'    => $photoPath,
        ]);

        return response()->json([
            'message' => 'Student registered successfully.',
            'data'    => $student,
        ], 201);
    }
}
