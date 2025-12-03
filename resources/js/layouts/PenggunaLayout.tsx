import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin'; // Pastikan path import ini benar (huruf kecil/besar)
import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function PenggunaLayout({ children }: LayoutProps) {
    const { url } = usePage();

    // Helper untuk mengecek active state
    const isActive = (path: string) => url.startsWith(path);

    return (
        <AdminDashboardLayout>
            <h1 className="mb-6 text-3xl font-bold text-blue-900">Pengguna</h1>

            {/* --- NAVIGASI TAB (Lingkaran Merah) --- */}
            <div className="mb-8 flex w-fit flex-wrap gap-4 rounded-[2rem] bg-white p-4 shadow-sm">
                <Link
                    href="/admin/pengguna/personal" // <-- GANTI JADI MANUAL URL
                    className={`rounded-full border px-6 py-2 text-sm font-bold transition-all ${isActive('/admin/pengguna/personal') ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-md' : 'border-yellow-400 bg-white text-gray-900 hover:bg-yellow-50'}`}
                >
                    Personal
                </Link>

                <Link
                    href="/admin/pengguna/instansi" // <-- GANTI JADI MANUAL URL
                    className={`rounded-full border px-6 py-2 text-sm font-bold transition-all ${isActive('/admin/pengguna/instansi') ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-md' : 'border-yellow-400 bg-white text-gray-900 hover:bg-yellow-50'}`}
                >
                    Instansi
                </Link>

                {/* <button className="rounded-full border border-yellow-400 bg-white px-6 py-2 text-sm font-bold text-gray-900 hover:bg-yellow-50">Hadiah/Gift</button> */}
            </div>

            {/* --- KONTEN HALAMAN (Lingkaran Biru) --- */}
            <div className="min-h-[600px] rounded-[2.5rem] bg-white p-8 shadow-sm">{children}</div>
        </AdminDashboardLayout>
    );
}
