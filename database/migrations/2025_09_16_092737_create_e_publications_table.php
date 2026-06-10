<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEPublicationsTable extends Migration
{
    public function up()
    {
        Schema::create('e_publications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->integer('year');
            $table->string('publisher');
            $table->string('language');
            $table->integer('pages');
            $table->string('location');
            $table->string('url');
            $table->string('image');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('e_publications');
    }
}
