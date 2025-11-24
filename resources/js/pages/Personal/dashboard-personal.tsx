import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, Link } from '@inertiajs/react';
import { HiCreditCard, HiGift, HiOutlineSparkles, HiSupport, HiUserCircle } from 'react-icons/hi';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Head title="Dashboard Personal" />

            <div className="min-h-screen bg-gray-50 pb-12 font-sans text-[#2A2A2A]">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* === 2. KOLOM KIRI (2/3): HERO / RESULT === */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-3xl bg-black p-10 text-white shadow-xl">
                            {/* Dekorasi BG */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-yellow-500 opacity-20 blur-3xl"></div>

                            <div className="relative z-10 max-w-lg">
                                <h2 className="mb-4 text-3xl leading-tight font-bold">
                                    Anda belum mengetahui <span className="text-yellow-400">potensi asli</span> diri Anda?
                                </h2>
                                <p className="mb-8 leading-relaxed text-gray-300">Ikuti tes kepribadian Saintara sekarang untuk mendapatkan laporan mendalam tentang kekuatan, kelemahan, dan potensi karir Anda.</p>
                                {/* PERBAIKAN LINK: Daftar Tes */}
                                <Link href="/personal/daftar-tes">
                                    <button className="flex items-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black shadow-lg transition-all hover:bg-yellow-300 hover:shadow-yellow-400/50">
                                        <HiOutlineSparkles className="h-5 w-5" />
                                        Mulai Tes Sekarang
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Section Info Tambahan (Optional) */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                <h4 className="mb-2 font-bold text-blue-800">Fitur Baru!</h4>
                                <p className="text-sm text-blue-600">Kini Anda bisa mengirim token sebagai hadiah kepada teman.</p>
                            </div>
                            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                                <h4 className="mb-2 font-bold text-purple-800">Butuh Bantuan?</h4>
                                <p className="text-sm text-purple-600">Tim support kami siap membantu kendala teknis Anda.</p>
                            </div>
                        </div>
                    </div>

                    {/* === 3. KOLOM KANAN (1/3): SHORTCUTS === */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                                <span className="h-5 w-1.5 rounded-full bg-yellow-400"></span>
                                Akses Cepat
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Shortcut 1: Beli Token */}
                                {/* PERBAIKAN LINK: Beli Token (Checkout) */}
                                <Link href="/personal/transaksi-token" className="group flex flex-col items-center justify-center rounded-xl border border-transparent bg-gray-50 p-4 transition-all duration-200 hover:border-yellow-200 hover:bg-yellow-50">
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-transform group-hover:scale-110 group-hover:text-yellow-600">
                                        <HiCreditCard className="h-5 w-5" />
                                    </div>
                                    <span className="text-center text-xs font-bold text-gray-600 group-hover:text-gray-900">Beli Token</span>
                                </Link>

                                {/* Shortcut 2: Kirim Hadiah */}
                                {/* PERBAIKAN LINK: Donasi (Index) */}
                                <Link href="/personal/donasi" className="group flex flex-col items-center justify-center rounded-xl border border-transparent bg-gray-50 p-4 transition-all duration-200 hover:border-pink-200 hover:bg-pink-50">
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-transform group-hover:scale-110 group-hover:text-pink-500">
                                        <HiGift className="h-5 w-5" />
                                    </div>
                                    <span className="text-center text-xs font-bold text-gray-600 group-hover:text-gray-900">Kirim Hadiah</span>
                                </Link>

                                {/* Shortcut 3: Profil */}
                                {/* PERBAIKAN LINK: Profile */}
                                <Link href="/personal/profile" className="group flex flex-col items-center justify-center rounded-xl border border-transparent bg-gray-50 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50">
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-transform group-hover:scale-110 group-hover:text-blue-500">
                                        <HiUserCircle className="h-5 w-5" />
                                    </div>
                                    <span className="text-center text-xs font-bold text-gray-600 group-hover:text-gray-900">Edit Profil</span>
                                </Link>

                                {/* Shortcut 4: Bantuan */}
                                {/* PERBAIKAN LINK: Bantuan */}
                                <Link href="/personal/bantuan" className="group flex flex-col items-center justify-center rounded-xl border border-transparent bg-gray-50 p-4 transition-all duration-200 hover:border-green-200 hover:bg-green-50">
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-transform group-hover:scale-110 group-hover:text-green-500">
                                        <HiSupport className="h-5 w-5" />
                                    </div>
                                    <span className="text-center text-xs font-bold text-gray-600 group-hover:text-gray-900">Bantuan</span>
                                </Link>
                            </div>
                        </div>

                        {/* Banner Iklan Kecil / Info Paket */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 text-white">
                            <div className="relative z-10">
                                <h4 className="mb-1 font-bold text-yellow-400">Paket Premium</h4>
                                <p className="mb-4 text-xs leading-relaxed text-gray-300">Dapatkan analisis mendalam dan konsultasi ahli dengan paket premium.</p>
                                {/* PERBAIKAN LINK: Daftar Tes */}
                                <Link href="/personal/daftar-tes" className="text-xs font-bold underline decoration-yellow-400 underline-offset-4 transition-colors hover:text-yellow-400">
                                    Lihat Paket →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
