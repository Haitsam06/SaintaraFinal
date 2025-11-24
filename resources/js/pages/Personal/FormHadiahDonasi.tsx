import { Head, useForm } from '@inertiajs/react';
import React from 'react';

// --- PERBAIKAN 1: Buat Interface (Definisi Tipe Data) ---
interface DonationData {
    email_penerima: string;
    nama_penerima: string;
    paket_id: string;
    // Baris di bawah ini ("Index Signature") membolehkan field tambahan seperti 'message'
    [key: string]: any;
}

export default function DonationForm() {
    // --- PERBAIKAN 2: Pasang <DonationData> di useForm ---
    // Dengan cara ini, TypeScript paham bahwa 'errors' bisa punya key 'message'
    const { data, setData, post, processing, errors, reset } = useForm<DonationData>({
        email_penerima: '',
        nama_penerima: '',
        paket_id: '',
    });

    // Validasi frontend: Paket harus dipilih juga
    const isFormValid = data.email_penerima && data.nama_penerima && data.paket_id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // PERBAIKAN URL DISINI (Sesuai web.php group donasi -> Route::post('/kirim'))
        post('/personal/donasi/kirim', {
            preserveScroll: true,
            onSuccess: () => {
                alert('Berhasil! Token telah didonasikan.');
                reset();
            },
            onError: () => {
                // Error handle otomatis
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBE6] px-4">
            <Head title="Donasi Token" />

            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-[#B8860B]">Saintara</h1>
                    <h2 className="text-2xl font-bold text-black">Formulir Donasi Token</h2>
                    <p className="mt-1 text-sm text-gray-600">Pilih paket token yang ingin Anda berikan</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Pilihan Paket (Dropdown) */}
                        <div>
                            <label htmlFor="paket_id" className="mb-2 block text-sm font-bold text-black">
                                Pilih Jenis Paket
                            </label>
                            <select
                                id="paket_id"
                                className={`w-full cursor-pointer rounded-lg border bg-white p-3 text-sm text-black transition-all focus:ring-1 focus:outline-none ${
                                    errors.paket_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-400 focus:border-yellow-500 focus:ring-yellow-500'
                                }`}
                                value={data.paket_id}
                                onChange={(e) => setData('paket_id', e.target.value)}
                            >
                                <option value="" disabled>
                                    -- Pilih Paket Token --
                                </option>
                                <option value="DSR">Paket Dasar (DSR)</option>
                                <option value="STD">Paket Standar (STD)</option>
                                <option value="PRM">Paket Premium (PRM)</option>
                            </select>
                            {errors.paket_id && <p className="mt-1 text-xs font-medium text-red-500">{errors.paket_id}</p>}
                        </div>

                        {/* Input Email Penerima */}
                        <div>
                            <label htmlFor="email_penerima" className="mb-2 block text-sm font-bold text-black">
                                Email Penerima
                            </label>
                            <input
                                id="email_penerima"
                                type="email"
                                className={`w-full rounded-lg border bg-white p-3 text-sm text-black placeholder-gray-500 transition-all focus:ring-1 focus:outline-none ${
                                    errors.email_penerima ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-400 focus:border-yellow-500 focus:ring-yellow-500'
                                }`}
                                placeholder="contoh: budisantoso@gmail.com"
                                value={data.email_penerima}
                                onChange={(e) => setData('email_penerima', e.target.value)}
                            />
                            {errors.email_penerima && <p className="mt-1 text-xs font-medium text-red-500">{errors.email_penerima}</p>}
                        </div>

                        {/* Input Nama Penerima */}
                        <div>
                            <label htmlFor="nama_penerima" className="mb-2 block text-sm font-bold text-black">
                                Nama Penerima
                            </label>
                            <input
                                id="nama_penerima"
                                type="text"
                                className={`w-full rounded-lg border bg-white p-3 text-sm text-black placeholder-gray-500 transition-all focus:ring-1 focus:outline-none ${
                                    errors.nama_penerima ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-400 focus:border-yellow-500 focus:ring-yellow-500'
                                }`}
                                placeholder="contoh: Budi Santoso"
                                value={data.nama_penerima}
                                onChange={(e) => setData('nama_penerima', e.target.value)}
                            />
                            {errors.nama_penerima && <p className="mt-1 text-xs font-medium text-red-500">{errors.nama_penerima}</p>}
                        </div>

                        {/* Pesan Error Global (Sekarang Error ini sudah valid) */}
                        {errors.message && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">{errors.message}</div>}

                        {/* Tombol Kirim */}
                        <div className="mt-2">
                            <button type="submit" disabled={processing || !isFormValid} className="flex w-full items-center justify-center rounded-lg bg-[#F4C546] px-4 py-3 font-bold text-black shadow-sm transition-all hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50">
                                {processing ? (
                                    <>
                                        <svg className="mr-3 -ml-1 h-5 w-5 animate-spin text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    'Kirim Token'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
