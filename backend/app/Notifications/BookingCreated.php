<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCreated extends Notification
{
    use Queueable;

    public $booking;
    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'booking_id' => $this->booking->id,
            'user_id' => $this->booking->user_id,
            'message' => "New Booking by  {$this->booking->user->name} for car {$this->booking->car->name} {$this->booking->car->model}. "
        ];
    }
}
