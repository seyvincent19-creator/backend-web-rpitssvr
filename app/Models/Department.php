<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['title_khmer','title_eng', 'description'];

    public function images()
    {
        return $this->hasMany(DepartmentImage::class);
    }

    public function skills()
    {
        return $this->hasMany(DepartmentSkill::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
    public function descriptionImages()
    {
        return $this->hasMany(DepartmentImage::class)->where('type', 'description');
    }
}
