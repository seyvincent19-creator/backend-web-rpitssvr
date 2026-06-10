<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleImage extends Model
{
    // Allow mass assignment of 'path'
    protected $fillable = ['image_path'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
