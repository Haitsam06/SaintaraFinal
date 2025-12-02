<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $account;

    public function __construct($account)
    {
        $this->account = $account;
    }

    public function build()
    {
        return $this->subject('Kode OTP Verifikasi Saintara')
                    ->view('emails.send-otp');
    }
}
