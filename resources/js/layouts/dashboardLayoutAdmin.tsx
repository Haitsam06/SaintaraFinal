import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'; // Tambah useEffect & useState
import { HiBell, HiCalendar, HiCog, HiCurrencyDollar, HiHome, HiLogout, HiQuestionMarkCircle, HiUserGroup, HiUsers } from 'react-icons/hi';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    // 1. STATE UNTUK MENYIMPAN DATA USER
    const [user, setUser] = useState({
        name: 'Loading...',
        email: '',
        foto: '', // Asumsi ada field foto, jika tidak pakai placeholder
    });

    // 2. AMBIL DATA USER DARI LOCALSTORAGE SAAT WEBSITE DIMUAT
    useEffect(() => {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
            try {
                const parsedUser = JSON.parse(userDataStr);
                // Mapping data sesuai struktur database/model Admin Anda
                setUser({
                    name: parsedUser.nama_admin || parsedUser.name || 'Admin',
                    email: parsedUser.email || '',
                    foto: parsedUser.foto || '',
                });
            } catch (e) {
                console.error('Gagal parsing user data');
            }
        }
    }, []);

    // 3. LOGIKA LOGOUT YANG BENAR (HAPUS TOKEN)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        // Redirect manual agar halaman refresh penuh dan kembali ke login
        window.location.href = '/login';
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
            <aside className="flex w-64 flex-shrink-0 flex-col bg-gray-900 bg-saintara-black text-white transition-all duration-300">
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
                    {/* 4. TAMPILKAN NAMA DINAMIS */}
                    <h2 className="text-2xl font-bold text-gray-800">Selamat datang, {user.name}!</h2>

                    <div className="flex items-center space-x-2">
                        <a href="/admin/profileAdmin" className="flex cursor-pointer items-center rounded-full bg-yellow-400 px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg">
                            <div className="mr-2 h-9 w-9 overflow-hidden rounded-full bg-white">
                                {/* Tampilkan foto jika ada, jika tidak pakai placeholder inisial */}
                                {user.foto ? <img src={user.foto} alt="Avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center font-bold text-gray-800">{user.name.substring(0, 2).toUpperCase()}</div>}
                            </div>

                            <div className="text-sm">
                                <p className="leading-none font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs leading-none text-gray-700">{user.email}</p>
                            </div>
                        </a>
                    </div>
                </header>

                {/* === KONTEN HALAMAN === */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">{children}</main>
            </div>
        </div>
    );
}
