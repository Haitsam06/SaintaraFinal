import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

// Komponen Logo Placeholder (Anda bisa ganti dengan SVG logo Anda)
const Logo = () => (
    <div className="flex h-18 w-18 items-center justify-center rounded-full">
        <img src="/assets/logo/5.png" alt="Saintara Logo" className="h-16 w-16 object-contain" />
    </div>
);

export default function Register() {
    // Form state disesuaikan dengan field di gambar
    const { data, setData, post, processing, errors, reset } = useForm({
        namaLengkap: '',
        namaPanggilan: '',
        email: '',
        noTelp: '',
        negara: '',
        kota: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        // Reset password field saat komponen di-unmount
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Handler untuk semua input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.id as keyof typeof data, e.target.value);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Mengirim data ke route 'register' (standar Breeze)
        post('register');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-saintara-yellow p-6 font-poppins">
            <Head title="Buat Akun" />

            {/* Kartu Form Putih */}
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl md:p-12">
                {/* Logo & Judul */}

                <div className="flex flex-col items-center">
                    <Logo />
                    <h2 className="mt-4 mb-8 text-center text-2xl font-bold text-gray-900">Buat Akun Saintara</h2>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Nama Lengkap */}
                    <div>
                        <label htmlFor="namaLengkap" className="mb-1 block text-sm font-medium text-gray-700">
                            Nama Lengkap
                        </label>
                        <input
                            id="namaLengkap"
                            type="text"
                            value={data.namaLengkap}
                            className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                        {errors.namaLengkap && <p className="mt-1 text-xs text-red-500">{errors.namaLengkap}</p>}
                    </div>

                    {/* Nama Panggilan */}
                    <div>
                        <label htmlFor="namaPanggilan" className="mb-1 block text-sm font-medium text-gray-700">
                            Nama Panggilan
                        </label>
                        <input
                            id="namaPanggilan"
                            type="text"
                            value={data.namaPanggilan}
                            className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* No Telp */}
                    <div>
                        <label htmlFor="noTelp" className="mb-1 block text-sm font-medium text-gray-700">
                            No telp
                        </label>
                        <input
                            id="noTelp"
                            type="tel"
                            value={data.noTelp}
                            className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Negara & Kota */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="negara" className="mb-1 block text-sm font-medium text-gray-700">
                                Negara
                            </label>
                            <input
                                id="negara"
                                type="text"
                                value={data.negara}
                                className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="kota" className="mb-1 block text-sm font-medium text-gray-700">
                                Kota
                            </label>
                            <input
                                id="kota"
                                type="text"
                                value={data.kota}
                                className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                                onChange={handleChange}
                            />
                        </div>
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
                            className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Konfirmasi Password (Wajib untuk Breeze) */}
                    <div>
                        <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium text-gray-700">
                            Konfirmasi Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            className="w-full rounded-lg border-gray-300 px-4 py-2 text-black shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                            onChange={handleChange}
                            required
                        />
                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                    </div>

                    {/* Tombol Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-full bg-saintara-black py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-saintara-yellow disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Mendaftar...' : 'Daftar'}
                        </button>
                    </div>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <p className="mb-4 text-xs text-gray-500">
                        Dengan membuat akun, anda menyetujui{' '}
                        <Link href="#" className="font-bold text-gray-700 hover:underline">
                            Syarat dan Ketentuan
                        </Link>{' '}
                        dan{' '}
                        <Link href="#" className="font-bold text-gray-700 hover:underline">
                            Kebijakan Privasi
                        </Link>
                        {' '}yang berlaku.
                    </p>
                    <p className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link href={'login'} className="font-bold text-saintara-yellow hover:underline">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
