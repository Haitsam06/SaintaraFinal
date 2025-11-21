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
        Schema::create('admins', function (Blueprint $table) {
            $table->string('id_admin')->primary(); // PK: id_admin [varchar]
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null'); // FK: user (role)
            $table->string('nama_admin');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('no_telp')->nullable();

            $table->enum('status_akun', ['aktif', 'tidak aktif'])->default('aktif');
            $table->text('foto')->nullable();

            $table->date('tanggal_dibuat'); // Sesuai skema Anda
            $table->timestamps(); // Menggantikan created_at, ada updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
