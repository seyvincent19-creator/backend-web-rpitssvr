<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Videos/Index', [
            'videos' => $videos,
        ]);
    }

    public function create()
    {
        return inertia('Videos/Create');
    }

    private function tagsToArray(Request $request): array
    {
        $raw = $request->input('tags', '');
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
            'image' => 'required|file|image|max:2048',
        ]);

        $validated['tags'] = $this->tagsToArray($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('videos', 'public');
        }

        Video::create($validated);

        return redirect()->route('videos.index')->with('success', 'Video created successfully.');
    }

    public function show($id)
    {
        $video = Video::findOrFail($id);
        return inertia('Videos/Show', ['video' => $video]);
    }

    public function edit($id)
    {
        $video = Video::findOrFail($id);
        return inertia('Videos/Edit', ['video' => $video]);
    }

    public function update(Request $request, $id)
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

        $validated['tags'] = $this->tagsToArray($request);

        $video = Video::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($video->image) {
                Storage::disk('public')->delete($video->image);
            }
            $validated['image'] = $request->file('image')->store('videos', 'public');
        }

        $video->update($validated);

        return redirect()->route('videos.index')->with('success', 'Video updated successfully.');
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);

        if ($video->image) {
            Storage::disk('public')->delete($video->image);
        }

        $video->delete();

        return redirect()->route('videos.index')->with('success', 'Video deleted successfully.');
    }
}
