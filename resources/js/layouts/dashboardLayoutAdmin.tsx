import { Link, router, usePage } from '@inertiajs/react'; // Tambah router
import React from 'react';
import { HiCalendar, HiCog, HiCurrencyDollar, HiHome, HiLogout, HiQuestionMarkCircle, HiUserGroup, HiUsers } from 'react-icons/hi';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 1. AMBIL DATA USER LANGSUNG DARI SERVER (INERTIA)
    // Tidak perlu lagi pakai useEffect / localStorage
    const { url, props } = usePage();
    const { auth } = props as any; // Ambil properti auth
    const user = auth?.user || {}; // Ambil user, atau object kosong jika null

    // 2. LOGIKA LOGOUT YANG BENAR (POST ke Server)
    const logout = () => {
        router.post('/logout'); // Ini akan menghapus session di server & redirect ke login
    };

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboardAdmin', icon: HiHome },
        { name: 'Profile', href: '/admin/profileAdmin', icon: HiUserGroup },
        { name: 'Agenda', href: '/admin/agendaAdmin', icon: HiCalendar },
        { name: 'Pengguna', href: '/admin/penggunaAdmin', icon: HiUsers },
        { name: 'Keuangan', href: '/admin/keuanganAdmin', icon: HiCurrencyDollar },
        { name: 'Tim', href: '/admin/teamAdmin', icon: HiUserGroup },
        { name: 'Bantuan & Layanan', href: '/admin/supportAdmin', icon: HiQuestionMarkCircle },
        { name: 'Pengaturan', href: '/admin/settingsAdmin', icon: HiCog },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-poppins">
            {/* === SIDEBAR === */}
            <aside className="flex w-64 flex-shrink-0 flex-col bg-gray-900 text-white transition-all duration-300">
                {/* Logo */}
                <div className="flex h-20 items-center justify-center border-b border-gray-700">
                    <Link href="/">
                        <h1 className="cursor-pointer text-2xl font-bold tracking-wider text-white transition-colors hover:text-yellow-400">SAINTARA</h1>
                    </Link>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 space-y-2 px-4 py-6">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link key={item.name} href={item.href} className={`group flex items-center rounded-lg px-4 py-2.5 transition-all duration-300 ${isActive ? 'bg-yellow-400 font-bold text-gray-900 shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} `}>
                                <item.icon className={`mr-3 h-6 w-6 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-yellow-400'} `} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="border-t border-gray-700 px-4 py-4">
                    <button onClick={logout} className="flex w-full items-center rounded-lg px-4 py-2.5 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
                        <HiLogout className="mr-3 h-6 w-6 text-gray-400 group-hover:text-red-400" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* === MAIN CONTENT WRAPPER === */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* === HEADER === */}
                <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shadow-sm">
                    {/* TAMPILKAN NAMA DARI PROPS INERTIA */}
                    {/* Admin.php sudah punya atribut 'name', jadi ini aman */}
                    <h2 className="text-2xl font-bold text-gray-800">Selamat datang, {user.name || user.nama_admin || 'Admin'}!</h2>

                    <div className="flex items-center space-x-2">
                        <Link href="/admin/profileAdmin" className="flex cursor-pointer items-center rounded-full bg-yellow-400 px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg">
                            <div className="mr-2 h-9 w-9 overflow-hidden rounded-full bg-white">
                                {/* Tampilkan foto jika ada */}
                                {user.foto ? <img src={user.foto} alt="Avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center font-bold text-gray-800">{user.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}</div>}
                            </div>

                            <div className="text-sm">
                                <p className="leading-none font-bold text-gray-900">{user.name || 'Admin'}</p>
                                <p className="text-xs leading-none text-gray-700">{user.email || ''}</p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* === KONTEN HALAMAN === */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">{children}</main>
            </div>
        </div>
    );
}
