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
        Schema::create('tokens', function (Blueprint $table) {
            // 1. Primary Key
            $table->string('id_token')->primary(); 

            // 2. Foreign Key ke PEMBAYARAN
            $table->string('pembayaran_id'); 
            $table->foreign('pembayaran_id')
                  ->references('id_transaksi')
                  ->on('pembayarans')
                  ->onDelete('cascade');

            // ==========================================================
            // 3. KEPEMILIKAN TOKEN (DUAL USER)
            // ==========================================================
            
            // A. Milik Personal (Nullable)
            $table->string('customer_id')->nullable(); 
            $table->foreign('customer_id')
                  ->references('id_customer')
                  ->on('customers')
                  ->onDelete('set null'); // Jika user dihapus, history token tetap ada (tanpa pemilik)

            // B. Milik Instansi (Baru & Nullable)
            $table->string('instansi_id')->nullable(); 
            $table->foreign('instansi_id')
                  ->references('id_instansi')
                  ->on('instansi') // Pastikan nama tabel di database 'instansi' (sesuai Model kamu)
                  ->onDelete('set null');

            // ==========================================================
            
            // 4. Foreign Key ke PAKET
            $table->string('paket_id'); 
            $table->foreign('paket_id')
                  ->references('id_paket')
                  ->on('pakets')
                  ->onDelete('cascade');

            // 5. Status & Waktu
            $table->enum('status', ['digunakan', 'belum digunakan', 'kadaluarsa'])->default('belum digunakan');
            
            // Mencatat Jam:Menit:Detik pemakaian
            $table->timestamp('tglPemakaian')->nullable();

            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens');
    }
};