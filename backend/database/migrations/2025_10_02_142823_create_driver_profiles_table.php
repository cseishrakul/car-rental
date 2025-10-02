<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('driver_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('license_number')->nullable();
            $table->string('nid')->nullable();
            $table->string('license_image')->nullable();
            $table->string('nid_image')->nullable();
            $table->string('profile_photo')->nullable();
            $table->integer('experience_years')->nullable();
            $table->enum('status',['pending','approved','rejected'])->default('pending');
            $table->foreignId('assigned_car_id')->nullable()->constrained('cars')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_profiles');
    }
};
