import { Link, router, usePage } from '@inertiajs/react'; // Tambah router & usePage
import { ReactNode } from 'react';
import { HiBell, HiCog, HiCreditCard, HiDocumentReport, HiDocumentText, HiGift, HiHome, HiLogout, HiSupport, HiUserCircle } from 'react-icons/hi';

// Daftar Menu
const menuItems = [
    { name: 'Beranda', href: '/personal/dashboardPersonal', icon: HiHome },
    { name: 'Profil', href: '/personal/profilePersonal', icon: HiUserCircle },
    { name: 'Daftar Tes Karakter', href: '/personal/daftarTesPersonal', icon: HiDocumentText },
    { name: 'Transaksi & Token', href: '/personal/transaksiTokenPersonal', icon: HiCreditCard },
    { name: 'Hasil Tes', href: '/personal/hasilTesPersonal', icon: HiDocumentReport },
    { name: 'Hadiah & Donasi', href: '/personal/hadiahDonasiPersonal', icon: HiGift },
    { name: 'Bantuan', href: '/personal/bantuanPersonal', icon: HiSupport },
    { name: 'Pengaturan', href: '/personal/settingPersonal', icon: HiCog },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    // 1. AMBIL DATA USER LANGSUNG DARI SERVER (INERTIA)
    const { url, props } = usePage();
    const { auth } = props as any;
    // Ambil user dari props, jika null/tidak ada, fallback ke object kosong
    const user = auth?.user || {};

    // 2. FUNGSI LOGOUT YANG BENAR (POST ke Server)
    const logout = () => {
        // Karena kita sudah pakai session, cukup POST ke /logout
        router.post('/logout');
    };

    // Fallback Nama: Ambil dari name (accessor) atau nama_lengkap (db) atau default 'Tamu'
    const displayName = user.name || user.nama_lengkap || 'Tamu';

    return (
        <div className="flex min-h-screen bg-gray-50 font-poppins">
            {/* === SIDEBAR === */}
            <aside className="flex w-64 flex-shrink-0 flex-col bg-gray-900 text-white transition-all duration-300">
                {/* Logo */}
                <div className="flex h-20 items-center justify-center border-b border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/assets/logo/4.png" alt="Logo" className="h-8 w-8 rounded-full bg-white object-contain" />
                        <h1 className="cursor-pointer text-2xl font-bold tracking-wider text-white transition-colors hover:text-yellow-400">SAINTARA</h1>
                    </Link>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex-1 space-y-2 px-4 py-6">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link key={item.name} href={item.href} className={`group flex items-center rounded-lg px-4 py-2.5 transition-all duration-300 ${isActive ? 'bg-yellow-400 font-bold text-gray-900 shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                <item.icon className={`mr-3 h-6 w-6 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-yellow-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="flex-shrink-0 border-t border-gray-700 px-4 py-4">
                    <button onClick={logout} className="flex w-full items-center rounded-lg px-4 py-2.5 text-gray-300 transition-all duration-300 hover:bg-red-600 hover:text-white">
                        <HiLogout className="mr-3 h-6 w-6" /> Logout
                    </button>
                </div>
            </aside>

            {/* === KONTEN UTAMA === */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shadow-sm">
                    {/* Nama User Dinamis */}
                    <h2 className="text-2xl font-bold text-gray-800">Selamat datang, {displayName}!</h2>

                    <div className="flex items-center space-x-3">
                        {/* Profile Link / Avatar */}
                        <Link href="/personal/profilePersonal" className="flex cursor-pointer items-center rounded-full bg-yellow-400 px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg">
                            <div className="mr-2 h-9 w-9 overflow-hidden rounded-full bg-gray-200">
                                {/* Tampilkan foto atau inisial */}
                                {user.foto ? <img src={user.foto} alt="Avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center font-bold text-gray-600">{displayName.charAt(0)}</div>}
                            </div>

                            <div className="text-sm">
                                <p className="leading-none font-bold text-gray-900">{displayName}</p>
                                <p className="text-xs leading-none text-gray-700">{user.email || 'No Email'}</p>
                            </div>
                        </Link>

                        <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-gray-900 shadow-md transition-colors hover:bg-yellow-500">
                            <HiBell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-red-600"></span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">{children}</main>
            </div>
        </div>
    );
}
