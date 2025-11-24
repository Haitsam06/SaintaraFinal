import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, Link } from '@inertiajs/react';

export default function HadiahDonasi() {
    return (
        <DashboardLayout>
            <Head title="Hadiah dan Donasi" />

            <div className="flex min-h-[80vh] flex-col p-6">
                {/* Header Section */}
                <div className="mx-auto mb-10 max-w-2xl text-center">
                    <h1 className="mb-3 text-3xl font-bold text-[#2A2A2A]">Berbagi Kebaikan</h1>
                    <p className="text-gray-600">Anda memiliki token berlebih? Gunakan fitur di bawah ini untuk memberikan token Anda kepada teman sebagai hadiah, atau kembalikan ke Saintara sebagai bentuk dukungan.</p>
                </div>

                {/* Selection Grid */}
                <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {/* OPSI 1: Kirim ke Teman */}
                    <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:border-yellow-400 hover:shadow-2xl">
                        {/* Dekorasi Background */}
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-yellow-100 opacity-50 transition-transform duration-500 group-hover:scale-150"></div>

                        {/* Icon Gift */}
                        <div className="z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 transition-colors group-hover:bg-yellow-400 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                />
                            </svg>
                        </div>

                        <h2 className="z-10 mb-3 text-2xl font-bold text-[#2A2A2A]">Kirim ke Teman</h2>
                        <p className="z-10 mb-8 flex-grow text-gray-500">Berikan kejutan kepada teman atau kerabat Anda dengan mengirimkan token tes kepribadian langsung ke akun mereka.</p>

                        {/* Tombol Link ke Form 1 */}
                        <Link
                            // PERBAIKAN LINK DISINI
                            href="/personal/donasi/kirim"
                            className="z-10 w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-yellow-500 hover:text-black"
                        >
                            Kirim Hadiah Sekarang
                        </Link>
                    </div>

                    {/* OPSI 2: Donasi ke Saintara */}
                    <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:border-yellow-400 hover:shadow-2xl">
                        {/* Dekorasi Background */}
                        <div className="absolute top-0 left-0 -mt-8 -ml-8 h-32 w-32 rounded-full bg-yellow-100 opacity-50 transition-transform duration-500 group-hover:scale-150"></div>

                        {/* Icon Hand/Heart */}
                        <div className="z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 transition-colors group-hover:bg-yellow-400 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>

                        <h2 className="z-10 mb-3 text-2xl font-bold text-[#2A2A2A]">Donasi ke Saintara</h2>
                        <p className="z-10 mb-8 flex-grow text-gray-500">Dukung pengembangan platform Saintara dengan mengembalikan token yang tidak terpakai ke dalam sistem kami.</p>

                        {/* Tombol Link ke Form 2 (Baru) */}
                        <Link
                            // PERBAIKAN LINK DISINI
                            href="/personal/donasi/saintara"
                            className="z-10 w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-yellow-500 hover:text-black"
                        >
                            Donasi ke Saintara
                        </Link>
                    </div>
                </div>

                {/* Info Tambahan */}
                <div className="mt-12 text-center text-sm text-gray-400">
                    <p>Pastikan Anda memiliki saldo token yang cukup sebelum melakukan transaksi.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
