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
        Schema::create('keuangans', function (Blueprint $table) {
            $table->uuid('id_keuangan')->primary(); // PK: UUID
            $table->enum('tipe', ['pemasukan', 'pengeluaran']);
            $table->bigInteger('jumlah'); // Jumlah uang
            $table->text('deskripsi');
            $table->date('tanggal_transaksi');

            // Relasi opsional: menghubungkan ke tabel pembayaran untuk pemasukan
            $table->string('transaksi_id')->nullable();
            $table->foreign('transaksi_id')->references('id_transaksi')->on('pembayarans')->onDelete('set null');

            // Relasi opsional: siapa yang mencatat/bertanggung jawab
            $table->string('admin_id')->nullable();
            $table->foreign('admin_id')->references('id_admin')->on('admins')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keuangans');
    }
};
