import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
// Import Icons
import {
    HiBell,
    HiCog,
    HiCreditCard,
    HiDocumentReport,
    HiDocumentText,
    HiHome,
    HiLogout, // Icon Logout
    HiSupport,
    HiUserCircle,
} from 'react-icons/hi';

// Daftar Menu
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
    const { url } = usePage();

    // 1. State Data User (Instansi)
    const [user, setUser] = useState({
        name: 'Loading...',
        email: '',
        foto: '',
    });

    // 2. Ambil data dari LocalStorage
    useEffect(() => {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
            try {
                const parsedUser = JSON.parse(userDataStr);
                // Prioritaskan nama_instansi
                setUser({
                    name: parsedUser.nama_instansi || parsedUser.name || 'Instansi User',
                    email: parsedUser.email || '',
                    foto: parsedUser.foto || '',
                });
            } catch (error) {
                console.error('Gagal memuat data user', error);
            }
        }
    }, []);

    // 3. Fungsi Logout
    const logout = async () => {
        try {
            const token = localStorage.getItem('token');

            // Request ke backend untuk invalidasi token
            if (token) {
                await axios.post(
                    'http://127.0.0.1:8000/api/logout',
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
            }
        } catch (error) {
            console.error('Gagal logout server', error);
        } finally {
            // Hapus sesi lokal & Redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-poppins">
            {/* === SIDEBAR (Tema Hitam) === */}
            <aside className="flex w-64 flex-shrink-0 flex-col bg-gray-900 text-white transition-all duration-300">
                {/* Logo */}
                <div className="flex h-20 items-center justify-center border-b border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        {/* Logo Placeholder */}
                        <img src="/assets/logo/4.png" alt="Logo" className="h-8 w-8 rounded-full bg-white object-contain" />
                        <h1 className="cursor-pointer text-2xl font-bold tracking-wider text-white transition-colors hover:text-yellow-400">SAINTARA</h1>
                    </Link>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex-1 space-y-2 px-4 py-6">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-lg px-4 py-2.5 transition-all duration-300 ${
                                    isActive
                                        ? 'bg-yellow-400 font-bold text-gray-900 shadow-md' // Style Aktif
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Style Normal
                                }`}
                            >
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
                    <h2 className="text-2xl font-bold text-gray-800">Selamat datang, {user.name}!</h2>

                    <div className="flex items-center space-x-3">
                        {/* Profil Link */}
                        <Link href="/instansi/profilInstansi" className="flex cursor-pointer items-center rounded-full bg-yellow-400 px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg">
                            <div className="mr-2 h-9 w-9 overflow-hidden rounded-full bg-gray-200">
                                {user.foto ? <img src={user.foto} alt="Avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center font-bold text-gray-600">{user.name.charAt(0)}</div>}
                            </div>

                            <div className="text-sm">
                                <p className="leading-none font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs leading-none text-gray-700">{user.email}</p>
                            </div>
                        </Link>

                        {/* Notifikasi */}
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
