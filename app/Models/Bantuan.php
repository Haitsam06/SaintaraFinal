<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bantuan extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'subject',
        'category',
        'description',
        'status'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id_customer');
    }
}