<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestPackage extends Model
{
    protected $table = 'test_packages'; // nama tabel di DB
    // protected $primaryKey = 'id';     // kalau primary key bukan 'id', sesuaikan
}
