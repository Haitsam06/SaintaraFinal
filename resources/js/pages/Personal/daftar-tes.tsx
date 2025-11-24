import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, Link } from '@inertiajs/react';

// Definisi Tipe Data
interface PaketItem {
    id_paket: string;
    nama_paket: string;
    harga: number;
    deskripsi: string;
    jumlah_karakter: number;
    has_token: boolean;
}

interface DaftarTesProps {
    daftar_paket: PaketItem[];
}

export default function DaftarTesKarakter({ daftar_paket = [] }: DaftarTesProps) {
    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <DashboardLayout>
            <Head title="Daftar Tes Karakter" />

            <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#2A2A2A]">
                {/* === HERO SECTION === */}
                <div className="relative mb-10 overflow-hidden rounded-b-[3rem] bg-black px-6 pt-12 pb-24 text-white shadow-lg">
                    {/* Dekorasi Background Abstrak */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>

                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Temukan Potensi Diri Anda</h1>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">Pilih paket analisis karakter yang sesuai dengan kebutuhan Anda. Mulai perjalanan mengenal diri sendiri hari ini.</p>
                    </div>
                </div>

                {/* === CONTENT GRID === */}
                <div className="relative z-20 mx-auto -mt-16 max-w-6xl px-6 pb-12">
                    {daftar_paket.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Belum Ada Paket</h3>
                            <p className="mt-2 text-gray-500">Paket tes karakter belum tersedia saat ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
                            {daftar_paket.map((paket) => {
                                const isPremium = paket.nama_paket.toLowerCase().includes('premium');

                                return (
                                    <div
                                        key={paket.id_paket}
                                        className={`group relative flex h-full flex-col rounded-3xl bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${isPremium ? 'border-2 border-yellow-400 ring-4 shadow-yellow-100 ring-yellow-50' : 'border border-gray-100 shadow-md'} `}
                                    >
                                        {/* Badge Status Token */}
                                        {paket.has_token && (
                                            <div className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-tr-2xl rounded-bl-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                TOKEN TERSEDIA
                                            </div>
                                        )}

                                        {/* Badge Best Value (Khusus Premium) */}
                                        {isPremium && !paket.has_token && <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black px-4 py-1 text-xs font-bold tracking-wide text-yellow-400 shadow-lg">REKOMENDASI</div>}

                                        <div className="flex flex-1 flex-col p-8">
                                            {/* Header Paket */}
                                            <div className="mb-6">
                                                <h2 className="mb-2 text-xl font-bold text-gray-900">{paket.nama_paket}</h2>
                                                <p className="line-clamp-2 h-10 text-sm leading-relaxed text-gray-500">{paket.deskripsi}</p>
                                            </div>

                                            {/* Harga */}
                                            <div className="mb-8 border-b border-gray-100 pb-8">
                                                <div className="flex items-baseline">
                                                    <span className="text-3xl font-extrabold text-black">{formatRupiah(paket.harga)}</span>
                                                    <span className="ml-2 font-medium text-gray-400">/ tes</span>
                                                </div>
                                            </div>

                                            {/* Fitur List */}
                                            <ul className="mb-8 flex-1 space-y-4">
                                                <li className="flex items-start gap-3">
                                                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                                                        <svg className="h-3 w-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        Laporan Lengkap <strong className="text-gray-900">{paket.jumlah_karakter} Karakter</strong>
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                                                        <svg className="h-3 w-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-600">Analisis Karakter Alami</span>
                                                </li>
                                                {isPremium && (
                                                    <li className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                                                            <svg className="h-3 w-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-gray-600">Konsultasi dengan Psikolog</span>
                                                    </li>
                                                )}
                                            </ul>

                                            {/* Tombol Aksi */}
                                            <div className="mt-auto">
                                                {paket.has_token ? (
                                                    <Link href={`/personal/ujian?paket_id=${paket.id_paket}`} className="block w-full">
                                                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white shadow-lg transition-all group-hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl">
                                                            Mulai Tes Sekarang
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </button>
                                                    </Link>
                                                ) : (
                                                    <Link href="/personal/transaksi-token" className="block w-full">
                                                        <button
                                                            className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 font-bold transition-all ${
                                                                isPremium ? 'border-yellow-400 bg-yellow-400 text-black hover:border-yellow-500 hover:bg-yellow-500' : 'border-gray-200 bg-white text-gray-900 hover:border-black hover:text-black'
                                                            }`}
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                            </svg>
                                                            Beli Token
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
