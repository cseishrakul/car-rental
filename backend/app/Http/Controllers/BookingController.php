<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Car;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'car_id' => 'required|exists:cars,id',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date|after_or_equal:pickup_date',
            'payment_method' => 'required|in:stripe,sslcommerz',
        ]);

        $user = Auth::user();
        $car = Car::findOrFail($request->car_id);
        $days = (new DateTime($request->return_date))->diff(new DateTime($request->pickup_date))->days + 1;

        $amount = $days * $car->daily_rate;
        $booking = Booking::create([
            'user_id' => $user->id,
            'car_id' => $car->id,
            'pickup_date' => $request->pickup_date,
            'return_date' => $request->return_date,
            'days' => $days,
            'amount' => $amount,
            'payment_method' => $request->payment_method
        ]);

        return response()->json(['booking' => $booking], 201);
    }

    public function initiateSSL(Request $request)
    {
        $booking = Booking::findOrFail($request->booking_id);
        $user = $booking->user;
        $tran_id = 'txn_' . Str::random(10);
        $booking->update(['transaction_id' => $tran_id]);
        $post_data = [
            'store_id' => 'abcd68f4d1f700d7e',
            'store_passwd' => 'abcd68f4d1f700d7e@ssl',
            'total_amount' => $booking->amount,
            'currency' => 'BDT',
            'tran_id' => $tran_id,
            'success_url' => url('/api/sslcommerz/success'),
            'fail_url' => url('/api/sslcommerz/fail'),
            'cancel_url' => url('/api/sslcommerz/cancel'),

            'cus_name' => $user->name,
            'cus_email' => $user->email,
            'cus_add1' => 'Dhaka',
            'cus_city' => 'Dhaka',
            'cus_postcode' => '1212',
            'cus_country' => 'Bangladesh',
            'cus_phone' => '0213244242',

            'product_name' => 'Car rental',
            'product_category' => 'Car',
            'product_profile' => 'general',
            'shipping_method' => 'NO'

        ];

        $response = Http::withoutVerifying()->asForm()->post('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', $post_data)->json();
        Log::info('SSL Commerz response', $response);
        if (!empty($response['GatewayPageURL'])) {
            return response()->json(['GatewayPageURL' => $response['GatewayPageURL']]);
        }

        return response()->json([
            'error' => 'Failed to get Gateway URL',
            'date' => $response
        ], 500);
    }

    public function success(Request $request){
        $booking = Booking::where('transaction_id',$request->tran_id)->first();
        if($booking){
            $booking->update([
                'payment_status' => 'paid',
                'booking_status' => 'pending'
            ]);
        }
        return redirect()->away('http://localhost:5173/payment-success?tran_id='.$request->tran_id);
    }
    public function fail(Request $request){
        $booking = Booking::where('transaction_id',$request->tran_id)->first();
        if($booking){
            $booking->update([
                'booking_status' => 'cancelled'
            ]);
        }
        return redirect()->away('http://localhost:5173/payment-fail?tran_id='.$request->tran_id);
    }
    public function cancel(Request $request){
        $booking = Booking::where('transaction_id',$request->tran_id)->first();
        if($booking){
            $booking->update([
                'booking_status' => 'cancelled'
            ]);
        }
        return redirect()->away('http://localhost:5173/payment-cancel?tran_id='.$request->tran_id);
    }
}
