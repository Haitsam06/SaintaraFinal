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
        Schema::create('bantuans', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke customer (karena ini personal dashboard)
            // Pastikan 'id_customer' dan 'customers' sesuai dengan tabel kamu
            $table->string('customer_id')->nullable();
            $table->foreign('customer_id')
                  ->references('id_customer')
                  ->on('customers')
                  ->onDelete('set null');

            $table->string('subject');
            $table->string('category');
            $table->text('description');
            $table->enum('status', ['pending', 'diproses', 'selesai'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bantuans');
    }
};