<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'admins';
    protected $primaryKey = 'id_admin';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;
    const CREATED_AT = 'tanggal_dibuat';
    const UPDATED_AT = null;

    // --- [PERBAIKAN 1] TAMBAHKAN 'name' DISINI ---
    protected $appends = ['id', 'name'];
    // ---------------------------------------------

    protected $fillable = [
        'id_admin',
        'role_id',
        'nama_admin',
        'jenis_kelamin',
        'email',
        'password',
        'no_telp',
        'status_akun',
        'foto',
        'tanggal_dibuat',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'tanggal_dibuat' => 'datetime',
        'password' => 'hashed',
    ];

    // Helper 'id' yang sudah ada (JANGAN DIHAPUS)
    public function getIdAttribute()
    {
        return $this->id_admin;
    }

    // --- [PERBAIKAN 2] BUAT PENERJEMAH 'nama_admin' JADI 'name' ---
    public function getNameAttribute()
    {
        return $this->nama_admin;
    }
    // --------------------------------------------------------------
}