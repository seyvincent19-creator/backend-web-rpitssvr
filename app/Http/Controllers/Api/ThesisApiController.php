<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Thesis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ThesisApiController extends Controller
{
    public function index()
    {
        $thesis = Thesis::orderByDesc('created_at')->paginate(10);
        return response()->json($thesis);
    }

    public function show($id)
    {
        // Return single thesis or 404
        $thesis = Thesis::findOrFail($id);
        return response()->json($thesis);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'student' => 'required|string',
            'supervisor' => 'required|string',
            'major' => 'required|string',
            'year' => 'required|integer',
            'type' => 'required|string',
            'category' => 'required|string',
            'language' => 'required|string',
            'page' => 'required|integer',
            'url' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('theses', 'public');
        }

        $thesis = Thesis::create($validated);

        return response()->json($thesis, 201);
    }

    public function update(Request $request, $id)
    {
        $thesis = Thesis::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string',
            'student' => 'required|string',
            'supervisor' => 'required|string',
            'major' => 'required|string',
            'year' => 'required|integer',
            'type' => 'required|string',
            'category' => 'required|string',
            'language' => 'required|string',
            'page' => 'required|integer',
            'url' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($thesis->image) {
                Storage::disk('public')->delete($thesis->image);
            }
            $validated['image'] = $request->file('image')->store('theses', 'public');
        }

        $thesis->update($validated);

        return response()->json($thesis);
    }

    public function destroy($id)
    {
        $thesis = Thesis::findOrFail($id);

        if ($thesis->image) {
            Storage::disk('public')->delete($thesis->image);
        }

        $thesis->delete();

        return response()->json(null, 204);
    }
}
