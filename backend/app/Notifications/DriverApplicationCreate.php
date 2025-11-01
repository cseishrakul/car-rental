<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DriverApplicationCreate extends Notification
{
    use Queueable;

    public $driver;

     public function __construct($driver)
    {
        $this->driver = $driver;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'driver_id' => $this->driver->id,
            'user_id' => $this->driver->user_id,
            'message' => 'New Driver Application by {$this->driver->user->name}.'
        ];
    }
}
