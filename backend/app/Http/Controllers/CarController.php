<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(){
        return Car::paginate(20);
    }

    public function store(Request $request){
        $auth = $request->user();
        if (!in_array($auth->role,['admin','manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'daily_rate' => 'required|numeric|min:0',
            'status' => 'in:available,booked,maintenance',
            'image' => 'nullable|string'
        ]);

        $car = Car::create($data);
        return response()->json([
            'message' => 'Car added successfully!',
            'car' => $car
        ],201);
    }


}
