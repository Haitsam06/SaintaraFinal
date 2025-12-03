<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Bisa Customer atau Instansi
     */
    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Kode OTP Reset Password Saintara')
            ->view('emails.reset-password-otp');
        // PERHATIKAN: tidak ada route('password.reset') di sini
    }
}
