<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Video::query();

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('creator', 'like', "%{$q}%");
            });
        }

        return $query->orderByDesc('created_at')->paginate(10);
    }

    public function show($id)
    {
        return Video::findOrFail($id);
    }

    private function tagsToArray(Request $request): ?array
    {
        if (!$request->has('tags')) return null;
        $raw = $request->input('tags', '');
        if (is_array($raw)) return $raw;
        return collect(explode(',', $raw))
            ->map(fn ($t) => trim($t))
            ->filter()
            ->values()
            ->all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'creator' => 'required|string',
            'description' => 'required|string',
            'duration' => 'required|string',
            'format' => 'required|string',
            'resolution' => 'required|string',
            'language' => 'required|string',
            'upload_date' => 'required|date',
            'url' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $validated['tags'] = $this->tagsToArray($request) ?? [];

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('videos', 'public');
        }

        $video = Video::create($validated);
        return response()->json($video, 201);
    }

    public function update(Request $request, Video $video)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'creator' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'duration' => 'sometimes|required|string',
            'format' => 'sometimes|required|string',
            'resolution' => 'sometimes|required|string',
            'language' => 'sometimes|required|string',
            'upload_date' => 'sometimes|required|date',
            'url' => 'sometimes|required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $tags = $this->tagsToArray($request);
        if ($tags !== null) $validated['tags'] = $tags;

        if ($request->hasFile('image')) {
            if ($video->image) {
                Storage::disk('public')->delete($video->image);
            }
            $validated['image'] = $request->file('image')->store('videos', 'public');
        }

        $video->update($validated);
        return response()->json($video);
    }

    public function destroy(Video $video)
    {
        if ($video->image) {
            Storage::disk('public')->delete($video->image);
        }
        $video->delete();
        return response()->json(null, 204);
    }
}
