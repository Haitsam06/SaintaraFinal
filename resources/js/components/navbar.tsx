import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { HiMenu, HiUser, HiX } from 'react-icons/hi';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // State untuk menyimpan data user
    const [user, setUser] = useState<any>(null);

    // Cek Login status saat website dimuat
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('user_data');

        if (token && userDataStr) {
            try {
                setUser(JSON.parse(userDataStr));
            } catch (error) {
                console.error('Gagal memproses data user', error);
            }
        }
    }, []);

    return (
        <nav className="fixed top-4 z-50 w-full px-4 transition-all duration-300 md:top-10">
            <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between rounded-full border border-gray-100 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                {/* LOGO */}
                <Link href="/" className="flex items-center space-x-3">
                    <img
                        src="/assets/logo/4.png" // Pastikan path ini benar
                        alt="Logo Saintara"
                        className="h-8 w-8 object-contain"
                    />
                    <span className="self-center font-poppins text-xl font-extrabold tracking-wide whitespace-nowrap text-gray-900 uppercase md:text-2xl">SAINTARA</span>
                </Link>

                {/* BAGIAN KANAN (AKSI) */}
                <div className="flex items-center space-x-1 md:order-2">
                    {/* --- LOGIKA TAMPILAN LOGIN / BELUM --- */}
                    {user ? (
                        // --- LOGIKA MENENTUKAN LINK & NAMA ---
                        (() => {
                            // 1. Tentukan Link Tujuan berdasarkan Role ID
                            let dashboardLink = '/';
                            if (user.role_id === 1 || user.role_id === 2) {
                                dashboardLink = '/admin/dashboardAdmin';
                            } else if (user.role_id === 3) {
                                dashboardLink = '/personal/dashboardPersonal'; // Ganti dengan route dashboard customer Anda
                            } else if (user.role_id === 4) {
                                dashboardLink = '/instansi/dashboardInstansi'; // Ganti dengan route dashboard instansi Anda
                            }

                            // 2. Tentukan Nama Tampilan (Cek semua kemungkinan kolom nama)
                            const displayName = user.nama_admin || user.nama_customer || user.nama_lengkap || user.nama_instansi || user.name || 'User';

                            return (
                                // === JIKA SUDAH LOGIN: TAMPILKAN ICON PROFILE ===
                                <Link href={dashboardLink} className="group flex items-center gap-3 rounded-full bg-gray-50 py-1 pr-4 pl-2 transition-all hover:bg-yellow-50 hover:shadow-md" title="Ke Dashboard">
                                    {/* Foto Profile / Icon Default */}
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-400 bg-yellow-400 shadow-sm">
                                        {user.foto ? <img src={user.foto} alt="User" className="h-full w-full object-cover" /> : <HiUser className="h-6 w-6 text-white" />}
                                    </div>

                                    {/* Nama User (Hidden di HP biar rapi, muncul di Desktop) */}
                                    <div className="hidden flex-col text-left md:flex">
                                        <span className="text-xs font-bold text-gray-900 group-hover:text-yellow-600">Halo, {displayName}</span>
                                        <span className="text-[10px] text-gray-500">Dashboard</span>
                                    </div>
                                </Link>
                            );
                        })()
                    ) : (
                        // === JIKA BELUM LOGIN: TAMPILKAN TOMBOL MASUK & DAFTAR ===
                        <div className="hidden items-center gap-2 md:flex">
                            <Link href="/login" className="rounded-full border-2 border-gray-900 px-5 py-2 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100 focus:ring-4 focus:ring-gray-200">
                                MASUK
                            </Link>
                            <Link href="/register" className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-xl focus:ring-4 focus:ring-gray-300">
                                DAFTAR
                            </Link>
                        </div>
                    )}

                    {/* TOMBOL MENU MOBILE (HAMBURGER) */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden">
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                    </button>
                </div>

                {/* LINK NAVIGASI TENGAH */}
                <div className={`${isMenuOpen ? 'mt-4 block rounded-2xl border border-gray-100 bg-white p-4 shadow-lg' : 'hidden'} w-full md:order-1 md:mt-0 md:flex md:w-auto md:border-0 md:bg-transparent md:shadow-none`}>
                    <ul className="flex flex-col font-medium md:flex-row md:space-x-8">
                        {['Tentang', 'Produk', 'Pelatihan & Acara', 'Rahasia Karakter Alami'].map((item, idx) => {
                            const href = item === 'Pelatihan & Acara' ? '/calendar' : `/#${item.toLowerCase().replace(/ /g, '-')}`;
                            return (
                                <li key={idx}>
                                    <Link href={href} className="block rounded px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-yellow-500">
                                        {item}
                                    </Link>
                                </li>
                            );
                        })}

                        {/* MENU LOGIN MOBILE (Hanya muncul di HP jika belum login) */}
                        {!user && (
                            <li className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 md:hidden">
                                <Link href="/login" className="text-center font-bold text-gray-900">
                                    Masuk
                                </Link>
                                <Link href="/register" className="text-center font-bold text-yellow-500">
                                    Daftar
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
