<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'admins';
    protected $primaryKey = 'id_admin';
    public $incrementing = false;
    protected $keyType = 'string';

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

    protected $hidden = ['password'];
}
