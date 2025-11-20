<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // <--- PENTING: Ganti ini
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- PENTING: Tambah ini

class Instansi extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 1. Definisikan tabel
    protected $table = 'instansi';

    // 2. Definisikan Primary Key (Karena bukan 'id')
    protected $primaryKey = 'id_instansi';
    public $incrementing = false; // Karena string/char
    protected $keyType = 'string';

    // 3. Field yang boleh diisi
    protected $fillable = [
        'id_instansi',
        'role_id',
        'nama_instansi',
        'email',
        'password',
        'no_telp',
        'alamat',
        'pic_name',
        'bidang',
        'status_akun',
        'foto',
    ];

    // 4. Sembunyikan password saat return JSON
    protected $hidden = [
        'password',
    ];

    // 5. Casting password agar otomatis di-hash (Laravel 10+)
    protected $casts = [
        'password' => 'hashed',
        'tanggal_dibuat' => 'date',
    ];
}