import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const Logo = () => (
    <div className="flex h-18 w-18 items-center justify-center rounded-full">
        <img src="/assets/logo/5.png" alt="Saintara Logo" className="h-16 w-16 object-contain" />
    </div>
);

export default function Login() {
    // Gunakan useForm Inertia untuk handle state & submit
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // POST ke route /login di web.php
        post('/login', {
            onFinish: () => reset('password'), // Hapus password jika gagal/selesai
        });
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-yellow-400 p-6 font-sans">
            <Head title="Masuk Akun" />
            <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-12">

                {/* --- Tombol Kembali --- */}
                <button 
                    onClick={handleBack}
                    className="top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                    title="Kembali"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>

                <div className="flex flex-col items-center">
                    <Logo />
                    <h2 className="mt-4 mb-8 text-center text-2xl font-bold text-gray-900">Masuk Akun Saintara</h2>
                </div>

                {/* Tampilkan Pesan Error Global (jika ada error yang bukan field spesifik) */}
                {Object.values(errors)[0] && <div className="mb-4 rounded bg-red-100 p-3 text-center text-sm font-medium text-red-600">{Object.values(errors)[0]}</div>}
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className={`w-full rounded-lg border px-4 py-3 text-black shadow-sm focus:ring-yellow-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className={`w-full rounded-lg border px-4 py-3 pr-10 text-black shadow-sm focus:ring-yellow-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                                {showPassword ? (
                                    // Eye Slash
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                        />
                                    </svg>
                                ) : (
                                    // Eye Open
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input id="remember" type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="rounded border-gray-300 text-yellow-400 shadow-sm focus:ring-yellow-400" />
                            <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline">
                            Lupa Password?
                        </Link>
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={processing} className="w-full rounded-full bg-gray-300 py-3 text-sm font-bold text-gray-900 shadow-md transition-all hover:bg-yellow-400 disabled:opacity-50">
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link href="/register" className="font-bold text-yellow-600 hover:underline">
                            Daftar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
