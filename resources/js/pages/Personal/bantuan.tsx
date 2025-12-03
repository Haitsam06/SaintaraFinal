import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout-personal";
import { Head, useForm, usePage } from "@inertiajs/react";

// 1. Definisikan Tipe Data Props
interface PageProps {
    auth: {
        user: any;
    };
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function Bantuan() {
    const [faqOpen, setFaqOpen] = useState<number | null>(0);
    
    // Ambil flash message dari props
    const { flash } = usePage<PageProps>().props;

    const toggleFAQ = (index: number) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: "",
        category: "",
        description: ""
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/personal/bantuanPersonal", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            }
        });
    };

    const faqItems = [
        {
            q: "Apa itu Token dan untuk apa kegunaannya?",
            a: "Token adalah alat tukar yang Anda gunakan untuk mengakses tes berbayar di platform Saintara.",
        },
        {
            q: 'Bagaimana cara membaca hasil tes saya?',
            a: 'Setelah tes selesai, hasil akan otomatis tersedia di menu Hasil Tes di dashboard Anda.',
        },
        {
            q: 'Apa data pribadi saya aman?',
            a: 'Kami menjaga privasi Anda dan tidak membagikan data pribadi apa pun kepada pihak ketiga tanpa izin.',
        },
    ];

    return (
        <DashboardLayout>
            <Head title="Bantuan & Layanan" />
            
            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 shadow-sm flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    {flash.success}
                </div>
            )}

            <div className="p-6 min-h-screen bg-[#FAFAFA]">
                <h1 className="text-3xl font-bold text-[#2A2A2A] mb-8 tracking-tight">
                    Bantuan & Layanan
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Punya Kendala?
                        </h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Isi formulir di bawah ini dan tim support kami akan membalas melalui email.
                        </p>

                        <form onSubmit={submit} className="space-y-5">
                            {/* INPUT SUBJEK */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subjek Kendala</label>
                                <input
                                    onChange={(e) => setData("subject", e.target.value)}
                                    value={data.subject}
                                    type="text"
                                    placeholder="Contoh: Error saat pembayaran"
                                    // PERBAIKAN DISINI: text-gray-900 bg-white
                                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all placeholder-gray-400"
                                />
                                {errors.subject && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.subject}</div>}
                            </div>

                            {/* SELECT KATEGORI */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                                <select 
                                    // PERBAIKAN DISINI: text-gray-900 bg-white
                                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none cursor-pointer" 
                                    value={data.category} 
                                    onChange={(e) => setData("category", e.target.value)}
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    <option value="teknis">Masalah Teknis</option>
                                    <option value="pembayaran">Kesalahan Pembayaran</option>
                                    <option value="akun">Akses Akun / Login</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                                {errors.category && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.category}</div>}
                            </div>

                            {/* TEXTAREA DESKRIPSI */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    rows={4}
                                    // PERBAIKAN DISINI: text-gray-900 bg-white
                                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all placeholder-gray-400"
                                    placeholder="Ceritakan detail kendala..."
                                />
                                {errors.description && <div className="text-red-500 text-xs mt-1 font-semibold">{errors.description}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-black text-white font-bold px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Laporan'}
                            </button>
                        </form>
                    </div>

                    {/* Kolom Kanan: FAQ */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Sering Ditanyakan
                            </h2>

                            <div className="space-y-3">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
                                        <button
                                            className={`w-full text-left p-4 text-sm font-semibold flex justify-between items-center transition-colors
                                                ${faqOpen === index ? "bg-yellow-50 text-yellow-800" : "bg-gray-50 hover:bg-gray-100 text-gray-700"}`}
                                            onClick={() => toggleFAQ(index)}
                                        >
                                            {item.q}
                                            <span className={`transform transition-transform ${faqOpen === index ? "rotate-180" : ""}`}>▾</span>
                                        </button>

                                        {faqOpen === index && (
                                            <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}