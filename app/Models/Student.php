<?php

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
        'gender',
        'dob',
        'national_id',
        'phone',
        'email',
        'province',
        'address',
        'guardian_name',
        'guardian_phone',
        'major',
        'year',
        'photo_path',
    ];
}
