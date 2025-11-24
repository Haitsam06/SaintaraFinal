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
            // 1. Primary Key (String Unik: DSR-20251122-XXX)
            $table->string('id_token')->primary(); 

            // 2. Foreign Key ke PEMBAYARAN
            // Pastikan id_transaksi di tabel pembayarans tipe datanya STRING/VARCHAR
            $table->string('pembayaran_id'); 
            $table->foreign('pembayaran_id')
                  ->references('id_transaksi')
                  ->on('pembayarans')
                  ->onDelete('cascade');

            // 3. Foreign Key ke CUSTOMER (Nullable / Boleh Kosong untuk Stok)
            // Pastikan id_customer di tabel customers tipe datanya STRING/VARCHAR
            $table->string('customer_id')->nullable(); 
            $table->foreign('customer_id')
                  ->references('id_customer')
                  ->on('customers')
                  ->onDelete('set null');

            // 4. Foreign Key ke PAKET (INI YANG KURANG TADI)
            // Tipe STRING karena id_paket kamu isinya 'DSR', 'STD', 'PRM'
            $table->string('paket_id'); 
            $table->foreign('paket_id')
                  ->references('id_paket')
                  ->on('pakets')
                  ->onDelete('cascade');

            // 5. Status & Waktu
            $table->enum('status', ['digunakan', 'belum digunakan', 'kadaluarsa'])->default('belum digunakan');
            
            // Menggunakan timestamp agar mencatat Jam:Menit:Detik pemakaian
            $table->timestamp('tglPemakaian')->nullable();

            // created_at otomatis jadi Tanggal Beli
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