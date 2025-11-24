<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

<<<<<<< HEAD
    // Nama tabel di database
    protected $table = 'pembayarans';

    // Konfigurasi Primary Key (Karena bukan 'id' auto-increment)
    protected $primaryKey = 'id_transaksi';
    public $incrementing = false;
    protected $keyType = 'string';

    // Kolom yang boleh diisi (Mass Assignment)
=======
    // Nama tabel (Opsional jika sesuai standar, tapi biar aman kita tulis)
    protected $table = 'pembayarans';

    // 1. Primary Key
    protected $primaryKey = 'id_transaksi';

    // 2. MATIKAN Auto Increment (PENTING)
    // Karena ID transaksi kamu format string (misal: TRX-2025...)
    public $incrementing = false;
    protected $keyType = 'string';

    // 3. Kolom yang boleh diisi
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
    protected $fillable = [
        'id_transaksi',
        'customer_id',
        'paket_id',
<<<<<<< HEAD
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
=======
        'jumlah_bayar',
        'status_pembayaran', // 'berhasil', 'gagal', 'menunggu'
        'id_gateway',        // ID dari Midtrans
        'metode_pembayaran',
        'url_pembayaran',
        'waktu_dibayar',
        'waktu_kadaluarsa'
    ];

    protected $casts = [
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
        'waktu_dibayar' => 'datetime',
        'waktu_kadaluarsa' => 'datetime',
    ];

<<<<<<< HEAD
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
=======
    // --- RELASI ---

    // Transaksi ini milik siapa?
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }

    // Transaksi ini beli paket apa?
    public function paket()
    {
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
        return $this->belongsTo(Paket::class, 'paket_id', 'id_paket');
    }
}