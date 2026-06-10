<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Inertia\Inertia;
use App\Models\ArticleImage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{
    public function index()
    {
        // Fetch articles with pagination or all
        $articles = Article::with('images')
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
        $users = User::all(); // or filter as needed

        // Return Inertia view (adjust path as per your setup)
        // return inertia('Articles/Index', [
        //     'articles' => $articles,
        // ]);
        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'users' => $users,
        ]);
    }

    public function create()
    {
        // return Inertia view or blade with your form
        return inertia('Articles/Create');
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'post_date' => 'required|date',
            'status' => 'required|in:published,draft',
            'user' => 'required|exists:users,id',
            'thumbnail' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $article = new Article();
        $article->title = $request->title;
        $article->content = $request->content;
        $article->created_at = $request->post_date; // Use a post_date field on DB for this
        $article->status = $request->status;
        $article->user_id = $request->user;
        $article->thumbnail = $thumbnailPath;
        $article->save();

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('articles', 'public');
                logger("Saving image with path: $path"); // debug line
                $article->images()->create([
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->route('articles.index')->with('success', 'Article created successfully.');
    }


public function update(Request $request, Article $article)
{

    // Build validation rules — thumbnail/images only validated when files are actually uploaded
    // (Inertia sends null values as empty strings in FormData, which would fail image rule)
    $rules = [
        'title'           => 'required|string|max:255',
        'content'         => 'required|string',
        'status'          => 'required|in:published,draft',
        'created_at'      => 'required|date',
        'updated_at'      => 'nullable|date',
        'user'            => 'required|exists:users,id',
        'thumbnail'       => 'nullable',
        'images'          => 'nullable|array',
        'images.*'        => 'nullable',
        'remove_images'   => 'nullable|array',
        'remove_images.*' => 'integer|exists:article_images,id',
    ];

    if ($request->hasFile('thumbnail')) {
        $rules['thumbnail'] = 'file|image|max:2048';
    }

    if ($request->hasFile('images')) {
        $rules['images.*'] = 'file|image|max:2048';
    }

    $validated = $request->validate($rules);


    // Begin update of article fields
    $article->title   = $validated['title'];
    $article->content = $validated['content'];
    $article->status  = $validated['status'];
    $article->user_id = $validated['user'];

    // Set created_at and updated_at (respecting user input)
    $article->created_at = Carbon::parse($validated['created_at']);
    $article->updated_at = isset($validated['updated_at'])
        ? Carbon::parse($validated['updated_at'])
        : now();

    // Handle thumbnail replacement (optional)
    if ($request->hasFile('thumbnail')) {
        // delete old thumbnail if exists
        // if ($article->thumbnail) {
        //     Storage::disk('public')->delete($article->thumbnail);
        // }
        $path = $request->file('thumbnail')->store('thumbnails', 'public');
        $article->thumbnail = $path;
    }

    $article->save();

    // Handle removing existing images
    $toRemove = $request->input('remove_images', []);
    if (!empty($toRemove)) {
        $imagesToDelete = ArticleImage::whereIn('id', $toRemove)->where('article_id', $article->id)->get();
        foreach ($imagesToDelete as $img) {
            if ($img->image_path) {
                Storage::disk('public')->delete($img->image_path);
            }
            $img->delete();
        }
    }

    // Handle new images upload (optional)
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            if ($file) {
                $path = $file->store('articles', 'public');
                $article->images()->create([
                    'image_path' => $path,
                ]);
            }
        }
    }
    // Log::info('Uploading thumbnail: ' . ($request->hasFile('thumbnail') ? 'yes' : 'no'));
    // Log::info('Uploading images count: ' . count($request->file('images', [])));

    return redirect()->back()->with('success', 'Article updated successfully.');
}

public function show(Article $article)
{
    $article->load(['images', 'user']);

    return Inertia::render('Articles/Show', [
        'article' => $article,
    ]);
}

}
