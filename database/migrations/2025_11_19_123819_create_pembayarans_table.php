<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->string('id_transaksi')->primary(); // Contoh: INV-20251123-001

            // Foreign Keys
            $table->string('customer_id'); 
            // Opsional: Ganti 'cascade' jadi 'restrict' agar data keuangan aman
            $table->foreign('customer_id')->references('id_customer')->on('customers')->onDelete('restrict');

            $table->string('paket_id'); 
            $table->foreign('paket_id')->references('id_paket')->on('pakets')->onDelete('restrict');

            $table->integer('jumlah_token')->default(1); // Jumlah token yang dibeli

            // --- TAMBAHAN PENTING: HARGA ---
            // Mencatat harga DEAL saat transaksi terjadi (Snapshot Harga)
            $table->decimal('jumlah_bayar', 12, 2); // 12 digit, 2 desimal
            // -------------------------------

            $table->enum('status_pembayaran', ['berhasil', 'gagal', 'menunggu', 'kadaluarsa'])->default('menunggu');
            
            // Info Gateway (Midtrans/Xendit)
            $table->string('id_gateway')->nullable(); // Transaction ID dari Midtrans
            $table->string('metode_pembayaran')->nullable(); // bank_transfer, gopay, dll
            $table->text('url_pembayaran')->nullable(); // Link redirect pembayaran

            // Waktu
            // 'waktu_dibuat' dihapus karena sudah diwakili created_at
            $table->dateTime('waktu_dibayar')->nullable(); // Kapan status berubah jadi 'berhasil'
            $table->dateTime('waktu_kadaluarsa')->nullable();

            $table->timestamps(); // created_at = waktu invoice dibuat
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};