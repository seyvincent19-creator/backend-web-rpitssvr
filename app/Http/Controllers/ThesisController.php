<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ThesisController extends Controller
{
    public function index()
    {
        $thesis = Thesis::orderBy('created_at', 'desc')
                    ->paginate(10);; // or all() but pagination preferred

        // Pass data with proper structure for Inertia pagination
        return Inertia::render('Thesis/Index', [
            'thesis' => $thesis,
            
        ]);
    }

    public function create()
    {
        return inertia('Thesis/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'student' => 'required|string',
            'supervisor' => 'required|string',
            'major' => 'required|string',
            'year' => 'required|integer',
            'type' => 'required|string',
            'category' => 'required|string',
            'language' => 'required|string',
            'pages' => 'required|integer',
            'url' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $thesis = new Thesis($request->except('image'));

        if ($request->hasFile('image')) {
            $thesis->image = $request->file('image')->store('thesis', 'public');
        }

        $thesis->save();

        return redirect()->route('thesis.index')->with('success', 'Thesis created successfully.');
    }


    public function show($id)
    {
        $thesis = Thesis::findOrFail($id);
        return view('theses.show', compact('thesis'));
    }

    public function edit($id)
    {
        $thesis = Thesis::findOrFail($id);
        return Inertia::render('Thesis/Index', ['thesis' => Thesis::orderBy('created_at','desc')->paginate(10)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'      => 'required|string|max:500',
            'student'    => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'major'      => 'required|string|max:255',
            'year'       => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'type'       => 'required|string|max:100',
            'category'   => 'required|string|max:255',
            'language'   => 'required|string|max:100',
            'pages'      => 'required|integer|min:1',
            'url'        => 'required|url|max:2048',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $thesis = Thesis::findOrFail($id);

        $thesis->title      = $request->title;
        $thesis->student    = $request->student;
        $thesis->supervisor = $request->supervisor;
        $thesis->major      = $request->major;
        $thesis->year       = $request->year;
        $thesis->type       = $request->type;
        $thesis->category   = $request->category;
        $thesis->language   = $request->language;
        $thesis->pages      = $request->pages;
        $thesis->url        = $request->url;

        if ($request->hasFile('image')) {
            if ($thesis->image) {
                Storage::disk('public')->delete($thesis->image);
            }
            $thesis->image = $request->file('image')->store('thesis', 'public');
        }

        $thesis->save();

        return redirect()->route('thesis.index')->with('success', 'Thesis updated successfully.');
    }


    public function destroy($id)
    {
        $thesis = Thesis::findOrFail($id);

        if ($thesis->image) {
            Storage::disk('public')->delete($thesis->image);
        }

        $thesis->delete();

        return redirect()->route('thesis.index')->with('success', 'Thesis deleted successfully.');
    }
}
