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
            $table->string('id_token')->primary(); // PK: id_token [VARCHAR]

            // Foreign Keys
            $table->string('pembayaran_id'); // Mengacu ke id_transaksi (varchar)
            $table->foreign('pembayaran_id')->references('id_transaksi')->on('pembayarans')->onDelete('cascade');

            $table->string('customer_id')->nullable(); // Mengacu ke id_customer (varchar)
            $table->foreign('customer_id')->references('id_customer')->on('customers')->onDelete('set null');

            $table->enum('status', ['digunakan', 'belum digunakan', 'kadaluarsa'])->default('belum digunakan');
            $table->date('tglBeli');
            $table->date('tglPemakaian')->nullable();

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
