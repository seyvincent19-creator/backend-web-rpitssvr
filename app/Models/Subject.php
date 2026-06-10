<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['semester_id', 'name'];

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}

