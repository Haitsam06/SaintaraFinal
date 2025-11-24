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

    // --- TAMBAHAN PENTING: Append Virtual Attributes ---
    protected $appends = ['id', 'name'];
    // ---------------------------------------------------

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

    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['password' => 'hashed'];

    // --- AKSESOR 1: Mapping id_customer ke id ---
    public function getIdAttribute()
    {
        return $this->id_customer;
    }

    // --- AKSESOR 2: Mapping nama_lengkap ke name ---
    public function getNameAttribute()
    {
        return $this->nama_lengkap;
    }
}