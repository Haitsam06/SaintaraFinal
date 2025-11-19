import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
// 1. Ubah Icon menjadi Solid (Hi) agar sesuai tema admin
import { HiBell, HiCog, HiCreditCard, HiDocumentReport, HiDocumentText, HiHome, HiSupport, HiUserCircle } from 'react-icons/hi';

// Mock Data untuk Header (disesuaikan dengan style admin)
const user = {
    name: 'PT. Maju Jaya Bersama',
    initial: 'MJ', // Inisial untuk avatar
};

// Daftar Menu (Isi tetap, tapi icon diubah ke solid)
const menuItems = [
    { name: 'Dashboard', href: '/instansi/dashboardInstansi', icon: HiHome },
    { name: 'Profil Organisasi', href: '/instansi/profilInstansi', icon: HiUserCircle },
    {
        name: 'Daftar Tes Karakter',
        href: '/instansi/tesInstansi',
        icon: HiDocumentText,
    },
    {
        name: 'Transaksi & Voucher',
        href: '/instansi/transaksiInstansi',
        icon: HiCreditCard,
    },
    { name: 'Hasil Tes', href: '/instansi/hasilInstansi', icon: HiDocumentReport },
    { name: 'Bantuan', href: '/instansi/bantuanInstansi', icon: HiSupport },
    { name: 'Pengaturan', href: '/instansi/pengaturanInstansi', icon: HiCog },
];

export default function InstansiLayout({ children }: { children: ReactNode }) {
    const { url } = usePage(); // Hook untuk cek URL aktif

    return (
        <div className="flex min-h-screen bg-gray-50 font-poppins">
            {/* === SIDEBAR (Diubah ke Tema Hitam/Kuning) === */}
            <aside className="flex w-64 flex-shrink-0 flex-col bg-saintara-black text-white transition-all duration-300">
                {/* Logo */}
                <div className="flex h-20 items-center justify-center border-b border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white"></div> {/* Logo Placeholder */}
                        <h1 className="cursor-pointer text-2xl font-bold tracking-wider text-white transition-colors hover:text-saintara-yellow">SAINTARA</h1>
                    </Link>
                </div>

                {/* Menu Navigasi (Diubah ke Tema Hitam/Kuning) */}
                <nav className="flex-1 space-y-2 px-4 py-6">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                // ClassName disesuaikan dengan tema admin (hitam/kuning)
                                className={`group flex items-center rounded-lg px-4 py-2.5 transition-all duration-300 ${
                                    isActive
                                        ? 'bg-saintara-yellow font-bold text-gray-900 shadow-md' // Style Aktif
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Style Normal
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-6 w-6 transition-colors ${
                                        isActive
                                            ? 'text-gray-900' // Ikon Aktif
                                            : 'text-gray-400 group-hover:text-saintara-yellow' // Ikon Normal
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* === KONTEN UTAMA (Kanan) === */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* === HEADER (Diubah ke Tema Admin) === */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800">Selamat datang, Budi Santoso!</h2>

                    <div className="flex items-center space-x-3">
                        <a href="/instansi/profileInstansi" className="flex cursor-pointer items-center rounded-full bg-saintara-yellow px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg">
                            <div className="mr-2 h-9 w-9 overflow-hidden rounded-full">
                                <img src="https://via.placeholder.com/150/FBBF24/000000?text=BS" alt="Avatar" className="h-full w-full object-cover" />
                            </div>

                            <div className="text-sm">
                                <p className="leading-none font-bold text-gray-900">Budi Santoso</p>
                                <p className="text-xs leading-none text-gray-700">email@example.com</p>
                            </div>
                        </a>

                        <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-saintara-yellow text-gray-900 shadow-md transition-colors hover:bg-yellow-500">
                            <HiBell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-red-600"></span>
                        </button>
                    </div>
                </header>

                {/* === KONTEN DINAMIS (Children) === */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">{children}</main>
            </div>
        </div>
    );
}
