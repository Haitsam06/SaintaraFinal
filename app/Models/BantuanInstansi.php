<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BantuanInstansi extends Model
{
    use HasFactory;

    protected $table = 'bantuans';

    protected $fillable = [
        'instansi_id',
        'subject',
        'category',
        'description',
        'status'
    ];

    public function instansi()
    {
        return $this->belongsTo(Customer::class, 'instansi_id', 'id_instansi');
    }
}