<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('first_name_en');
            $table->date('dob')->nullable()->after('gender');
            $table->string('national_id')->nullable()->after('dob');
            $table->string('province')->nullable()->after('email');
            $table->string('address')->nullable()->after('province');
            $table->string('guardian_name')->nullable()->after('address');
            $table->string('guardian_phone')->nullable()->after('guardian_name');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['gender', 'dob', 'national_id', 'province', 'address', 'guardian_name', 'guardian_phone']);
        });
    }
};
