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
        Schema::create('instansis', function (Blueprint $table) {
            $table->id('id_instansi'); // Menggunakan id custom jika harus varchar
            $table->string('nama_instansi')->unique();
            $table->string('no_instansi')->nullable();
            $table->string('nama_owner');
            $table->string('email')->unique();
            $table->string('no_telp');
            $table->string('website')->nullable();
            $table->text('alamat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instansis');
    }
};
