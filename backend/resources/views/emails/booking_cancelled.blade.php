<h1>Booking Cancelled</h1>
<p>Hi {{ $booking->user->name }}, </p>
<p>Your Booking for car {{ $booking->car->name }} || {{ $booking->car->brand }} || {{ $booking->car->model }} has been
    <strong>cancelled!</strong>
</p>


@if ($booking->driver)
    <p>Driver: {{ $booking->driver->user->name }} </p>
@endif

<p> Sorry for the unexpected situation! </p>
