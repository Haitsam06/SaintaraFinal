<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bantuans', function (Blueprint $table) {
            $table->id();

            // Relasi ke customer
            $table->string('customer_id')->nullable();
            $table->foreign('customer_id')
                ->references('id_customer')
                ->on('customers')
                ->onDelete('set null');

            $table->string('subject');
            $table->string('category')->nullable();
            $table->text('description');

            // HAPUS priority
            // $table->enum('priority', ...); 

            // Status (Pending, Diproses, Selesai)
            $table->enum('status', ['pending', 'diproses', 'selesai'])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bantuans');
    }
};