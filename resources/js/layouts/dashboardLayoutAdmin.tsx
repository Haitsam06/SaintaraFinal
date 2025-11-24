import { Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { HiBell, HiCalendar, HiCog, HiCurrencyDollar, HiHome, HiLogout, HiQuestionMarkCircle, HiUserGroup, HiUsers } from 'react-icons/hi';

// Interface untuk User
interface User {
    name?: string;
    nama_admin?: string;
    email?: string;
    foto?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 1. AMBIL DATA USER
    const { url, props } = usePage();
    const { auth } = props as any;
    const user: User = auth?.user || {};

    // State Sidebar (Default Expanded)
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const logout = () => {
        router.post('/logout');
    };

    // Tampilkan Nama Admin (Fallback ke 'Admin' jika null)
    const displayName = user.name || user.nama_admin || 'Admin';

    // Menu Items Admin
    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboardAdmin', icon: HiHome },
        { name: 'Profile', href: '/admin/profileAdmin', icon: HiUserGroup },
        { name: 'Agenda', href: '/admin/agendaAdmin', icon: HiCalendar },
        { name: 'Pengguna', href: '/admin/pengguna/personal', icon: HiUsers },
        { name: 'Token', href: '/admin/token', icon: HiBell }, // Ikon Token bisa disesuaikan
        { name: 'Keuangan', href: '/admin/keuangan/pemasukan', icon: HiCurrencyDollar },
        { name: 'Bantuan & Layanan', href: '/admin/supportAdmin', icon: HiQuestionMarkCircle },
        { name: 'Pengaturan', href: '/admin/pengaturan', icon: HiCog },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#F3F4F6] font-poppins">
            {/* === SIDEBAR (Modern Dark Theme - Konsisten dengan Personal) === */}
            <aside className={`z-30 flex flex-shrink-0 flex-col bg-[#0F0F0F] text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'} `}>
                {/* Logo Area */}
                <div className="flex h-24 items-center justify-center border-b border-gray-800 px-6">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-25 blur transition duration-200 group-hover:opacity-75"></div>
                            {/* Ganti path logo sesuai aset Anda */}
                            <img src="/assets/logo/4.png" alt="Logo" className="relative h-10 w-10 rounded-full border-2 border-yellow-400 bg-white object-contain" />
                        </div>

                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <h1 className="text-xl font-extrabold tracking-wider text-white">SAINTARA</h1>
                                <span className="text-[10px] tracking-widest text-gray-400 uppercase">Admin Area</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Menu Navigasi */}
                <nav className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
                    {menuItems.map((item) => {
                        // Logic Active State khusus untuk menu bertingkat (Pengguna, Keuangan, Pengaturan)
                        let isActive = false;
                        if (item.name === 'Pengguna') {
                            isActive = url.startsWith('/admin/pengguna');
                        } else if (item.name === 'Keuangan') {
                            isActive = url.startsWith('/admin/keuangan');
                        } else if (item.name === 'Pengaturan') {
                            isActive = url.startsWith('/admin/pengaturan');
                        } else {
                            isActive = url.startsWith(item.href);
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group relative flex items-center rounded-xl px-4 py-3.5 transition-all duration-200 ${isActive ? 'scale-[1.02] transform bg-yellow-400 font-bold text-black shadow-lg shadow-yellow-400/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'} `}
                            >
                                <item.icon className={`h-6 w-6 flex-shrink-0 transition-colors ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} `} />

                                {isSidebarOpen && <span className="ml-3 text-sm font-medium tracking-wide">{item.name}</span>}

                                {/* Indikator Aktif (Dot kecil di kanan) */}
                                {isActive && isSidebarOpen && <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-black opacity-50"></span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (Logout) */}
                <div className="border-t border-gray-800 p-4">
                    <button onClick={logout} className={`group flex w-full items-center rounded-xl px-4 py-3 transition-all duration-200 ${isSidebarOpen ? 'bg-gray-800 text-gray-300 hover:bg-red-600/90 hover:text-white' : 'justify-center hover:bg-red-600/20'} `}>
                        <HiLogout className={`h-6 w-6 ${isSidebarOpen ? 'mr-3 text-gray-400 group-hover:text-white' : 'text-red-500'}`} />
                        {isSidebarOpen && <span className="font-medium">Keluar</span>}
                    </button>
                </div>
            </aside>

            {/* === MAIN CONTENT WRAPPER === */}
            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* === HEADER (Floating & Glassmorphism) === */}
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md">
                    {/* Left: Greetings */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <h2 className="text-lg font-bold text-gray-800">
                                Halo, <span className="text-yellow-600">{displayName.split(' ')[0]}</span> 👋
                            </h2>
                            <p className="text-xs text-gray-400">Selamat bekerja, Admin.</p>
                        </div>
                    </div>

                    {/* Right: Profile */}
                    <div className="flex items-center gap-4">
                        <Link href="/admin/profileAdmin" className="group flex items-center gap-3 rounded-full border border-gray-100 bg-white py-1.5 pr-4 pl-2 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md">
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-yellow-200 bg-yellow-100">
                                {user.foto ? <img src={`/storage/${user.foto}`} alt="Avatar" className="h-full w-full object-cover" /> : <span className="text-sm font-bold text-yellow-700">{displayName.charAt(0).toUpperCase()}</span>}
                            </div>
                            <div className="hidden text-left md:block">
                                <p className="max-w-[120px] truncate text-sm font-bold text-gray-700 transition-colors group-hover:text-yellow-700">{displayName}</p>
                                <p className="text-[10px] font-medium tracking-wider text-gray-400">{user.email}</p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* === CONTENT AREA === */}
                <main className="relative flex-1 overflow-x-hidden overflow-y-auto bg-[#F9FAFB] p-6 md:p-8">
                    {/* Background Decoration */}
                    <div className="pointer-events-none absolute top-0 left-0 h-64 w-full bg-gradient-to-b from-white to-transparent"></div>

                    <div className="relative z-10 mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
