<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // <--- PENTING
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- PENTING

class Customer extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'customers';
    protected $primaryKey = 'id_customer';
    public $incrementing = false;
    protected $keyType = 'string';

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
    ];

    protected $hidden = ['password'];
    protected $casts = ['password' => 'hashed'];
}