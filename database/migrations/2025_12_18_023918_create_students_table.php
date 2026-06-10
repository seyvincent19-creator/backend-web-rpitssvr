<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('last_name_kh');
            $table->string('first_name_kh');
            $table->string('last_name_en');
            $table->string('first_name_en');
            $table->string('phone');
            $table->string('email')->nullable();
            //$table->string('department')->nullable();
            $table->string('major');
            $table->string('year');
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
