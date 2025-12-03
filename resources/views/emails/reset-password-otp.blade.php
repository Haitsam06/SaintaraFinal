<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Saintara</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <img src="https://i.imgur.com/M9QotLD.png" alt="Saintara Logo" style="width: 60px;">
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center">
                            <h2 style="margin: 0; font-size: 24px; color: #333333; font-weight: bold;">
                                Reset Password Saintara
                            </h2>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding-top: 25px; font-size: 15px; color: #555;">
                            Hai <strong>{{ $user->name }}</strong>,
                            <br><br>
                            Anda baru saja meminta reset password akun Saintara Anda.
                            Gunakan kode OTP berikut untuk melanjutkan proses reset password.
                        </td>
                    </tr>

                    <!-- OTP Box -->
                    <tr>
                        <td align="center" style="padding: 25px 0;">
                            <div style="
                                font-size: 32px;
                                letter-spacing: 10px;
                                font-weight: bold;
                                padding: 20px 0;
                                background-color: #FFF8D5;
                                border-radius: 12px;
                                width: 100%;
                                max-width: 260px;
                                text-align: center;
                                color: #333;
                                border: 1px solid #F0E6B2;
                            ">
                                {{ $user->reset_password_code }}
                            </div>
                        </td>
                    </tr>

                    <!-- Expiration -->
                    <tr>
                        <td style="font-size: 14px; color: #444; text-align: center;">
                            Kode OTP ini berlaku hingga: 
                            <strong>{{ $user->reset_password_expires_at->format('H:i') }} WIB</strong>
                        </td>
                    </tr>

                    <!-- Notice -->
                    <tr>
                        <td style="padding-top: 20px; font-size: 14px; color: #777;">
                            Jika Anda tidak meminta reset password, abaikan email ini. 
                            Jangan berikan kode ini kepada siapapun.
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top: 40px; text-align: center; font-size: 12px; color: #aaa;">
                            © 2025 Saintara Indonesia — Semua Hak Dilindungi
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
