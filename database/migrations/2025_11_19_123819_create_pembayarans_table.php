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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->string('id_transaksi')->primary(); // PK: id_transaksi [varchar]

            // Foreign Keys
            $table->string('customer_id'); // Mengacu ke id_customer (varchar)
            $table->foreign('customer_id')->references('id_customer')->on('customers')->onDelete('cascade');

            $table->string('paket_id'); // Mengacu ke id_paket (varchar)
            $table->foreign('paket_id')->references('id_paket')->on('pakets')->onDelete('restrict');

            $table->enum('status_pembayaran', ['berhasil', 'gagal', 'menunggu'])->default('menunggu');
            $table->string('id_gateway')->nullable();
            $table->string('metode_pembayaran');
            $table->text('url_pembayaran')->nullable();

            // Waktu (menggunakan kolom datetime untuk presisi)
            $table->dateTime('waktu_dibuat');
            $table->dateTime('waktu_dibayar')->nullable();
            $table->dateTime('waktu_kadaluarsa')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
