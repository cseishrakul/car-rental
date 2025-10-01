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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $filename = time() . '-' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/cars'), $filename);
            $data['image'] = 'uploads/cars/' . $filename;
        }

        $car = Car::create($data);
        return response()->json([
            'message' => 'Car added successfully!',
            'car' => $car
        ], 201);
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($car->image && file_exists(public_path(($car->image)))) {
                unlink(public_path($car->image));
            }

            $filename = time() . '-' . $request->file('image')->getClientOriginalName();
            $request->file('image')->move(public_path('uploads/cars'), $filename);
            $data['image'] = 'uploads/cars/' . $filename;
        }

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
}
