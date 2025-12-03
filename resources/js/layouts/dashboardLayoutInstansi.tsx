import { Link, usePage, router } from '@inertiajs/react';
import { ReactNode } from 'react';
import {
    HiBell,
    HiCog,
    HiCreditCard,
    HiDocumentText,
    HiHome,
    HiLogout,
    HiSupport,
    HiUserCircle,
    HiMenuAlt2 // Ikon opsi tambahan jika nanti butuh toggle sidebar
} from 'react-icons/hi';

// --- Interface Data User ---
interface InstansiUser {
    id_instansi: string;
    nama_instansi: string;
    email: string;
    foto: string | null;
    name?: string;
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
    { name: 'Bantuan', href: '/instansi/bantuanInstansi', icon: HiSupport },
    { name: 'Pengaturan', href: '/instansi/settingInstansi', icon: HiCog },
];

export default function InstansiLayout({ children }: { children: ReactNode }) {
    const { url, props } = usePage<PageProps>();
    const user = props.auth.user;

    const displayName = user?.name || user?.nama_instansi || 'Instansi User';
    const displayEmail = user?.email || '';
    
    const displayFoto = user?.foto 
        ? `/storage/${user.foto}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FACC15&color=1e293b&size=128&bold=true`;

    const logout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-poppins text-slate-800">
            {/* === SIDEBAR === */}
            {/* Menggunakan bg-slate-900 agar lebih 'rich' daripada hitam pekat */}
            <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-white shadow-2xl transition-all duration-300 lg:static">
                
                {/* Logo Section */}
                <div className="flex h-24 items-center justify-center border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20">
                             <img src="/assets/logo/4.png" alt="Logo" className="h-6 w-6 object-contain brightness-0 invert filter" /> 
                             {/* Catatan: Jika logo asli berwarna, hapus class brightness/invert */}
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-widest text-white">SAINTARA</h1>
                            <span className="text-[10px] tracking-wide text-slate-400 uppercase">Dashboard Instansi</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-8 custom-scrollbar">
                    {/* Label Section (Opsional) */}
                    <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu Utama</p>

                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group relative flex items-center overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/25'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon 
                                    className={`mr-3 h-5 w-5 transition-colors ${
                                        isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-yellow-400'
                                    }`} 
                                />
                                <span className={`font-medium ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
                                
                                {/* Indikator aktif di kanan (opsional aesthetic) */}
                                {isActive && (
                                    <div className="absolute right-3 h-2 w-2 rounded-full bg-slate-900/20" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (Logout) */}
                <div className="border-t border-slate-800 px-4 py-6">
                    <button 
                        onClick={logout} 
                        className="group flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-300 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 active:scale-95"
                    >
                        <HiLogout className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" /> 
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* === KONTEN UTAMA === */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                
                {/* === HEADER (Sticky & Glassmorphism) === */}
                <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-gray-200/60 bg-white/80 px-8 backdrop-blur-md transition-all">
                    
                    {/* Welcome Text */}
                    <div className="hidden md:block">
                        <h2 className="text-xl font-bold text-slate-800">
                            Halo, <span className="text-yellow-600">{displayName.split(' ')[0]}</span> 👋
                        </h2>
                        <p className="text-xs text-slate-500">Selamat datang kembali di panel instansi.</p>
                    </div>

                    {/* Mobile Menu Trigger (Visible only on small screens) */}
                    <button className="mr-4 text-slate-500 lg:hidden">
                         <HiMenuAlt2 className="h-6 w-6"/>
                    </button>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-6">
                        
                        {/* Notification Bell (Lebih subtle) */}
                        <button type="button" className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-gray-100 hover:text-yellow-600">
                            <HiBell className="h-6 w-6" />
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 shadow-sm"></span>
                        </button>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gray-200"></div>

                        {/* Profile Dropdown Area */}
                        <Link href="/instansi/profilInstansi" className="group flex items-center gap-3 rounded-full pl-2 pr-4 transition-all hover:bg-gray-50">
                            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-transparent transition-all group-hover:ring-yellow-400">
                                <img src={displayFoto} alt="Avatar" className="h-full w-full object-cover" />
                            </div>
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-bold text-slate-700 transition-colors group-hover:text-yellow-600">{displayName}</p>
                                <p className="text-[10px] text-slate-400">{displayEmail}</p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* === MAIN CONTENT === */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 lg:p-10">
                    <div className="mx-auto max-w-7xl animate-fade-in-up">
                         {children}
                    </div>
                </main>
            </div>
        </div>
    );
}