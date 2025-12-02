<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Keuangan extends Model
{
    use HasFactory;

    protected $table = 'keuangans';
    protected $primaryKey = 'id_keuangan';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_keuangan',
        'tipe',
        'kategori', // Baru
        'jumlah',
        'deskripsi',
        'tanggal_transaksi',
        'status_pembayaran', // Baru
        'detail', // Baru (JSON)
        'transaksi_id',
        'admin_id',
    ];

    protected $casts = [
        'detail' => 'array', // Otomatis convert JSON ke Array PHP
        'tanggal_transaksi' => 'date',
    ];

    // Relasi ke Admin (Karyawan)
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id_admin');
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id_keuangan)) {
                $model->id_keuangan = (string) Str::uuid();
            }
        });
    }
}