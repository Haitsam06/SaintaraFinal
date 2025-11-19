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
            $table->string('id_customer')->primary(); // PK: id_customer [varchar]
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null'); // FK: user (role)
            $table->string('nama_lengkap');
            $table->string('nama_panggilan')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('no_telp')->nullable();

            // Kolom tambahan
            $table->string('negara')->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->string('kota')->nullable();
            $table->enum('jenis_kelamin', ['pria', 'wanita'])->nullable();
            $table->enum('gol_darah', ['A', 'B', 'AB', 'O', 'Tidak Tahu'])->nullable();
            $table->text('foto')->nullable();

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
