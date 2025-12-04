import React from "react";
import { useForm, Head } from "@inertiajs/react";

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

        // Post ke route baru
        post('/personal/donation/saintara', {
            preserveScroll: true,
            onSuccess: () => {
                alert("Terima kasih! Token Anda telah didonasikan ke Saintara.");
                reset();
            },
            onError: () => {
                // Error handled by Inertia
            }
        });
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFBE6] px-4">
            <Head title="Donasi ke Saintara" />

            <div className="w-full max-w-lg">

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
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#B8860B] mb-2">Saintara</h1>
                    <h2 className="text-2xl font-bold text-black">Donasi ke Saintara</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Dukung platform kami dengan mendonasikan token Anda.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Pilihan Paket */}
                        <div>
                            <label htmlFor="paket_id" className="block text-sm font-bold text-black mb-2">
                                Pilih Paket Token
                            </label>
                            <select
                                id="paket_id"
                                className={`w-full rounded-lg border bg-white p-3 text-sm text-black focus:outline-none focus:ring-1 transition-all cursor-pointer ${
                                    errors.paket_id 
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                    : "border-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
                                }`}
                                value={data.paket_id}
                                onChange={(e) => setData('paket_id', e.target.value)}
                            >
                                <option value="" disabled>-- Pilih Paket Token --</option>
                                <option value="DSR">Paket Dasar (DSR)</option>
                                <option value="STD">Paket Standar (STD)</option>
                                <option value="PRM">Paket Premium (PRM)</option>
                            </select>
                            
                            {/* Keterangan tambahan */}
                            <p className="text-xs text-gray-500 mt-2">
                                Token akan dikembalikan ke sistem Saintara dan hak kepemilikan Anda akan dilepas.
                            </p>

                            {errors.paket_id && (
                                <p className="mt-1 text-xs text-red-500 font-medium">{errors.paket_id}</p>
                            )}
                        </div>

                        {/* Pesan Error Global (misal stok habis) */}
                        {errors.message && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                                {errors.message}
                            </div>
                        )}

                        {/* Tombol Kirim */}
                        <div className="mt-2">
                            <button
                                type="submit"
                                disabled={processing || !isFormValid}
                                className="w-full bg-[#F4C546] hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
