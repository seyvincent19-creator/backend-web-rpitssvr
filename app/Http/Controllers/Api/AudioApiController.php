<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AudioApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Audio::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

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
        return Audio::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'year' => 'required|integer',
            'publisher' => 'required|string',
            'type' => 'required|string',
            'category' => 'required|string',
            'language' => 'required|string',
            'location' => 'required|string',
            'duration' => 'required|string',
            'url' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('audios', 'public');
        }

        $audio = Audio::create($validated);
        return response()->json($audio, 201);
    }

    public function update(Request $request, Audio $audio)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'year' => 'sometimes|required|integer',
            'publisher' => 'sometimes|required|string',
            'type' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'language' => 'sometimes|required|string',
            'location' => 'sometimes|required|string',
            'duration' => 'sometimes|required|string',
            'url' => 'sometimes|required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($audio->image) {
                Storage::disk('public')->delete($audio->image);
            }
            $validated['image'] = $request->file('image')->store('audios', 'public');
        }

        $audio->update($validated);
        return response()->json($audio);
    }

    public function destroy(Audio $audio)
    {
        if ($audio->image) {
            Storage::disk('public')->delete($audio->image);
        }
        $audio->delete();
        return response()->json(null, 204);
    }
}
