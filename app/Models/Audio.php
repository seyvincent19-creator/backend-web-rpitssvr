<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Audio extends Model
{
    use HasFactory;

    protected $table = 'audios';

    protected $fillable = [
        'title',
        'author',
        'year',
        'publisher',
        'type',
        'category',
        'language',
        'location',
        'duration',
        'url',
        'image',
    ];

    protected $casts = [
        'year' => 'integer',
    ];
}
