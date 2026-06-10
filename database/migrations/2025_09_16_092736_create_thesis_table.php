<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThesisTable extends Migration
{
    public function up()
    {
        Schema::create('thesis', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('student');
            $table->string('supervisor');
            $table->string('major');
            $table->integer('year');
            $table->string('type');
            $table->string('category');
            $table->string('language');
            $table->string('pages')->nullable();
            $table->string('url');
            $table->string('image');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('theses');
    }
}
