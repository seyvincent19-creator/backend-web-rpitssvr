<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EbookController;
use App\Http\Controllers\ThesisController;
use App\Models\Article;
use App\Models\Ebook;
use App\Models\Department;
use App\Models\Thesis;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;

// Homepage (Inertia view)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');
// clear-cache
Route::get('/clear-cache', function() {
  Artisan::call('config:clear');
  Artisan::call('cache:clear');
  Artisan::call('view:clear');
  return "Cache is cleared";
});

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', function () {
        $recentArticles = Article::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'status', 'created_at', 'user_id', 'thumbnail']);

        return Inertia::render('Dashboard', [
            'stats' => [
                'articles'    => Article::count(),
                'published'   => Article::where('status', 'published')->count(),
                'draft'       => Article::where('status', 'draft')->count(),
                'ebooks'      => Ebook::count(),
                'departments' => Department::count(),
                'thesis'      => Thesis::count(),
                'courses'     => Course::count(),
            ],
            'recentArticles' => $recentArticles,
            'authUser'       => ['name' => Auth::user()->name, 'email' => Auth::user()->email],
        ]);
    })->name('dashboard');

    // Articles CRUD
    Route::resource('articles', ArticleController::class);
    // Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    // Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    // Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    // Edit Article Modal / Update
    // Route::get('/articles/{article}/edit', [ArticleController::class, 'edit'])->name('articles.edit');
    // Route::put('/articles/{article}', [ArticleController::class, 'update'])->name('articles.update');
    // Department CRUD
    Route::get('/departments', [DepartmentController::class, 'Index'])->name('departments.index');
    Route::get('/departments/create', [DepartmentController::class, 'create'])->name('departments.create');
    Route::post('/departments', [DepartmentController::class, 'Store'])->name('departments.store');
    // Edit Department Modal / Update
    Route::get('/departments/{department}/edit', [DepartmentController::class, 'departmentsEdit'])->name('departments.edit');
    Route::put('/departments/{department}', [DepartmentController::class, 'departmentsUpdate'])->name('departments.update');
    Route::post('/departments/{department}', [DepartmentController::class, 'departmentsUpdate']);
    // Course CRUD
    // (Similar routes for CourseController can be added here)
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::post('/courses/{course}', [CourseController::class, 'update']);
    //ebooks CRUD
    Route::resource('ebooks', EbookController::class);

    // Route::get('/ebooks', [EbookController::class, 'index'])->name('ebooks.index');
    // Route::get('/ebooks/create', [EbookController::class, 'create'])->name('ebooks.create');
    // Route::post('/ebooks', [EbookController::class, 'store'])->name('ebooks.store');
    // // Edit ebooks Modal / Update
    // Route::get('/ebooks/{ebook}/edit', [EbookController::class, 'edit'])->name('ebooks.edit');
    // Route::post('/ebooks/{id}', [EbookController::class, 'update'])->name('ebooks.update');

    // Route::delete('/ebooks/{ebook}', [EbookController::class, 'destroy'])->name('ebooks.destroy');
    // Thesis CRUD
    Route::resource('thesis', ThesisController::class);
    // e-publications CRUD
    // (Similar routes for EpublicationsController can be added here)
    Route::resource('epublications', 'App\Http\Controllers\EpublicationsController');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
