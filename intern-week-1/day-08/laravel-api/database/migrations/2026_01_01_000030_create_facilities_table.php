<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('facility_code', 30)->unique();
            $table->string('facility_type', 50);
            $table->string('address', 255);
            $table->string('city', 100);
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('condition_rating', 20)->default('good');
            $table->string('status', 20)->default('operational');
            $table->integer('capacity')->nullable();
            $table->timestamps();

            $table->index('condition_rating');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
