<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'model',
        'daily_rate',
        'status',
        'image',
        'image_public_id',
        'seating_capacity',
        'fuel_type',
        'transmission',
        'location',
        'description',
        'features'
    ];

    protected $casts = [
        'features' => 'array'
    ];
}
