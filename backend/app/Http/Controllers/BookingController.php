<?php

namespace App\Http\Controllers;

use App\Mail\BookingCancelled;
use App\Mail\BookingConfirmed;
use App\Models\Booking;
use App\Models\Car;
use App\Models\DriverProfile;
use App\Models\User;
use App\Notifications\BookingCreated;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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

        $adminsAndManagers = User::whereIn('role',['admin','manager'])->get();
        foreach($adminsAndManagers as $user){
            $user->notify(new BookingCreated($booking));
        }

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

    public function success(Request $request)
    {
        $booking = Booking::where('transaction_id', $request->tran_id)->first();
        if ($booking) {
            $booking->update([
                'payment_status' => 'paid',
                'booking_status' => 'pending'
            ]);
        }
        return redirect()->away('http://localhost:5173/payment-success?tran_id=' . $request->tran_id);
    }
    public function fail(Request $request)
    {
        $booking = Booking::where('transaction_id', $request->tran_id)->first();
        if ($booking) {
            $booking->update([
                'booking_status' => 'cancelled'
            ]);
        }
        return redirect()->away('http://localhost:5173/payment-fail?tran_id=' . $request->tran_id);
    }
    public function cancel(Request $request)
    {
        $booking = Booking::where('transaction_id', $request->tran_id)->first();
        if ($booking) {
            $booking->update([
                'booking_status' => 'cancelled'
            ]);
        }
        return redirect()->away('http://localhost:5173/payment-cancel?tran_id=' . $request->tran_id);
    }


    // Admin Approve
    public function allBookings(Request $request)
    {
        $auth = $request->user();
        if (!in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bookings = Booking::with('user', 'car')->get();
        return response()->json($bookings);
    }

    public function confirmBooking(Request $request, $id)
    {
        $auth = $request->user();
        if (!in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking = Booking::with('car')->findOrFail($id);

        if ($booking->payment_status !== 'paid') {
            return response()->json(['message' => 'Payment not done yet!'], 400);
        }

        $booking->update(['booking_status' => 'confirmed']);

        if ($booking->car) {
            $booking->car->update([
                'status' => 'booked',
            ]);
        }

        if ($booking->user && $booking->user->email) {
            Mail::to($booking->user->email)->send(new BookingConfirmed($booking));
        }

        $message = "Booking Confirmed Successfully!. Car  `{$booking->car->name} is booked!` ";

        if ($booking->driver) {
            $message .= " and assigned to driver '{$booking->driver->user->name}' ";
        }

        return response()->json([
            'message' => $message,
            'booking' => $booking
        ]);
    }


    public function cancelBooking(Request $request, $id)
    {
        $auth = $request->user();
        if (!in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking = Booking::findOrFail($id);
        $booking->update(['booking_status' => 'cancelled']);
        if ($booking->user && $booking->user->email) {
            Mail::to($booking->user->email)->send(new BookingCancelled($booking));
        }
        return response()->json([
            'message' => 'Booking cancelled successfully!',
            'booking' => $booking
        ]);
    }

    public function show(Request $request, $id)
    {
        $auth = $request->user();
        if (!in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking = Booking::with(['user', 'car'])->find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found!'], 404);
        }

        $driverProfile = DriverProfile::with('user')->where('assigned_car_id', $booking->car_id)->first();

        $driver = $driverProfile ? [
            'name' => $driverProfile->user->name ?? null,
            'email' => $driverProfile->user->email ?? null,
            'phone' => $driverProfile->phone,
            'address' => $driverProfile->address,
            'license_number' => $driverProfile->license_number,
            'nid' => $driverProfile->nid,
        ] : null;

        return response()->json(['booking' => $booking, 'driver' => $driver]);
    }

    public function userBookings(Request $request)
    {
        $user = $request->user();
        $bookings = Booking::with(['car', 'car.driverProfile.user'])->where('user_id', $user->id)->orderBy('created_at', 'desc')->get()->map(function ($booking) {
            $driverProfile = $booking->car->driverProfile;
            return [
                'id' => $booking->id,
                'pickup_date' => $booking->pickup_date,
                'return_date' => $booking->return_date,
                'days' => $booking->days,
                'amount' => $booking->amount,
                'booking_status' => $booking->booking_status,
                'payment_status' => $booking->payment_status,
                'transaction_id' => $booking->transaction_id,
                'car' => $booking->car,
                'driver' =>         $driver = $driverProfile ? [
                    'name' => $driverProfile->user->name ?? null,
                    'email' => $driverProfile->user->email ?? null,
                    'phone' => $driverProfile->phone,
                    'address' => $driverProfile->address,
                    'license_number' => $driverProfile->license_number,
                    'nid' => $driverProfile->nid,
                ] : null
            ];
        });

        return response()->json(['bookings' => $bookings]);
    }

    public function driverBookings(Request $request)
    {
        $driver = $request->user();
        $assignedCarIds = DriverProfile::where('user_id', $driver->id)->pluck('assigned_car_id')->filter()->toArray();

        if (empty($assignedCarIds)) {
            return response()->json(['bookingd' => []]);
        }

        $bookings = Booking::with(['user', 'car'])->whereIn('car_id', $assignedCarIds)->where('booking_status', 'confirmed')->orderBy('pickup_date', 'asc')->get();

        return response()->json(['bookings' => $bookings]);
    }

    public function monthlyBookings()
    {
        $monthlyBookings = Booking::select(DB::raw('EXTRACT(MONTH FROM pickup_date) AS month'), DB::raw('COUNT(*) as total'))->whereYear('pickup_date', date('Y'))->groupBy(DB::raw('EXTRACT(MONTH FROM pickup_date)'))->orderBy('month')->get();

        $bookingsData = array_fill(0, 12, 0);
        foreach ($monthlyBookings as $b) {
            $bookingsData[$b->month - 1] = $b->total;
        }

        return response()->json([
            'monthlyBookings' => $bookingsData
        ]);
    }

    public function weeklyStatistics()
    {
        $today = Carbon::now();
        $saturday = $today->copy()->previous(Carbon::SATURDAY);
        $sunday = $saturday->copy()->addDay();
        $monday = $sunday->copy()->addDay();
        $tuesday = $monday->copy()->addDay();
        $wednesday = $tuesday->copy()->addDay();
        $thursday = $wednesday->copy()->addDay();

        $dates = [$saturday, $sunday, $monday, $tuesday, $wednesday, $thursday];

        $dailyData = Booking::select(
            DB::raw('DATE(pickup_date) as date'),
            DB::raw('COUNT(*) as bookings')
        )->whereIn(DB::raw('DATE(pickup_date)'), [
            $saturday->format('Y-m-d'),
            $sunday->format('Y-m-d'),
            $monday->format('Y-m-d'),
            $tuesday->format('Y-m-d'),
            $wednesday->format('Y-m-d'),
            $thursday->format('Y-m-d'),
        ])->groupBy(DB::raw('DATE(pickup_date)'))->orderBy('date')->get();

        $labels  = [];
        $bookings = [];
        foreach ($dates as $d) {
            $tables[] = $d->format('D');
            $bookings[] = 0;
        }

        foreach ($dailyData as $data) {
            $index = array_search(Carbon::parse($data->date)->format('D'), $labels);
            if ($index !== false) {
                $bookings[$index] = $data->bookings;
            }
        }

        return response()->json([
            'dates' => $labels,
            'bookings' => $bookings
        ]);
    }
}
