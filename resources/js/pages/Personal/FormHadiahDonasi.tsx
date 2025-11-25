import React from "react";
import { useForm, Head } from "@inertiajs/react";

export default function DonationForm() {
    // 1. Setup State Form
    const { data, setData, post, processing, errors, reset } = useForm({
        email_penerima: '',
        nama_penerima: '',
    });

    // Validasi sederhana di frontend
    const isFormValid = data.email_penerima && data.nama_penerima;

    // 2. Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // PENTING: URL harus sesuai dengan route di web.php
        // Karena ada di group prefix 'personal', maka URL-nya: /personal/donation/send
        post('/personal/donation/send', {
            preserveScroll: true,
            onSuccess: () => {
                alert("Berhasil! Token telah didonasikan.");
                reset(); // Bersihkan form setelah sukses
            },
            onError: () => {
                // Error akan otomatis muncul di text merah di bawah input
                console.error("Gagal mengirim donasi.");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFBE6] px-4">
            {/* Ubah Title Tab Browser */}
            <Head title="Donasi Token" />

            <div className="w-full max-w-lg">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#B8860B] mb-2">Saintara</h1>
                    <h2 className="text-2xl font-bold text-black">Formulir Donasi Token</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Berikan token Anda kepada teman atau kerabat
                    </p>
                </div>

                {/* Card Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

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

                        {/* Tombol Kirim */}
                        <div className="mt-4">
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

                        {/* Info Tambahan */}
                        <div className="text-center text-xs text-gray-500">
                            Pastikan email penerima sudah terdaftar di Saintara.
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}