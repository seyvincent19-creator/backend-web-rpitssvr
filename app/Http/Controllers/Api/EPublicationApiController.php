<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EPublication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EPublicationApiController extends Controller
{
    public function index(Request $request)
    {
        $query = EPublication::query();

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('author', 'like', "%{$q}%");
            });
        }

        return $query->orderByDesc('created_at')->paginate(10);
    }

    public function show($id)
    {
        return EPublication::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'year' => 'required|integer',
            'publisher' => 'required|string',
            'language' => 'required|string',
            'pages' => 'required|integer',
            'location' => 'required|string',
            'url' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('e_publications', 'public');
        }

        $epublication = EPublication::create($validated);
        return response()->json($epublication, 201);
    }

    public function update(Request $request, $id)
    {
        $epublication = EPublication::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'year' => 'sometimes|required|integer',
            'publisher' => 'sometimes|required|string',
            'language' => 'sometimes|required|string',
            'pages' => 'sometimes|required|integer',
            'location' => 'sometimes|required|string',
            'url' => 'sometimes|required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($epublication->image) {
                Storage::disk('public')->delete($epublication->image);
            }
            $validated['image'] = $request->file('image')->store('e_publications', 'public');
        }

        $epublication->update($validated);
        return response()->json($epublication);
    }

    public function destroy($id)
    {
        $epublication = EPublication::findOrFail($id);

        if ($epublication->image) {
            Storage::disk('public')->delete($epublication->image);
        }
        $epublication->delete();
        return response()->json(null, 204);
    }
}
