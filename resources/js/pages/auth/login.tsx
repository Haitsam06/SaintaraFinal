import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

// Komponen Logo Placeholder
const Logo = () => (
    <div className="flex h-18 w-18 items-center justify-center rounded-full">
        <img src="/assets/logo/5.png" alt="Saintara Logo" className="h-16 w-16 object-contain" />
    </div>
);

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    // useForm dari Inertia/Breeze
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-saintara-yellow p-6 font-poppins">
            <Head title="Masuk Akun" />

            {/* Kartu Form Putih */}
            <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-12">
                {/* Tombol Close (Opsional) */}
                <Link href="/" className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-600">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </Link>

                {/* Logo & Judul */}
                <div className="flex flex-col items-center">
                    <Logo />
                    <h2 className="mt-4 mb-8 text-center text-2xl font-bold text-gray-900">Masuk Akun Saintara</h2>
                </div>

                {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className="w-full rounded-lg border-gray-300 px-4 py-3 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="w-full rounded-lg border-gray-300 px-4 py-3 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-saintara-yellow shadow-sm focus:ring-saintara-yellow"
                            />
                            <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
                        </label>

                        {canResetPassword && (
                            <Link href={'password.request'} className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline">
                                Forgot Password?
                            </Link>
                        )}
                    </div>

                    {/* Tombol Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            // Dibuat abu-abu (disabled) saat loading
                            className="w-full rounded-full bg-gray-300 py-3 text-sm font-bold text-gray-900 shadow-md transition-all hover:bg-saintara-yellow disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </div>
                </form>

                {/* Footer Link (Daftar) */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link href={'register'} className="font-bold text-saintara-yellow hover:underline">
                            Daftar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
