<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index()
    {
        return Car::paginate(20);
    }

    public function store(Request $request)
    {
        $auth = $request->user();
        if (!in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'daily_rate' => 'required|numeric|min:0',
            'status' => 'in:available,booked,maintenance',
            'image' => 'nullable|url',
            'image_public_id' => 'nullable|string',
            'seating_capacity' => 'nullable|integer|min:1',
            'fuel_type' => 'nullable|string|max:50',
            'transmission' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
        ]);

        $car = Car::create($data);
        return response()->json([
            'message' => 'Car added successfully!',
            'car' => $car
        ], 201);
    }

    public function show(Car $car){
        return response()->json(['car'=>$car]);
    }

    public function update(Request $request, Car $car)
    {
        $auth = $request->user();
        if (!in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'daily_rate' => 'required|numeric|min:0',
            'status' => 'in:available,booked,maintenance',
            'image' => 'nullable|url',
            'image_public_id' => 'nullable|string',
            'seating_capacity' => 'nullable|integer|min:1',
            'fuel_type' => 'nullable|string|max:50',
            'transmission' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
        ]);

        $car->update($data);
        return response()->json([
            'message' => 'Car updated successfully!',
            'car' => $car
        ]);
    }

    public function destroy(Request $request, Car $car)
    {
        $auth = $request->user();
        if (!in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $car->delete();

        return response()->json(['message' => 'Car deleted successfully!']);
    }

    // Frontend Data Fetching Api
    public function carPage()
    {
        $cars = Car::orderBy('id', 'asc')->get();
        return response()->json($cars);
    }

    public function featured()
    {
        $cars = Car::orderBy('id', 'desc')->where('status', 'available')->take(6)->get();

        return response()->json($cars);
    }


    public function carDetails($id)
    {
        $car = Car::find($id);
        if (!$car) {
            return response()->json([
                'message' => 'Car not found'
            ], 404);
        }

        return response()->json([
            'data' => $car
        ], 200);
    }
}
