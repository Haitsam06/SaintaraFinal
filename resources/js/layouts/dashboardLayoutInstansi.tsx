import { Link, usePage, router } from '@inertiajs/react'; // Tambah router
import { ReactNode } from 'react';
import {
    HiBell,
    HiCog,
    HiCreditCard,
    HiDocumentReport,
    HiDocumentText,
    HiHome,
    HiLogout,
    HiSupport,
    HiUserCircle,
} from 'react-icons/hi';

// --- Interface Data User dari Backend ---
interface InstansiUser {
    id_instansi: string;
    nama_instansi: string;
    email: string;
    foto: string | null;
    name?: string; // Dari Accessor yang kita buat tadi
}

interface PageProps {
    auth: {
        user: InstansiUser;
    };
    [key: string]: any;
}

const menuItems = [
    { name: 'Dashboard', href: '/instansi/dashboardInstansi', icon: HiHome },
    { name: 'Profil Organisasi', href: '/instansi/profilInstansi', icon: HiUserCircle },
    { name: 'Daftar Tes Karakter', href: '/instansi/tesInstansi', icon: HiDocumentText },
    { name: 'Transaksi & Voucher', href: '/instansi/transaksiInstansi', icon: HiCreditCard },
    { name: 'Hasil Tes', href: '/instansi/hasilInstansi', icon: HiDocumentReport },
    { name: 'Bantuan', href: '/instansi/bantuanInstansi', icon: HiSupport },
    { name: 'Pengaturan', href: '/instansi/pengaturanInstansi', icon: HiCog },
];

export default function InstansiLayout({ children }: { children: ReactNode }) {
    // 1. AMBIL DATA LANGSUNG DARI INERTIA (Live Data)
    const { url, props } = usePage<PageProps>();
    const user = props.auth.user; 

    // Logic Nama & Foto (Fallback jika data kosong)
    const displayName = user?.name || user?.nama_instansi || 'Instansi User';
    const displayEmail = user?.email || '';
    
    // URL Foto: Jika ada path foto, tambahkan /storage/, jika tidak pakai Avatar API
    const displayFoto = user?.foto 
        ? `/storage/${user.foto}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FACC15&color=000&size=128`;

    // 2. Fungsi Logout (Menggunakan cara Inertia yang lebih bersih)
    const logout = () => {
        router.post('/logout'); // Ini otomatis menghapus session & token di backend
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-poppins">
            {/* === SIDEBAR (Tema Hitam) === */}
            <aside className="flex w-64 flex-shrink-0 flex-col bg-gray-900 text-white transition-all duration-300">
                <div className="flex h-20 items-center justify-center border-b border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/assets/logo/4.png" alt="Logo" className="h-8 w-8 rounded-full bg-white object-contain" />
                        <h1 className="cursor-pointer text-2xl font-bold tracking-wider text-white transition-colors hover:text-yellow-400">SAINTARA</h1>
                    </Link>
                </div>

                <nav className="flex-1 space-y-2 px-4 py-6">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-lg px-4 py-2.5 transition-all duration-300 ${
                                    isActive
                                        ? 'bg-yellow-400 font-bold text-gray-900 shadow-md'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon className={`mr-3 h-6 w-6 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-yellow-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex-shrink-0 border-t border-gray-700 px-4 py-4">
                    <button onClick={logout} className="flex w-full items-center rounded-lg px-4 py-2.5 text-gray-300 transition-all duration-300 hover:bg-red-600 hover:text-white">
                        <HiLogout className="mr-3 h-6 w-6" /> Logout
                    </button>
                </div>
            </aside>

            {/* === KONTEN UTAMA === */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shadow-sm">
                    {/* Menggunakan displayName yang reaktif */}
                    <h2 className="text-2xl font-bold text-gray-800">Selamat datang, {displayName}!</h2>

                    <div className="flex items-center space-x-3">
                        <Link href="/instansi/profilInstansi" className="flex cursor-pointer items-center rounded-full bg-yellow-400 px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg">
                            <div className="mr-2 h-9 w-9 overflow-hidden rounded-full bg-gray-200">
                                {/* Menggunakan displayFoto yang reaktif */}
                                <img src={displayFoto} alt="Avatar" className="h-full w-full object-cover" />
                            </div>

                            <div className="text-sm">
                                <p className="leading-none font-bold text-gray-900">{displayName}</p>
                                <p className="text-xs leading-none text-gray-700">{displayEmail}</p>
                            </div>
                        </Link>

                        <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-gray-900 shadow-md transition-colors hover:bg-yellow-500">
                            <HiBell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-red-600"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">{children}</main>
            </div>
        </div>
    );
}