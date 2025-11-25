<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Token extends Model
{
    use HasFactory;

    // 1. Tentukan Primary Key
    protected $primaryKey = 'id_token';

    // 2. MATIKAN Auto Increment
    public $incrementing = false;

    // 3. Tipe Data Primary Key
    protected $keyType = 'string';

    // 4. Mass Assignment
    protected $fillable = [
        'id_token',
        'pembayaran_id',
        'customer_id',
        'paket_id',
        'status',       // 'digunakan', 'belum digunakan', 'kadaluarsa'
        'tglPemakaian',
    ];

    // 5. Casting
    protected $casts = [
        'tglPemakaian' => 'datetime',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];

    // --- RELASI (RELATIONSHIPS) ---

    public function paket()
    {
        return $this->belongsTo(Paket::class, 'paket_id', 'id_paket');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }

    public function pembayaran()
    {
        return $this->belongsTo(Pembayaran::class, 'pembayaran_id', 'id_transaksi');
    }

    // ==========================================
    // TAMBAHAN: LOCAL SCOPES (Query Shortcuts)
    // ==========================================

    /**
     * Scope untuk mencari token yang 'belum digunakan' saja.
     * Cara pakai di Controller: Token::tersedia()->get();
     */
    public function scopeTersedia($query)
    {
        return $query->where('status', 'belum digunakan');
    }

    /**
     * Scope untuk mencari token milik customer tertentu.
     * Cara pakai: Token::milik($userId)->get();
     */
    public function scopeMilik($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    // ==========================================
    // TAMBAHAN: BUSINESS LOGIC METHODS
    // ==========================================

    /**
     * Fungsi khusus untuk Donasi (Pindah Kepemilikan).
     * Cara pakai: $token->donasikanKe($idTeman);
     */
    public function donasikanKe($customerIdPenerima)
    {
        // Update customer_id ke penerima baru
        $this->update([
            'customer_id' => $customerIdPenerima
        ]);
    }

    /**
     * Fungsi untuk menggunakan token (saat tes dimulai).
     * Cara pakai: $token->pakai();
     */
    public function pakai()
    {
        $this->update([
            'status' => 'digunakan',
            'tglPemakaian' => Carbon::now(),
        ]);
    }

    /**
     * Cek apakah token masih valid/bisa dipakai.
     * Cara pakai: if($token->isValid()) { ... }
     */
    public function getIsValidAttribute()
    {
        return $this->status === 'belum digunakan';
    }
}