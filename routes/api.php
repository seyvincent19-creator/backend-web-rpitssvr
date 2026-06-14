<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\Api\ArticleApiController;
use App\Http\Controllers\Api\EbookApiController;
use App\Http\Controllers\Api\ThesisApiController;
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/articles', [ArticleApiController::class, 'index']);
//     // Add other article routes here if needed
// });
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/articles/{id}', [ArticleApiController::class, 'show']);
// });

Route::apiResource('ebooks', EbookApiController::class)->names([
    'index' => 'api.ebooks.index',
    'store' => 'api.ebooks.store',
    'update' => 'api.ebooks.update',
    'show' => 'api.ebooks.show',
    'destroy' => 'api.ebooks.destroy',
    'showById' => 'api.ebooks.showbyid',
    // ... other methods
]);

Route::apiResource('thesis', ThesisApiController::class)->names([
    'index' => 'api.thesis.index',
    'store' => 'api.thesis.store',
    'update' => 'api.thesis.update',
    'show' => 'api.thesis.show',    
    'destroy' => 'api.thesis.destroy',
    
    // ... other methods        
]);

// Public route: anyone can get articles without token
Route::get('/articles', [ArticleApiController::class, 'index']);

// Public route for single article
Route::get('/articles/{id}', [ArticleApiController::class, 'show']);

Route::post('/register', function (Request $request) {
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
    ]);

    return response()->json(['message' => 'User registered successfully']);
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->tokens()->delete();
    return response()->json(['message' => 'Logged out']);
});
Route::get('/test-token', function() {
    return response()->json([
        'token' => 'test-token-123',
        'message' => 'This is a test response',
    ]);
});

// Department API routes
use App\Http\Controllers\Api\DepartmentApiController;   
Route::get('/departments', [DepartmentApiController::class, 'index']);
Route::get('/departments/{id}', [DepartmentApiController::class, 'show']);

use App\Http\Controllers\Api\StudentApiController;

Route::apiResource('students', StudentApiController::class);

// Translation proxy — avoids CORS; chunks long text to stay under Google's ~4000-char limit
Route::post('/translate', function (Request $request) {
    $text = $request->input('text', '');
    if (!$text) return response()->json(['result' => '']);

    // Split into paragraphs, then batch into ≤3500-char chunks
    $lines   = preg_split('/\r\n|\r|\n/', $text);
    $chunks  = [];
    $current = '';

    foreach ($lines as $line) {
        if (strlen($current) + strlen($line) + 1 > 3500) {
            if ($current !== '') $chunks[] = $current;
            // If a single line is itself too long, split by sentence (~。.!?)
            if (strlen($line) > 3500) {
                $sentences = preg_split('/(?<=[។.!?])\s+/', $line);
                $sub = '';
                foreach ($sentences as $s) {
                    if (strlen($sub) + strlen($s) + 1 > 3500) {
                        if ($sub !== '') $chunks[] = $sub;
                        $sub = $s;
                    } else {
                        $sub = $sub === '' ? $s : $sub . ' ' . $s;
                    }
                }
                $current = $sub;
            } else {
                $current = $line;
            }
        } else {
            $current = $current === '' ? $line : $current . "\n" . $line;
        }
    }
    if ($current !== '') $chunks[] = $current;

    $translated = [];
    foreach ($chunks as $chunk) {
        $response = \Illuminate\Support\Facades\Http::get('https://translate.googleapis.com/translate_a/single', [
            'client' => 'gtx',
            'sl'     => 'km',
            'tl'     => 'en',
            'dt'     => 't',
            'q'      => $chunk,
        ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Translation failed on chunk'], 500);
        }

        $data         = $response->json();
        $translated[] = collect($data[0])->map(fn($item) => $item[0])->join('');
    }

    return response()->json(['result' => implode("\n", $translated)]);
});
