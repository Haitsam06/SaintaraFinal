<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel instansi (PK: id_instansi, tipe varchar)
            $table->string('instansi_id', 20);

            $table->foreign('instansi_id')
                ->references('id_instansi')
                ->on('instansi')
                ->cascadeOnDelete();

            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('open'); // open / in_progress / closed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
