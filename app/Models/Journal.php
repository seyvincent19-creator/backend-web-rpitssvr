<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Journal extends Model
{
    use HasFactory;

    protected $table = 'journals';

    protected $fillable = [
        'title',
        'abstract',
        'author',
        'published',
        'language',
        'pages',
        'url',
        'image',
    ];

    protected $casts = [
        'pages' => 'integer',
        'published' => 'date',
    ];
}
