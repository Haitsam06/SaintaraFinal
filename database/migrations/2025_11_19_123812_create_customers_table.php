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
        Schema::create('customers', function (Blueprint $table) {
            $table->string('id_customer')->primary();
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null');

            $table->string('nama_lengkap'); // Di seeder nanti pakai 'nama_lengkap'
            $table->string('nama_panggilan')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('no_telp')->nullable();

            // Kolom tambahan
            $table->text('alamat')->nullable();
            $table->string('negara')->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->string('kota')->nullable();

            $table->string('jenis_kelamin')->nullable();

            $table->enum('gol_darah', ['A', 'B', 'AB', 'O', 'Tidak Tahu'])->nullable();
            $table->text('foto')->nullable();

            $table->string('status_akun')->default('aktif'); // <--- TAMBAHKAN INI JUGA

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
