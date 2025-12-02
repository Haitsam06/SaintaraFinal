<?php

namespace App\Models\Admin; // <--- HARUS SEPERTI INI (JANGAN namespace App\Models\Admin)

use App\Models\Customer; // Pastikan model Customer di-import
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bantuan extends Model
{
    use HasFactory;

    // Pastikan nama tabelnya benar (jamak)
    protected $table = 'bantuans';

    protected $fillable = [
        'customer_id',
        'subject',
        'category',
        'description',
        'status',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }
}