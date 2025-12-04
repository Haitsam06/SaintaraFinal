<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// Import Model dari namespace utama
use App\Models\Customer;
use App\Models\Instansi;

class Bantuan extends Model
{
    use HasFactory;

    protected $table = 'bantuans';

    // Sesuaikan fillable dengan kebutuhan Create/Update
    protected $fillable = [
        'customer_id',
        'instansi_id',
        'subject',
        'category',
        'description',
        'status'
    ];

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