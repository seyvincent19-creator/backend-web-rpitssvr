<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use Illuminate\Http\Request;

class EbookApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Ebook::query();

        // Filter by category (skill) if provided
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Optional: basic text search (title/author)
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('author', 'like', "%{$q}%");
            });
        }

        // Order by newest first
        return $query->orderByDesc('created_at')->paginate(10);
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
            'category' => 'required|string',
            'url' => 'required|url',
            'image' => 'nullable|string', // Or handle file upload separately
        ]);

        $ebook = Ebook::create($validated);
        return response()->json($ebook, 201);
    }

    public function show(Ebook $ebook)
    {
        return $ebook;
    }

    public function update(Request $request, Ebook $ebook)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'year' => 'sometimes|required|integer',
            'publisher' => 'sometimes|required|string',
            'language' => 'sometimes|required|string',
            'pages' => 'sometimes|required|integer',
            'category' => 'sometimes|required|string',
            'url' => 'sometimes|required|url',
            'image' => 'nullable|string',
        ]);

        $ebook->update($validated);
        return response()->json($ebook);
    }

    public function destroy(Ebook $ebook)
    {
        $ebook->delete();
        return response()->json(null, 204);
    }
    // Additional methods for search, filter, etc. can be added here
    public function search(Request $request)
    {
        $query = $request->input('query');

        $ebooks = Ebook::where('title', 'like', "%{$query}%")
                        ->orWhere('author', 'like', "%{$query}%")
                        ->orWhere('category', 'like', "%{$query}%")
                        ->paginate(10);

        return response()->json($ebooks);
    }
    // add a method to filter ebooks by category
    public function filterByCategory(Request $request)
    {
        $category = $request->input('category');    
        $ebooks = Ebook::where('category', $category)->paginate(10);
        return response()->json($ebooks);

    }
  
    
}
