<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paket extends Model
{
    use HasFactory;

    protected $table = 'pakets';

    // 1. Primary Key
    protected $primaryKey = 'id_paket';

    // 2. MATIKAN Auto Increment (PENTING)
    // Karena ID paket kamu string: 'DSR', 'STD', 'PRM'
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_paket',
        'nama_paket',
        'harga',
        'deskripsi',
        'jumlah_karakter'
    ];

    // --- RELASI ---
    
    // Paket ini punya banyak Token
    public function tokens()
    {
        return $this->hasMany(Token::class, 'paket_id', 'id_paket');
    }
}