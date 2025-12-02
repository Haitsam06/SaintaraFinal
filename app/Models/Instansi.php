<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
        // Tambahan OTP + reset password
        'verification_code',
        'verification_code_expires_at',
        'reset_password_code',
        'reset_password_expires_at',
        'email_verified_at',
    ];

    // 4. Sembunyikan password saat return JSON
    protected $hidden = [
        'password',
    ];

    // 5. Casting field
    protected $casts = [
        'password'                     => 'hashed',   // Laravel 10+
        'tanggal_dibuat'               => 'date',
        'verification_code_expires_at' => 'datetime',
        'reset_password_expires_at'    => 'datetime',
        'email_verified_at'            => 'datetime',
    ];

    protected $appends = ['id', 'name'];

    public function getIdAttribute()
    {
        return $this->id_instansi;
    }

    public function getNameAttribute()
    {
        return $this->nama_instansi;
    }
}
