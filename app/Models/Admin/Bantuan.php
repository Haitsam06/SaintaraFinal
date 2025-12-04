<?php

namespace App\Models\Admin; // <--- Namespace harus beda

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// Import Model dari folder utama (keluar satu folder)
use App\Models\Customer;
use App\Models\Instansi;

class Bantuan extends Model
{
    use HasFactory;

    protected $table = 'bantuans';
    protected $guarded = ['id'];

    // Relasi ke Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }

    // Relasi ke Instansi
    public function instansi()
    {
        return $this->belongsTo(Instansi::class, 'instansi_id', 'id_instansi');
    }
}