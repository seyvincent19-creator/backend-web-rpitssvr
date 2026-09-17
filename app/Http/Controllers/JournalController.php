<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Journal;
use Illuminate\Support\Facades\Storage;

class JournalController extends Controller
{
    public function index()
    {
        $journals = Journal::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Journals/Index', [
            'journals' => $journals,
        ]);
    }

    public function create()
    {
        return inertia('Journals/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'abstract' => 'required|string',
            'author' => 'required|string',
            'published' => 'required|date',
            'language' => 'required|string',
            'pages' => 'required|integer',
            'url' => 'required|url',
            'image' => 'required|file|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('journals', 'public');
        }

        Journal::create($validated);

        return redirect()->route('journals.index')->with('success', 'Journal created successfully.');
    }

    public function show($id)
    {
        $journal = Journal::findOrFail($id);
        return inertia('Journals/Show', ['journal' => $journal]);
    }

    public function edit($id)
    {
        $journal = Journal::findOrFail($id);
        return inertia('Journals/Edit', ['journal' => $journal]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'abstract' => 'required|string',
            'author' => 'required|string',
            'published' => 'required|date',
            'language' => 'required|string',
            'pages' => 'required|integer',
            'url' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $journal = Journal::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($journal->image) {
                Storage::disk('public')->delete($journal->image);
            }
            $validated['image'] = $request->file('image')->store('journals', 'public');
        }

        $journal->update($validated);

        return redirect()->route('journals.index')->with('success', 'Journal updated successfully.');
    }

    public function destroy($id)
    {
        $journal = Journal::findOrFail($id);

        if ($journal->image) {
            Storage::disk('public')->delete($journal->image);
        }

        $journal->delete();

        return redirect()->route('journals.index')->with('success', 'Journal deleted successfully.');
    }
}
