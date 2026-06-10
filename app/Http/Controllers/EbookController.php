<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Ebook;
use Illuminate\Support\Facades\Storage;

class EbookController extends Controller
{
    // Display a listing of the ebooks
   public function index()
    {
        $ebooks = Ebook::orderBy('created_at', 'desc')
                    ->paginate(10);; // or all() but pagination preferred

        // Pass data with proper structure for Inertia pagination
        return Inertia::render('Ebooks/Index', [
            'ebooks' => $ebooks,
            
        ]);
    }


    // Show the form for creating a new ebook
    public function create()
    {
        return inertia('Ebooks/Create');
    }

    // Store a newly created ebook in storage
public function store(Request $request)
{
    // Validate the request including the image file
    $request->validate([
        'title' => 'required|string',
        'author' => 'required|string',
        'year' => 'required|integer',
        'publisher' => 'required|string',
        'language' => 'required|string',
        'pages' => 'required|integer',
        'category' => 'required|string',
        'url' => 'required|url',
        'image' => 'required|file|image|max:2048', // Validate as image file
    ]);
    //dd($request->all());
    // Handle the image upload
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('ebooks', 'public');
    } else {
        $imagePath = null; // Or handle error
    }


    // Create new Ebook record with image path
    Ebook::create([
        'title' => $request->input('title'),
        'author' => $request->input('author'),
        'year' => $request->input('year'),
        'publisher' => $request->input('publisher'),
        'language' => $request->input('language'),
        'pages' => $request->input('pages'),
        'category' => $request->input('category'),
        'url' => $request->input('url'),
        'image' => $imagePath, // save the relative path
    ]);

    return redirect()->route('ebooks.index')->with('success', 'Ebook created successfully.');
}


    // Display the specified ebook
    public function show($id)
    {
        $ebook = Ebook::findOrFail($id);
        return inertia('Ebooks/Show', ['ebook' => $ebook]);
    }

    // Show the form for editing the specified ebook
    public function edit($id)
    {
        $ebook = Ebook::findOrFail($id);
        return inertia('Ebooks/Edit', ['ebook' => $ebook]);
    }

    // Update the specified ebook in storage
    public function update(Request $request, $id)
        {
            //dd($request->all(), $request->file('image'));

            $request->validate([
                'title' => 'required|string',
                'author' => 'required|string',
                'year' => 'required|integer',
                'publisher' => 'required|string',
                'language' => 'required|string',
                'pages' => 'required|integer',
                'category' => 'required|string',
                'url' => 'required|url',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // validate image file
            ]);
            
            $ebook = Ebook::findOrFail($id);

            $ebook->title = $request->title;
            $ebook->author = $request->author;
            $ebook->year = $request->year;
            $ebook->publisher = $request->publisher;
            $ebook->language = $request->language;
            $ebook->pages = $request->pages;
            $ebook->category = $request->category;
            $ebook->url = $request->url;

            // Handle image upload if there is a new image
            if ($request->hasFile('image')) {
                // Store image in 'public/ebooks' directory
                $path = $request->file('image')->store('ebooks', 'public');

                // Optionally delete old image file from storage
                // Storage::disk('public')->delete($ebook->image);

                $ebook->image = $path; // Save the new image path
            }

            $ebook->save();

            return redirect()->route('ebooks.index')->with('success', 'Ebook updated successfully.');
        }


    // Remove the specified ebook from storage
    public function destroy($id)
    {
        $ebook = Ebook::findOrFail($id);

        // Optionally delete the ebook cover image file if stored
        if ($ebook->image) {
            \Storage::disk('public')->delete($ebook->image);
        }

        $ebook->delete();

        return redirect()->route('ebooks.index')->with('success', 'Ebook deleted successfully.');
    }

}
