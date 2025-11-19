<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Penting: Ganti extends Model jadi ini
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Penting untuk API Token

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 1. Definisi nama tabel
    protected $table = 'admins';

    // 2. Definisi Primary Key kustom
    protected $primaryKey = 'id_admin';

    // 3. Karena id_admin adalah varchar (bukan integer auto increment)
    public $incrementing = false;
    protected $keyType = 'string';

    // 4. Kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'id_admin',
        'role_id',
        'nama_admin',
        'email',
        'password',
        'no_telp',
        'status_akun',
        'foto',
        'tanggal_dibuat',
    ];

    // 5. Kolom yang disembunyikan saat return JSON (biar password gak bocor)
    protected $hidden = [
        'password',
    ];

    // 6. Casting tipe data (opsional, tapi bagus untuk tanggal)
    protected $casts = [
        'tanggal_dibuat' => 'date',
        'password' => 'hashed', // Otomatis hash password saat save/update (Laravel 10+)
    ];
}