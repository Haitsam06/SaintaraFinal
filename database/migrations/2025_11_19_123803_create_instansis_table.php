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
        // HAPUS 's' DISINI. Dari 'instansis' menjadi 'instansi'
        Schema::create('instansi', function (Blueprint $table) {

            $table->string('id_instansi')->primary(); // ID Custom

           
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null');
            $table->string('nama_instansi');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('no_telp')->nullable();
            $table->text('alamat')->nullable();
            $table->string('pic_name')->nullable();
            $table->string('bidang')->nullable();
            $table->string('status_akun')->default('aktif');
            $table->text('foto')->nullable();
            $table->date('tanggal_dibuat')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Ubah ini juga jadi 'instansi'
        Schema::dropIfExists('instansi');
    }
};
