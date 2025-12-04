import React from "react";
import { useForm, Head } from "@inertiajs/react";

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

        post('/personal/donation/send', {
            preserveScroll: true,
            onSuccess: () => {
                alert("Berhasil! Token telah didonasikan.");
                reset();
            },
            onError: () => {
                // Error handle otomatis
            }
        });
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFBE6] px-4">
            <Head title="Donasi Token" />

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
                    <h2 className="text-2xl font-bold text-black">Formulir Donasi Token</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Pilih paket token yang ingin Anda berikan
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Pilihan Paket (Dropdown) */}
                        <div>
                            <label htmlFor="paket_id" className="block text-sm font-bold text-black mb-2">
                                Pilih Jenis Paket
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
                            {errors.paket_id && (
                                <p className="mt-1 text-xs text-red-500 font-medium">{errors.paket_id}</p>
                            )}
                        </div>

                        {/* Input Email Penerima */}
                        <div>
                            <label htmlFor="email_penerima" className="block text-sm font-bold text-black mb-2">
                                Email Penerima
                            </label>
                            <input
                                id="email_penerima"
                                type="email"
                                className={`w-full rounded-lg border bg-white p-3 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                                    errors.email_penerima 
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                    : "border-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
                                }`}
                                placeholder="contoh: budisantoso@gmail.com"
                                value={data.email_penerima}
                                onChange={(e) => setData('email_penerima', e.target.value)}
                            />
                            {errors.email_penerima && (
                                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email_penerima}</p>
                            )}
                        </div>

                        {/* Input Nama Penerima */}
                        <div>
                            <label htmlFor="nama_penerima" className="block text-sm font-bold text-black mb-2">
                                Nama Penerima
                            </label>
                            <input
                                id="nama_penerima"
                                type="text"
                                className={`w-full rounded-lg border bg-white p-3 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                                    errors.nama_penerima 
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                    : "border-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
                                }`}
                                placeholder="contoh: Budi Santoso"
                                value={data.nama_penerima}
                                onChange={(e) => setData('nama_penerima', e.target.value)}
                            />
                            {errors.nama_penerima && (
                                <p className="mt-1 text-xs text-red-500 font-medium">{errors.nama_penerima}</p>
                            )}
                        </div>

                        {/* Pesan Error Global (Sekarang Error ini sudah valid) */}
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
