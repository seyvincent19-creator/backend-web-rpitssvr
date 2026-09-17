<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JournalApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Journal::query();

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
        return Journal::findOrFail($id);
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('journals', 'public');
        }

        $journal = Journal::create($validated);
        return response()->json($journal, 201);
    }

    public function update(Request $request, Journal $journal)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'abstract' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'published' => 'sometimes|required|date',
            'language' => 'sometimes|required|string',
            'pages' => 'sometimes|required|integer',
            'url' => 'sometimes|required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($journal->image) {
                Storage::disk('public')->delete($journal->image);
            }
            $validated['image'] = $request->file('image')->store('journals', 'public');
        }

        $journal->update($validated);
        return response()->json($journal);
    }

    public function destroy(Journal $journal)
    {
        if ($journal->image) {
            Storage::disk('public')->delete($journal->image);
        }
        $journal->delete();
        return response()->json(null, 204);
    }
}
