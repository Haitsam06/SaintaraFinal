<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('log_aktivitas', function (Blueprint $table) {
            $table->string('id_log')->primary(); // UUID

            $table->string('customer_id')->nullable();
            $table->foreign('customer_id')->references('id_customer')->on('customers')->onDelete('set null');

            $table->string('admin_id')->nullable();
            $table->foreign('admin_id')->references('id_admin')->on('admins')->onDelete('set null');

            $table->enum('aktivitas', ['login', 'logout', 'buat_data', 'ubah_data', 'hapus_data']);
            $table->string('keterangan')->nullable();

            // Koreksi: method ipAddress hanya butuh nama kolom
            $table->ipAddress('ip_address')->nullable(); 
            $table->string('user_agent')->nullable();

            $table->timestamps();

            // Koreksi: Gunakan array [] untuk composite index
            $table->index(['created_at', 'aktivitas']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};