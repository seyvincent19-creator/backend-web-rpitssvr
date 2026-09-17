<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Video extends Model
{
    use HasFactory;

    protected $table = 'videos';

    protected $fillable = [
        'title',
        'creator',
        'description',
        'duration',
        'format',
        'resolution',
        'language',
        'upload_date',
        'tags',
        'url',
        'image',
    ];

    protected $casts = [
        'upload_date' => 'date',
        'tags' => 'array',
    ];
}
