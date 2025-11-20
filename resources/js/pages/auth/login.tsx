import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useState } from 'react';

// Pastikan Anda sudah menginstall axios: npm install axios

const Logo = () => (
    <div className="flex h-18 w-18 items-center justify-center rounded-full">
        <img src="/assets/logo/5.png" alt="Saintara Logo" className="h-16 w-16 object-contain" />
    </div>
);

export default function Login() {
    // State manual (pengganti useForm Inertia karena kita pakai API Token)
    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; message?: string }>({});

    // Handle perubahan input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setValues((prev) => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({}); // Reset error sebelum request

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: values.email,
                password: values.password,
            });

            const token = response.data.access_token;
            const user = response.data.user;
            const roleId = response.data.role_id; // Ambil role_id dari response

            localStorage.setItem('token', token);
            localStorage.setItem('user_data', JSON.stringify(user));

            // --- LOGIKA REDIRECT BERDASARKAN ROLE ---
            if (roleId === 1 || roleId === 2) {
                // Super Admin & Admin -> Dashboard Admin
                window.location.href = '/admin/dashboardAdmin';
            } else if (roleId === 3) {
                // Customer -> Homepage atau Dashboard User
                window.location.href = '/personal/dashboardPersonal';
            } else if (roleId === 4) {
                // Instansi -> Dashboard Instansi
                window.location.href = '/instansi/dashboardInstansi';
            } else {
                // Default
                window.location.href = '/';
            }
        } catch (err: any) {
            // 4. Tangani Error
            if (err.response && err.response.status === 422) {
                // Error Validasi (Email format salah, dll)
                // Mapping error dari Laravel ke state React
                const apiErrors = err.response.data.errors;
                const newErrors: any = {};
                if (apiErrors.email) newErrors.email = apiErrors.email[0];
                if (apiErrors.password) newErrors.password = apiErrors.password[0];
                setErrors(newErrors);
            } else if (err.response && err.response.status === 401) {
                // Error Login Gagal (Password salah / Akun tidak ditemukan)
                setErrors({
                    message: err.response.data.message || 'Email atau password salah.',
                });
            } else {
                setErrors({ message: 'Terjadi kesalahan pada server.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-saintara-yellow p-6 font-poppins">
            <Head title="Masuk Akun" />

            <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-12">
                {/* Tombol Close */}
                <Link href="/" className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-600">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                </Link>

                {/* Header */}
                <div className="flex flex-col items-center">
                    <Logo />
                    <h2 className="mt-4 mb-8 text-center text-2xl font-bold text-gray-900">Masuk Akun Saintara</h2>
                </div>

                {/* Pesan Error Global (Status/Alert) */}
                {errors.message && <div className="mb-4 rounded bg-red-100 p-3 text-center text-sm font-medium text-red-600">{errors.message}</div>}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            autoComplete="username"
                            autoFocus
                            required
                            className={`w-full rounded-lg border px-4 py-3 text-black shadow-sm focus:ring-saintara-yellow ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-saintara-yellow'}`}
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
                            value={values.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                            className={`w-full rounded-lg border px-4 py-3 text-black shadow-sm focus:ring-saintara-yellow ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-saintara-yellow'}`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input id="remember" type="checkbox" checked={values.remember} onChange={handleChange} className="rounded border-gray-300 text-saintara-yellow shadow-sm focus:ring-saintara-yellow" />
                            <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
                        </label>

                        <Link href="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline">
                            Lupa Password?
                        </Link>
                    </div>

                    {/* Button Submit */}
                    <div className="pt-4">
                        <button type="submit" disabled={processing} className="w-full rounded-full bg-gray-300 py-3 text-sm font-bold text-gray-900 shadow-md transition-all hover:bg-saintara-yellow disabled:cursor-not-allowed disabled:opacity-50">
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link href="/register" className="font-bold text-saintara-yellow hover:underline">
                            Daftar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
