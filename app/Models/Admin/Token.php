<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Customer; // <--- PERBAIKAN: Gunakan Model Customer

class Token extends Model
{
    use HasFactory;

    protected $table = 'tokens';
    protected $primaryKey = 'id_token';
    protected $keyType = 'string';
    public $incrementing = false;

    // Sesuai tabel Anda (tanpa paket_id)
    protected $fillable = [
        'id_token',
        'pembayaran_id', // Wajib
        'customer_id',   // Nullable
        'status',
        'tglBeli',
        'tglPemakaian',
    ];

    protected $casts = [
        'tglBeli' => 'date',
        'tglPemakaian' => 'date',
    ];

    // Relasi ke Customer (Opsional, untuk ditampilkan di tabel)
    public function customer()
    {
        // Ubah User::class menjadi Customer::class
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }
}