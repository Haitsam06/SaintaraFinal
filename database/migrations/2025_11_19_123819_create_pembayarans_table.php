<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->string('id_transaksi')->primary(); // Contoh: INV-20251123-001 or INST-20251123-ABC

            // ==========================================================
            // 1. DATA PEMBELI (DUAL USER SUPPORT)
            // ==========================================================
            
            // A. Untuk User Personal (Nullable)
            // Harus nullable agar bisa kosong saat Instansi yang beli
            $table->string('customer_id')->nullable(); 
            $table->foreign('customer_id')
                  ->references('id_customer')->on('customers')
                  ->onDelete('restrict');

            // B. Untuk User Instansi (Baru & Nullable)
            // Harus nullable agar bisa kosong saat Personal yang beli
            $table->string('instansi_id')->nullable();
            $table->foreign('instansi_id')
                  ->references('id_instansi')->on('instansi') // Pastikan nama tabel instansi kamu benar ('instansi' atau 'instansis')
                  ->onDelete('restrict');

            // ==========================================================
            // 2. DETAIL ITEM
            // ==========================================================
            $table->string('paket_id'); 
            $table->foreign('paket_id')->references('id_paket')->on('pakets')->onDelete('restrict');

            $table->integer('jumlah_token')->default(1); // Jumlah token yang dibeli

            // Mencatat harga DEAL saat transaksi terjadi (Snapshot Harga)
            $table->decimal('jumlah_bayar', 12, 2); // 12 digit, 2 desimal

            // ==========================================================
            // 3. STATUS & GATEWAY
            // ==========================================================
            $table->enum('status_pembayaran', ['berhasil', 'gagal', 'menunggu', 'kadaluarsa'])->default('menunggu');
            
            // Info Gateway (Midtrans)
            $table->string('id_gateway')->nullable(); // Order ID / Transaction ID dari Midtrans
            $table->string('metode_pembayaran')->nullable(); // bank_transfer, gopay, dll
            $table->text('url_pembayaran')->nullable(); // Link redirect Snap Midtrans

            // ==========================================================
            // 4. TIMESTAMP
            // ==========================================================
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