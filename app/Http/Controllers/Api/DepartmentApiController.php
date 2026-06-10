<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;


class DepartmentApiController extends Controller
{
    public function index()
    {
        $departments = Department::with(['descriptionImages' => function($query) {
            $query->where('type', 'description')->orderBy('id', 'asc');
        }])->get();
        return response()->json($departments);
    }

    public function show($id)
    {
        try {
        $department = Department::with([
            'skills','images',
            'courses.semesters.subjects'
            
        ])->find($id);

        if (!$department) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $department
        ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch department',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
