<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            // PERBAIKAN UTAMA: Gunakan increments() agar ID otomatis (Auto Increment)
            $table->increments('id_review');

            // Foreign Keys (String/Char sesuai format ID Anda)
            $table->string('id_customer')->nullable();
            $table->string('id_admin')->nullable();
            $table->string('id_instansi')->nullable(); // Sesuai ejaan di Model Anda

            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};