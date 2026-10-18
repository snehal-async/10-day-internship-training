<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')
                ->constrained('departments')
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('email', 150)->unique();
            $table->string('job_title', 100);
            $table->decimal('salary', 10, 2);
            $table->date('hire_date');
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->index('salary');
            $table->index('hire_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
