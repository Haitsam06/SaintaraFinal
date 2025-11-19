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
        Schema::create('pakets', function (Blueprint $table) {
            $table->string('id_paket')->primary(); // PK: id_paket [varchar]
            $table->string('nama_paket');
            $table->integer('harga')->unsigned();
            $table->string('deskripsi')->nullable();
            $table->enum('tipe_paket', ['premium', 'standar', 'percobaan']);
            $table->integer('jumlah_karakter')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pakets');
    }
};
