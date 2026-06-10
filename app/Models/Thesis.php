<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thesis extends Model
{
    protected $table = 'thesis';
    protected $fillable = [
        'title',
        'student',
        'supervisor',
        'major',
        'year',
        'type',
        'category',
        'language',
        'pages',
        'url',
        'image',
    ];
}

