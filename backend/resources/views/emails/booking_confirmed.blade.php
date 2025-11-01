<h1>Booking Confirmed</h1>
<p>Hi {{ $booking->user->name }}, </p>
<p>Your Booking for car {{ $booking->car->name }} || {{ $booking->car->brand }} || {{ $booking->car->model }} has been
    <strong>confirmed!</strong> </p>


@if ($booking->driver)
    <p>Driver: {{ $booking->driver->user->name }} </p>
@endif

<p> Thank you for booking with us! </p>
