<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kode OTP Verifikasi Saintara</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f7f9;
            padding: 0;
            margin: 0;
        }

        .email-container {
            max-width: 520px;
            background: white;
            margin: 30px auto;
            border-radius: 14px;
            padding: 32px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .header {
            text-align: center;
            margin-bottom: 24px;
        }

        .header img {
            width: 88px;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
            color: #222;
            text-align: center;
            margin-top: 10px;
            margin-bottom: 30px;
        }

        .otp-box {
            background: #FFF7D1;
            padding: 18px 0;
            border-radius: 12px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 10px;
            color: #000;
            margin-bottom: 24px;
        }

        .content {
            font-size: 15px;
            color: #444;
            line-height: 1.6;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>

<div class="email-container">

    <div class="header">
        <img src="https://i.postimg.cc/vZ5ZbHBf/saintara-logo.png" alt="Saintara Logo">
    </div>

    <div class="title">Kode OTP Verifikasi</div>

    <p class="content">
        Hai <strong>{{ $account->nama_lengkap ?? $account->nama_instansi ?? $account->email }}</strong>,<br><br>
        Berikut adalah kode OTP untuk verifikasi email akun Saintara Anda.
        Gunakan kode ini untuk menyelesaikan proses pendaftaran.
    </p>

    <div class="otp-box">
        {{ $account->verification_code }}
    </div>

    <p class="content">
        Kode OTP ini berlaku hingga:
        <strong>{{ $account->verification_code_expires_at->format('H:i') }}</strong> WIB.<br>
        Jika Anda tidak merasa melakukan pendaftaran, abaikan email ini.
    </p>

    <div class="footer">
        © {{ date('Y') }} Saintara Indonesia
    </div>

</div>

</body>
</html>
