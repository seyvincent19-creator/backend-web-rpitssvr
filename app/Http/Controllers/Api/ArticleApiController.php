<?php
    namespace App\Http\Controllers\Api;

    use App\Http\Controllers\Controller;
    use App\Models\Article;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;

    class ArticleApiController extends Controller
    {
        public function index()
        {
            $articles = Article::with('images', 'user')->where('status','published')->orderBy('id', 'desc')->paginate(5);
            return response()->json($articles);
        }

        public function store(Request $request)
        {
            $request->validate([
                'title'     => 'required|string|max:255',
                'content'   => 'required|string',
                'status'    => 'required|in:published,draft',
                'post_date' => 'required|date',
                'images.*'  => 'image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);

            $article = new Article();
            $article->title     = $request->title;
            $article->content   = $request->content;
            $article->status    = $request->status;
            $article->post_date = $request->post_date;
            $article->user_id   = Auth::id();
            $article->save();

            // Save multiple images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {
                    $path = $img->store('articles', 'public');
                    $article->images()->create(['image_path' => $path]);
                }
            }

            return response()->json(['message' => 'Article created successfully', 'article' => $article->load('images')], 201);
        }

        public function show($id)
        {
            $article = Article::with('images', 'user')->findOrFail($id);
            return response()->json($article);
        }

        public function update(Request $request, $id)
        {
            $article = Article::findOrFail($id);

            $article->update($request->only(['title', 'content', 'status', 'post_date']));

            // Optionally update images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {
                    $path = $img->store('articles', 'public');
                    $article->images()->create(['image_path' => $path]);
                }
            }

            return response()->json(['message' => 'Article updated', 'article' => $article->load('images')]);
        }

        public function destroy($id)
        {
            $article = Article::findOrFail($id);
            $article->images()->delete(); // delete image records
            $article->delete();           // delete article
            return response()->json(['message' => 'Article deleted']);
        }
    }
