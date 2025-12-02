<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'customers';
    protected $primaryKey = 'id_customer';
    public $incrementing = false;
    protected $keyType = 'string';

    // Virtual attributes (dipakai pada guard/auth)
    protected $appends = ['id', 'name'];

    protected $fillable = [
        'id_customer',
        'role_id',
        'nama_lengkap',
        'nama_panggilan',
        'email',
        'password',
        'no_telp',
        'alamat',
        'negara',
        'tgl_lahir',
        'kota',
        'jenis_kelamin',
        'gol_darah',
        'foto',
        'status_akun',

        // Tambahan OTP / verifikasi / reset password
        'verification_code',
        'verification_code_expires_at',
        'reset_password_code',
        'reset_password_expires_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password'                     => 'hashed',
        'verification_code_expires_at' => 'datetime',
        'reset_password_expires_at'    => 'datetime',
        'email_verified_at'            => 'datetime',
        'tgl_lahir'                    => 'date',
    ];

    // --- AKSESOR: mapping ke atribut standar auth ---

    // id_customer -> id
    public function getIdAttribute()
    {
        return $this->id_customer;
    }

    // nama_lengkap -> name
    public function getNameAttribute()
    {
        return $this->nama_lengkap;
    }
}
