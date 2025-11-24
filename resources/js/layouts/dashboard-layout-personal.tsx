<<<<<<< HEAD
import { Link, router, usePage } from '@inertiajs/react'; // Tambah router & usePage
import { ReactNode } from 'react';
import { HiBell, HiCog, HiCreditCard, HiDocumentReport, HiDocumentText, HiGift, HiHome, HiLogout, HiSupport, HiUserCircle } from 'react-icons/hi';
=======
import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { 
    HiBell, HiCog, HiCreditCard, HiDocumentReport, 
    HiDocumentText, HiGift, HiHome, HiLogout, 
    HiSupport, HiUserCircle, HiMenuAlt2 
} from 'react-icons/hi';
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c

// Daftar Menu
const menuItems = [
    { name: 'Beranda', href: '/personal/dashboardPersonal', icon: HiHome },
    { name: 'Profil Saya', href: '/personal/profilePersonal', icon: HiUserCircle },
    { name: 'Daftar Tes', href: '/personal/daftarTesPersonal', icon: HiDocumentText },
    { name: 'Dompet & Token', href: '/personal/transaksiTokenPersonal', icon: HiCreditCard },
    // { name: 'Hasil Tes', href: '/personal/hasilTesPersonal', icon: HiDocumentReport },
    { name: 'Hadiah & Donasi', href: '/personal/hadiahDonasiPersonal', icon: HiGift },
    { name: 'Pusat Bantuan', href: '/personal/bantuanPersonal', icon: HiSupport },
    { name: 'Pengaturan', href: '/personal/settingPersonal', icon: HiCog },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
<<<<<<< HEAD
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
=======
    // 1. AMBIL DATA USER
    const { url, props } = usePage();
    const { auth } = props as any;
    const user = auth?.user || {};
    
    // State untuk Mobile Sidebar (Opsional jika nanti butuh responsif)
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const logout = () => {
        router.post('/logout');
    };

    const displayName = user.name || user.nama_lengkap || 'User Saintara';

    return (
        <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
            
            {/* === SIDEBAR (Modern Dark Theme) === */}
            <aside className={`flex-shrink-0 z-30 bg-[#0F0F0F] text-white transition-all duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'w-72' : 'w-20'} 
            `}>
                {/* Logo Area */}
                <div className="h-24 flex items-center justify-center border-b border-gray-800 px-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                            <img src="/assets/logo/4.png" alt="Logo" className="relative h-10 w-10 rounded-full bg-white object-contain border-2 border-yellow-400" />
                        </div>
                        
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <h1 className="text-xl font-extrabold tracking-wider text-white">SAINTARA</h1>
                                <span className="text-[10px] text-gray-400 tracking-widest uppercase">Personal Area</span>
                            </div>
                        )}
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
                    </Link>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
<<<<<<< HEAD
                            <Link key={item.name} href={item.href} className={`group flex items-center rounded-lg px-4 py-2.5 transition-all duration-300 ${isActive ? 'bg-yellow-400 font-bold text-gray-900 shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                <item.icon className={`mr-3 h-6 w-6 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-yellow-400'}`} />
                                {item.name}
=======
                            <Link 
                                key={item.name} 
                                href={item.href} 
                                className={`relative flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group
                                    ${isActive 
                                        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 font-bold transform scale-[1.02]' 
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                            >
                                <item.icon className={`h-6 w-6 flex-shrink-0 transition-colors
                                    ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'}
                                `} />
                                
                                {isSidebarOpen && (
                                    <span className="ml-3 text-sm font-medium tracking-wide">{item.name}</span>
                                )}

                                {/* Indikator Aktif (Dot kecil di kanan) */}
                                {isActive && isSidebarOpen && (
                                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black opacity-50"></span>
                                )}
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (User Mini Profile & Logout) */}
                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={logout} 
                        className={`flex w-full items-center rounded-xl px-4 py-3 transition-all duration-200 group
                            ${isSidebarOpen ? 'bg-gray-800 hover:bg-red-600/90 text-gray-300 hover:text-white' : 'justify-center hover:bg-red-600/20'}
                        `}
                    >
                        <HiLogout className={`h-6 w-6 ${isSidebarOpen ? 'mr-3 text-gray-400 group-hover:text-white' : 'text-red-500'}`} />
                        {isSidebarOpen && <span className="font-medium">Keluar</span>}
                    </button>
                </div>
            </aside>

<<<<<<< HEAD
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
=======
            {/* === MAIN CONTENT WRAPPER === */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* === HEADER (Floating & Glassmorphism) === */}
                <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
                    
                    {/* Left: Toggle & Greetings */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <h2 className="text-lg font-bold text-gray-800">
                                Halo, <span className="text-yellow-600">{displayName.split(' ')[0]}</span> 👋
                            </h2>
                            <p className="text-xs text-gray-400">Selamat datang kembali di dashboard Anda.</p>
                        </div>
                    </div>

                    {/* Right: Notifications & Profile */}
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <button className="relative p-2.5 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-yellow-600 hover:border-yellow-200 transition-all shadow-sm hover:shadow-md">
                            <HiBell className="h-5 w-5" />
                            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
                        </button>

                        {/* Profile Dropdown Trigger */}
                        <Link href="/personal/profilePersonal" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-gray-100 hover:border-yellow-300 transition-all shadow-sm hover:shadow-md group">
                            <div className="h-9 w-9 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center overflow-hidden">
                                {user.foto ? (
                                    <img src={user.foto} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="font-bold text-yellow-700 text-sm">{displayName.charAt(0)}</span>
                                )}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-gray-700 group-hover:text-yellow-700 transition-colors truncate max-w-[120px]">
                                    {displayName}
                                </p>
                                <p className="text-[10px] text-gray-400 tracking-wider font-medium">{user.email}</p>
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
                            </div>
                        </Link>
                    </div>
                </header>

                {/* === CONTENT AREA === */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F9FAFB] p-6 md:p-8 relative">
                    {/* Background decoration (optional) */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}