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
            $table->uuid('id_keuangan')->primary();
            $table->enum('tipe', ['pemasukan', 'pengeluaran']);

            // Tambahkan Kategori agar bisa filter khusus 'gaji'
            $table->string('kategori')->default('umum'); // Contoh: 'gaji', 'operasional', 'penjualan'

            $table->bigInteger('jumlah'); // Total yang dibayarkan
            $table->text('deskripsi');
            $table->date('tanggal_transaksi');

            // Tambahkan Status (Lunas/Pending)
            $table->string('status_pembayaran')->default('lunas');

            // Tambahkan kolom JSON untuk menyimpan rincian (Gaji Pokok, Bonus, Potongan)
            // Agar tidak perlu buat banyak kolom terpisah
            $table->json('detail')->nullable();

            // Relasi
            $table->string('transaksi_id')->nullable();

            // Admin ID di sini berfungsi sebagai:
            // 1. Pencatat transaksi (jika kategori umum)
            // 2. Penerima Gaji (jika kategori gaji)
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
