import { Head, useForm } from '@inertiajs/react';
import React from 'react';

// Interface untuk TypeScript
interface SaintaraDonationData {
    paket_id: string;
    [key: string]: any;
}

export default function FormHadiahDonasiSaintara() {
    // Setup Form (Hanya butuh paket_id)
    const { data, setData, post, processing, errors, reset } = useForm<SaintaraDonationData>({
        paket_id: '',
    });

    // Validasi tombol (hanya aktif jika paket dipilih)
    const isFormValid = !!data.paket_id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // PERBAIKAN URL DISINI (Sesuai web.php group donasi -> Route::post('/saintara'))
        post('/personal/donasi/saintara', {
            preserveScroll: true,
            onSuccess: () => {
                alert('Terima kasih! Token Anda telah didonasikan ke Saintara.');
                reset();
            },
            onError: () => {
                // Error handled by Inertia
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBE6] px-4">
            <Head title="Donasi ke Saintara" />

            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-[#B8860B]">Saintara</h1>
                    <h2 className="text-2xl font-bold text-black">Donasi ke Saintara</h2>
                    <p className="mt-1 text-sm text-gray-600">Dukung platform kami dengan mendonasikan token Anda.</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Pilihan Paket */}
                        <div>
                            <label htmlFor="paket_id" className="mb-2 block text-sm font-bold text-black">
                                Pilih Paket Token
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

                            {/* Keterangan tambahan */}
                            <p className="mt-2 text-xs text-gray-500">Token akan dikembalikan ke sistem Saintara dan hak kepemilikan Anda akan dilepas.</p>

                            {errors.paket_id && <p className="mt-1 text-xs font-medium text-red-500">{errors.paket_id}</p>}
                        </div>

                        {/* Pesan Error Global (misal stok habis) */}
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
                                    'Donasikan ke Saintara'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
