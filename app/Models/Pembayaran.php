<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'pembayarans';

    // Konfigurasi Primary Key (Karena bukan 'id' auto-increment)
    protected $primaryKey = 'id_transaksi';
    public $incrementing = false;
    protected $keyType = 'string';

    // Kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'id_transaksi',
        'customer_id',
        'paket_id',
        'status_pembayaran',
        'id_gateway',
        'metode_pembayaran',
        'url_pembayaran',
        'waktu_dibuat',
        'waktu_dibayar',
        'waktu_kadaluarsa',
    ];

    // Konversi otomatis kolom tanggal menjadi Carbon Instance
    protected $casts = [
        'waktu_dibuat' => 'datetime',
        'waktu_dibayar' => 'datetime',
        'waktu_kadaluarsa' => 'datetime',
    ];

    /**
     * Relasi ke Customer
     * (Pembayaran milik satu Customer)
     */
    public function customer()
    {
        // Parameter: (ModelTujuan, FK_di_tabel_ini, PK_di_tabel_tujuan)
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }

    /**
     * Relasi ke Paket
     * (Pembayaran membeli satu Paket)
     * Digunakan untuk mengambil data 'harga' di Dashboard
     */
    public function paket()
    {
        // Pastikan Model Paket juga memiliki primary key 'id_paket' jika string
        return $this->belongsTo(Paket::class, 'paket_id', 'id_paket');
    }
}