<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paket extends Model
{
    use HasFactory;

    protected $table = 'pakets';
    protected $primaryKey = 'id_paket';
    public $incrementing = false; // Karena ID custom string (PKT001)
    protected $keyType = 'string';

    protected $fillable = [
        'id_paket',
        'nama_paket',
        'harga',
        'deskripsi',
        'tipe_paket',
        'jumlah_karakter',
    ];
}