<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EPublication extends Model
{
    use HasFactory;

    protected $table = 'e_publications';

    protected $fillable = [
        'title',
        'author',
        'year',
        'publisher',
        'language',
        'pages',
        'location',
        'url',
        'image',
    ];

    protected $casts = [
        'year' => 'integer',
        'pages' => 'integer',
    ];
}
