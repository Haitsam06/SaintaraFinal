import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, Link } from '@inertiajs/react';
import {
    HiCreditCard,
    HiDocumentText,
    HiGift,
    HiOutlineLightBulb,
    HiOutlineSparkles,
    HiSupport,
    HiUserCircle
} from 'react-icons/hi';

export default function Dashboard() {

    return (
        <DashboardLayout>
            <Head title="Dashboard Personal" />

            <div className="min-h-screen bg-gray-50 pb-12 font-sans text-[#2A2A2A]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* === 2. KOLOM KIRI (2/3): HERO / RESULT === */}
                    <div className="lg:col-span-2 space-y-6"> 
                        <div className="bg-black rounded-3xl shadow-xl p-10 text-white relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                            {/* Dekorasi BG */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                            
                            <div className="relative z-10 max-w-lg">
                                <h2 className="text-3xl font-bold mb-4 leading-tight">
                                    Anda belum mengetahui <span className="text-yellow-400">potensi asli</span> diri Anda?
                                </h2>
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Ikuti tes kepribadian Saintara sekarang untuk mendapatkan laporan mendalam tentang kekuatan, kelemahan, dan potensi karir Anda.
                                </p>
                                <Link href="/personal/daftarTesPersonal">
                                    <button className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-400/50 flex items-center gap-2">
                                        <HiOutlineSparkles className="w-5 h-5" />
                                        Mulai Tes Sekarang
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Section Info Tambahan (Optional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-2">Fitur Baru!</h4>
                                <p className="text-sm text-blue-600">Kini Anda bisa mengirim token sebagai hadiah kepada teman.</p>
                            </div>
                            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                                <h4 className="font-bold text-purple-800 mb-2">Butuh Bantuan?</h4>
                                <p className="text-sm text-purple-600">Tim support kami siap membantu kendala teknis Anda.</p>
                            </div>
                        </div>
                    </div>

                    {/* === 3. KOLOM KANAN (1/3): SHORTCUTS === */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full"></span>
                                Akses Cepat
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {/* Shortcut 1: Beli Token */}
                                <Link href="/personal/transaksiTokenPersonal" className="group flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-yellow-50 border border-transparent hover:border-yellow-200 transition-all duration-200">
                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-700 group-hover:text-yellow-600 group-hover:scale-110 transition-transform mb-2">
                                        <HiCreditCard className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 text-center">Beli Token</span>
                                </Link>

                                {/* Shortcut 2: Kirim Hadiah */}
                                <Link href="/personal/hadiahDonasiPersonal" className="group flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-pink-50 border border-transparent hover:border-pink-200 transition-all duration-200">
                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-700 group-hover:text-pink-500 group-hover:scale-110 transition-transform mb-2">
                                        <HiGift className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 text-center">Kirim Hadiah</span>
                                </Link>

                                {/* Shortcut 3: Profil */}
                                <Link href="/personal/profilePersonal" className="group flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-200">
                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-700 group-hover:text-blue-500 group-hover:scale-110 transition-transform mb-2">
                                        <HiUserCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 text-center">Edit Profil</span>
                                </Link>

                                {/* Shortcut 4: Bantuan */}
                                <Link href="/personal/bantuanPersonal" className="group flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-green-50 border border-transparent hover:border-green-200 transition-all duration-200">
                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-700 group-hover:text-green-500 group-hover:scale-110 transition-transform mb-2">
                                        <HiSupport className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 text-center">Bantuan</span>
                                </Link>
                            </div>
                        </div>

                        {/* Banner Iklan Kecil / Info Paket */}
                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-bold text-yellow-400 mb-1">Paket Premium</h4>
                                <p className="text-xs text-gray-300 mb-4 leading-relaxed">Dapatkan analisis mendalam dan konsultasi ahli dengan paket premium.</p>
                                <Link href="/personal/daftarTesPersonal" className="text-xs font-bold underline decoration-yellow-400 underline-offset-4 hover:text-yellow-400 transition-colors">
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