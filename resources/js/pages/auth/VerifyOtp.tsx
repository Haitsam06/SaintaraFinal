import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const Logo = () => (
    <div className="flex h-18 w-18 items-center justify-center rounded-full">
        <img src="/assets/logo/5.png" alt="Saintara Logo" className="h-16 w-16 object-contain" />
    </div>
);

interface VerifyOtpProps {
    status?: string;
    email?: string;
}

export default function VerifyOtp({ status, email }: VerifyOtpProps) {
    // 🟡 Tambah email ke form, tapi tidak ditampilkan sebagai input
    const { data, setData, post, processing, errors } = useForm({
        email: email || '',
        otp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/verify-otp');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-saintara-yellow p-6 font-poppins">
            <Head title="Verifikasi Email" />

            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl md:p-12">
                <div className="flex flex-col items-center">
                    <Logo />
                    <h2 className="mt-4 mb-2 text-center text-2xl font-bold text-gray-900">
                        Verifikasi Email
                    </h2>
                    <p className="mb-4 text-center text-sm text-gray-600">
                        Masukkan kode OTP 6 digit yang telah kami kirim
                        {email ? ` ke ${email}` : ' ke email Anda'}.
                    </p>

                    {status && (
                        <div className="mb-4 w-full rounded-lg bg-green-50 px-4 py-2 text-center text-sm text-green-700">
                            {status}
                        </div>
                    )}

                    {/* Optional: tampilkan error email kalau ada (tanpa ubah layout besar) */}
                    {errors.email && (
                        <div className="mb-2 w-full text-center text-xs text-red-500">
                            {errors.email}
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* email disimpan di state, tidak perlu input terpisah */}
                    <input type="hidden" value={data.email} readOnly />

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Kode OTP
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={data.otp}
                            onChange={(e) => setData('otp', e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 px-4 py-2 text-center tracking-[0.4em] shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            placeholder="••••••"
                            required
                        />
                        {errors.otp && (
                            <p className="mt-1 text-xs text-red-500">{errors.otp}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-full bg-saintara-black py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-yellow-600 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Verifikasi'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Tidak menerima kode?{' '}
                        <Link
                            href="/resend-otp"
                            method="post"
                            as="button"
                            // 🟡 Kirim email juga ke route resend
                            data={{ email: data.email || email || '' }}
                            className="font-bold text-yellow-600 hover:underline"
                        >
                            Kirim ulang OTP
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
