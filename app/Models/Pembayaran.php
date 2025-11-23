<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    // Nama tabel (Opsional jika sesuai standar, tapi biar aman kita tulis)
    protected $table = 'pembayarans';

    // 1. Primary Key
    protected $primaryKey = 'id_transaksi';

    // 2. MATIKAN Auto Increment (PENTING)
    // Karena ID transaksi kamu format string (misal: TRX-2025...)
    public $incrementing = false;
    protected $keyType = 'string';

    // 3. Kolom yang boleh diisi
    protected $fillable = [
        'id_transaksi',
        'customer_id',
        'paket_id',
        'jumlah_bayar',
        'status_pembayaran', // 'berhasil', 'gagal', 'menunggu'
        'id_gateway',        // ID dari Midtrans
        'metode_pembayaran',
        'url_pembayaran',
        'waktu_dibayar',
        'waktu_kadaluarsa'
    ];

    protected $casts = [
        'waktu_dibayar' => 'datetime',
        'waktu_kadaluarsa' => 'datetime',
    ];

    // --- RELASI ---

    // Transaksi ini milik siapa?
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }

    // Transaksi ini beli paket apa?
    public function paket()
    {
        return $this->belongsTo(Paket::class, 'paket_id', 'id_paket');
    }
}