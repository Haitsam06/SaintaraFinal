import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

const Logo = () => (
    <div className="flex h-18 w-18 items-center justify-center rounded-full">
        <img src="/assets/logo/5.png" alt="Saintara Logo" className="h-16 w-16 object-contain" />
    </div>
);

export default function Register() {
    // State untuk toggle tipe akun
    const [accountType, setAccountType] = useState<'customer' | 'instansi'>('customer');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipe_akun: 'customer', // Field penentu untuk Backend
        
        // Field Umum
        email: '',
        password: '',
        password_confirmation: '',
        no_telp: '',
        alamat: '',
        negara: '',
        kota: '',

        // Field Khusus Customer
        nama_lengkap: '',
        nama_panggilan: '',

        // Field Khusus Instansi
        nama_instansi: '',
        pic_name: '',
        bidang: '',
    });

    useEffect(() => {
        setData('tipe_akun', accountType);
    }, [accountType]);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Pastikan route di web.php bernama 'register.store' atau sesuaikan url-nya
        post('/register'); 
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-saintara-yellow p-6 font-poppins">
            <Head title="Buat Akun" />

            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl md:p-12">

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
                    <h2 className="mt-4 mb-6 text-center text-2xl font-bold text-gray-900">
                        Daftar Sebagai {accountType === 'customer' ? 'Customer' : 'Instansi'}
                    </h2>
                </div>

                {/* TOGGLE BUTTON */}
                <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => setAccountType('customer')}
                        className={`w-1/2 rounded-md py-2 text-sm font-medium transition-all ${
                            accountType === 'customer' 
                            ? 'bg-white text-saintara-black shadow' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setAccountType('instansi')}
                        className={`w-1/2 rounded-md py-2 text-sm font-medium transition-all ${
                            accountType === 'instansi' 
                            ? 'bg-white text-saintara-black shadow' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Instansi
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    
                    {/* --- FORM KHUSUS CUSTOMER --- */}
                    {accountType === 'customer' && (
                        <>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                    required
                                />
                                {errors.nama_lengkap && <p className="text-xs text-red-500">{errors.nama_lengkap}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nama Panggilan</label>
                                <input
                                    type="text"
                                    value={data.nama_panggilan}
                                    onChange={(e) => setData('nama_panggilan', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                />
                            </div>
                        </>
                    )}

                    {/* --- FORM KHUSUS INSTANSI --- */}
                    {accountType === 'instansi' && (
                        <>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nama Instansi</label>
                                <input
                                    type="text"
                                    value={data.nama_instansi}
                                    onChange={(e) => setData('nama_instansi', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                    required
                                />
                                {errors.nama_instansi && <p className="text-xs text-red-500">{errors.nama_instansi}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">PIC Name</label>
                                    <input
                                        type="text"
                                        value={data.pic_name}
                                        onChange={(e) => setData('pic_name', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Bidang</label>
                                    <input
                                        type="text"
                                        value={data.bidang}
                                        onChange={(e) => setData('bidang', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- FORM UMUM (Dipakai Keduanya) --- */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            required
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">No Telepon</label>
                        <input
                            type="tel"
                            value={data.no_telp}
                            onChange={(e) => setData('no_telp', e.target.value)}
                            className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                        />
                    </div>

                    {/* Tampilkan Kota/Negara/Alamat hanya jika diperlukan atau untuk kedua user */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Kota</label>
                            <input
                                type="text"
                                value={data.kota}
                                onChange={(e) => setData('kota', e.target.value)}
                                className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Negara</label>
                            <input
                                type="text"
                                value={data.negara}
                                onChange={(e) => setData('negara', e.target.value)}
                                className="w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        
                        {/* Container Relative (Penting: Input harus ada DI DALAM div ini) */}
                        <div className="relative">
                            <input
                                // Logika ubah tipe text/password
                                type={showPassword ? "text" : "password"} 
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                // Tambahkan 'pr-10' agar teks tidak tertabrak icon mata
                                className="w-full rounded-lg border-gray-300 bg-white text-gray-900 px-4 py-2 pr-10 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                required
                            />
                            
                            {/* Tombol Mata (Absolute Position) */}
                            <button
                                type="button" // Wajib button agar tidak submit form
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    // Icon Mata Coret (Hide Password)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    // Icon Mata Biasa (Show Password)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                        
                        <div className="relative">
                            <input
                                // Menggunakan state showConfirmPassword
                                type={showConfirmPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                // Tambahkan pr-10 dan bg-white text-gray-900
                                className="w-full rounded-lg border-gray-300 bg-white text-gray-900 px-4 py-2 pr-10 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                required
                            />
                            
                            <button
                                type="button"
                                // Toggle state khusus konfirmasi
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                    // Ikon Mata Coret
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    // Ikon Mata Biasa
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-full bg-saintara-black py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-yellow-600 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : `Daftar sebagai ${accountType === 'customer' ? 'Customer' : 'Instansi'}`}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link href={'/login'} className="font-bold text-yellow-600 hover:underline">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}