<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ebook extends Model
{
    use HasFactory;

    // The table associated with the model (optional if follows Laravel naming conventions)
    protected $table = 'ebooks';

    // The attributes that are mass assignable.
    protected $fillable = [
        'title',
        'author',
        'year',
        'publisher',
        'language',
        'pages',
        'category',
        'url',
        'image',
    ];

    // If you want to cast any fields automatically, e.g. year as integer
    protected $casts = [
        'year' => 'integer',
        'pages' => 'integer',
    ];

    // Add any relationships, accessors, or custom methods below
}
