<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';
    protected $primaryKey = 'id_review'; // Ini memberitahu Laravel nama primary key, TAPI jangan buat properti $id_review

    protected $fillable = [
        'id_customer',
        'id_admin',
        'id_instanasi', // Pastikan ejaan sesuai kolom database Anda
        'content',
    ];

    // ================= RELASI =================
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'id_customer');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'id_admin');
    }

    public function instansi()
    {
        return $this->belongsTo(Instansi::class, 'id_instanasi');
    }

    // ================= ACCESSOR =================
    public function getAuthorAttribute()
    {
        return $this->customer ?? $this->admin ?? $this->instansi;
    }

    public function getAuthorNameAttribute()
    {
        $author = $this->author;
        if (!$author)
            return 'Pengguna Tidak Dikenal';

        // Menggunakan getAttribute agar aman
        return $author->getAttribute('name')
            ?? $author->getAttribute('nama_lengkap')
            ?? $author->getAttribute('nama_admin')
            ?? $author->getAttribute('nama_instansi')
            ?? 'Tanpa Nama';
    }

    public function getAuthorImageAttribute()
    {
        $author = $this->author;

        $path = null;
        if ($author) {
            $path = $author->getAttribute('foto')
                ?? $author->getAttribute('photo')
                ?? $author->getAttribute('image');
        }

        if ($path)
            return asset('storage/' . $path);

        $name = $this->author_name;
        return 'https://ui-avatars.com/api/?background=FCD34D&color=fff&name=' . urlencode($name);
    }
}