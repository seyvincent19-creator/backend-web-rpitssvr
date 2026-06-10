<?php

// app/Models/Student.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'last_name_kh',
        'first_name_kh',
        'last_name_en',
        'first_name_en',
        'phone',
        'email',
        //'department',
        'major',
        'year',
        'photo_path',
    ];
}

