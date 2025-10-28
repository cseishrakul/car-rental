<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id','phone','address','license_number','nid','license_image',    'nid_image','profile_photo','experience_years','status','assigned_car_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function car(){
        return $this->belongsTo(Car::class,'assigned_car_id');
    }
}
