<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use App\Models\Paket; // TAMBAHKAN INI jika Anda ingin membuat relasi ke Paket

class Token extends Model
{
    use HasFactory;

    protected $table = 'tokens';
    protected $primaryKey = 'id_token';
    protected $keyType = 'string';
    public $incrementing = false;

    // Tambahkan 'paket_id' di sini karena kolom ini wajib (NOT NULL)
    protected $fillable = [
        'id_token',
        'pembayaran_id', 
        'customer_id',
        'paket_id',       // <-- PERBAIKAN UTAMA: Tambahkan paket_id
        'status',
        'tglBeli',
        'tglPemakaian',
    ];

    protected $casts = [
        'tglBeli' => 'date',
        'tglPemakaian' => 'date',
    ];

    // Relasi ke Customer 
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }

    // Relasi ke Paket (Disarankan untuk ditambahkan)
    public function paket()
    {
        return $this->belongsTo(Paket::class, 'paket_id', 'id_paket');
    }
}