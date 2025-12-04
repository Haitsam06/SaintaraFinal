import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

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
        subject: '',
        category: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/personal/bantuanPersonal', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const faqItems = [
        {
            q: 'Apa itu Token dan untuk apa kegunaannya?',
            a: 'Token adalah alat tukar yang Anda gunakan untuk mengakses tes berbayar di platform Saintara.',
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
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-sm">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {flash.success}
                </div>
            )}

            <div className="min-h-screen bg-[#FAFAFA] p-6">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-[#2A2A2A]">Bantuan & Layanan</h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Kolom Kiri: Form */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
                        <h2 className="mb-2 text-xl font-bold text-gray-900">Punya Kendala?</h2>
                        <p className="mb-6 text-sm text-gray-500">Isi formulir di bawah ini dan tim support kami akan membalas melalui email.</p>

                        <form onSubmit={submit} className="space-y-5">
                            {/* INPUT SUBJEK */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">Subjek Kendala</label>
                                <input
                                    onChange={(e) => setData('subject', e.target.value)}
                                    value={data.subject}
                                    type="text"
                                    placeholder="Contoh: Error saat pembayaran"
                                    // PERBAIKAN DISINI: text-gray-900 bg-white
                                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400 transition-all outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                                />
                                {errors.subject && <div className="mt-1 text-xs font-semibold text-red-500">{errors.subject}</div>}
                            </div>

                            {/* SELECT KATEGORI */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">Kategori</label>
                                <select
                                    // PERBAIKAN DISINI: text-gray-900 bg-white
                                    className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                >
                                    <option value="" disabled>
                                        Pilih Kategori
                                    </option>
                                    <option value="teknis">Masalah Teknis</option>
                                    <option value="pembayaran">Kesalahan Pembayaran</option>
                                    <option value="akun">Akses Akun / Login</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                                {errors.category && <div className="mt-1 text-xs font-semibold text-red-500">{errors.category}</div>}
                            </div>

                            {/* TEXTAREA DESKRIPSI */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">Deskripsi</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    // PERBAIKAN DISINI: text-gray-900 bg-white
                                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400 transition-all outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Ceritakan detail kendala..."
                                />
                                {errors.description && <div className="mt-1 text-xs font-semibold text-red-500">{errors.description}</div>}
                            </div>

                            <button type="submit" disabled={processing} className="w-full rounded-xl bg-black px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl disabled:transform-none disabled:opacity-50">
                                {processing ? 'Mengirim...' : 'Kirim Laporan'}
                            </button>
                        </form>
                    </div>

                    {/* Kolom Kanan: FAQ */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Sering Ditanyakan
                            </h2>

                            <div className="space-y-3">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="overflow-hidden rounded-xl border border-gray-100">
                                        <button className={`flex w-full items-center justify-between p-4 text-left text-sm font-semibold transition-colors ${faqOpen === index ? 'bg-yellow-50 text-yellow-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`} onClick={() => toggleFAQ(index)}>
                                            {item.q}
                                            <span className={`transform transition-transform ${faqOpen === index ? 'rotate-180' : ''}`}>▾</span>
                                        </button>

                                        {faqOpen === index && <div className="border-t border-gray-100 bg-white p-4 text-sm leading-relaxed text-gray-600">{item.a}</div>}
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
