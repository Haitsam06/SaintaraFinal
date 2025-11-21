<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;

    protected $table = 'calendars';
    protected $primaryKey = 'id_kalender'; // Sesuai migrasi Anda

    protected $fillable = [
        'nama_agenda',
        'tanggal',      // Format: YYYY-MM-DD
        'waktu',        // Format: 10:00 - 12:00 (String)
        'deskripsi',
        'tipe',         // Untuk warna dot (blue, green, red)
        'admin_id',     // Relasi ke Admin
    ];

    // Relasi ke Admin
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id_admin');
    }
}