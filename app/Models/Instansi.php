<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Instansi extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'instansi';
    protected $primaryKey = 'id_instansi';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $appends = ['id', 'name'];

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
        'verification_code',
        'verification_code_expires_at',
        'reset_password_code',
        'reset_password_expires_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
        'verification_code_expires_at' => 'datetime',
        'reset_password_expires_at' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    // --- STANDARDISASI ATRIBUT ---

    public function getIdAttribute()
    {
        return $this->getAttribute('id_instansi');
    }

    // Mapping 'nama_instansi' ke 'name'
    public function getNameAttribute()
    {
        return $this->getAttribute('nama_instansi');
    }
}