<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DepartmentImage extends Model
{
    use HasFactory;

    protected $fillable = ['department_id', 'type', 'path'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}

