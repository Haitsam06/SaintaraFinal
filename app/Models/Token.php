<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    // 1. Tentukan Primary Key (Karena bukan 'id')
    protected $primaryKey = 'id_token';

    // 2. MATIKAN Auto Increment (PENTING!)
    // Karena ID kamu formatnya String unik (contoh: DSR-20251123-XK9), bukan angka 1, 2, 3
    public $incrementing = false;

    // 3. Tentukan Tipe Data Primary Key
    protected $keyType = 'string';

    // 4. Daftar kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'id_token',
        'pembayaran_id',
        'customer_id',
        'paket_id',
        'status',       // 'digunakan', 'belum digunakan', 'kadaluarsa'
        'tglPemakaian',
    ];

    // 5. Casting Tipe Data (Opsional tapi berguna)
    protected $casts = [
        'tglPemakaian' => 'datetime', // Agar otomatis jadi objek Carbon (bisa diformat tanggalnya)
    ];

    // --- RELASI (RELATIONSHIPS) ---

    // Token ini jenis paket apa? (Ke Model Paket)
    public function paket()
    {
        // belongsTo(ModelTujuan, Foreign_Key_Di_Sini, Owner_Key_Di_Sana)
        return $this->belongsTo(Paket::class, 'paket_id', 'id_paket');
    }

    // Token ini milik siapa? (Ke Model Customer)
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }

    // Token ini dari transaksi mana? (Ke Model Pembayaran)
    public function pembayaran()
    {
        return $this->belongsTo(Pembayaran::class, 'pembayaran_id', 'id_transaksi');
    }
}