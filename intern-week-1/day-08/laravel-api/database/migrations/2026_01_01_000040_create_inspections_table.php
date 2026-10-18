<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_id')
                ->constrained('facilities')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('inspector_id')
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->string('inspection_number', 50)->unique();
            $table->date('inspection_date');
            $table->string('result', 20);
            $table->integer('score');
            $table->text('notes')->nullable();
            $table->boolean('follow_up_required')->default(false);
            $table->date('follow_up_date')->nullable();
            $table->timestamps();

            $table->index('inspection_date');
            $table->index('score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};
