<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\EPublication;
use Illuminate\Support\Facades\Storage;

class EpublicationsController extends Controller
{
    public function index()
    {
        $epublications = EPublication::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('E-Publications/Index', [
            'epublications' => $epublications,
        ]);
    }

    public function create()
    {
        return inertia('E-Publications/Create');
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
            'image' => 'required|file|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('e_publications', 'public');
        }

        EPublication::create($validated);

        return redirect()->route('epublications.index')->with('success', 'E-Publication created successfully.');
    }

    public function show($id)
    {
        $epublication = EPublication::findOrFail($id);
        return inertia('E-Publications/Show', ['epublication' => $epublication]);
    }

    public function edit($id)
    {
        $epublication = EPublication::findOrFail($id);
        return inertia('E-Publications/Edit', ['epublication' => $epublication]);
    }

    public function update(Request $request, $id)
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

        $epublication = EPublication::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($epublication->image) {
                Storage::disk('public')->delete($epublication->image);
            }
            $validated['image'] = $request->file('image')->store('e_publications', 'public');
        }

        $epublication->update($validated);

        return redirect()->route('epublications.index')->with('success', 'E-Publication updated successfully.');
    }

    public function destroy($id)
    {
        $epublication = EPublication::findOrFail($id);

        if ($epublication->image) {
            Storage::disk('public')->delete($epublication->image);
        }

        $epublication->delete();

        return redirect()->route('epublications.index')->with('success', 'E-Publication deleted successfully.');
    }
}
