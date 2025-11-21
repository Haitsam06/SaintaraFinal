<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('calendars', function (Blueprint $table) {
            $table->id('id_kalender');
            $table->string('nama_agenda');
            $table->date('tanggal');

            // --- TAMBAHKAN BARIS INI ---
            $table->string('waktu'); // Menyimpan string seperti "10:00 - 12:00"
            // ---------------------------

            $table->text('deskripsi')->nullable();

            // Foreign Key ke Admin
            $table->string('admin_id');
            $table->foreign('admin_id')->references('id_admin')->on('admins')->onDelete('cascade');

            // Kolom tipe (warna dot: blue, green, red)
            $table->string('tipe')->default('blue');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendars');
    }
};
