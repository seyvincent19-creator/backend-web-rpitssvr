<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Audio;
use Illuminate\Support\Facades\Storage;

class AudioController extends Controller
{
    public function index()
    {
        $audios = Audio::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Audios/Index', [
            'audios' => $audios,
        ]);
    }

    public function create()
    {
        return inertia('Audios/Create');
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
            'image' => 'required|file|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('audios', 'public');
        }

        Audio::create($validated);

        return redirect()->route('audios.index')->with('success', 'Audio created successfully.');
    }

    public function show($id)
    {
        $audio = Audio::findOrFail($id);
        return inertia('Audios/Show', ['audio' => $audio]);
    }

    public function edit($id)
    {
        $audio = Audio::findOrFail($id);
        return inertia('Audios/Edit', ['audio' => $audio]);
    }

    public function update(Request $request, $id)
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

        $audio = Audio::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($audio->image) {
                Storage::disk('public')->delete($audio->image);
            }
            $validated['image'] = $request->file('image')->store('audios', 'public');
        }

        $audio->update($validated);

        return redirect()->route('audios.index')->with('success', 'Audio updated successfully.');
    }

    public function destroy($id)
    {
        $audio = Audio::findOrFail($id);

        if ($audio->image) {
            Storage::disk('public')->delete($audio->image);
        }

        $audio->delete();

        return redirect()->route('audios.index')->with('success', 'Audio deleted successfully.');
    }
}
