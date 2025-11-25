import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function KeuanganLayout({ children }: LayoutProps) {
    const { url } = usePage();

    const isActive = (path: string) => url.startsWith(path);

    return (
        <AdminDashboardLayout>
            <h2 className="mb-6 text-3xl font-bold text-blue-900">Manajemen Keuangan</h2>

            {/* --- TAB NAVIGASI --- */}
            <div className="mb-8 flex w-fit flex-wrap gap-4 rounded-[2rem] bg-white p-4 shadow-sm">
                <Link href="/admin/keuangan/pemasukan" className={`rounded-full border px-8 py-3 text-sm font-bold transition-all ${isActive('/admin/keuangan/pemasukan') ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-md' : 'border-yellow-400 bg-white text-gray-900 hover:bg-yellow-50'}`}>
                    Pemasukan
                </Link>

                <Link
                    href="/admin/keuangan/pengeluaran"
                    className={`rounded-full border px-8 py-3 text-sm font-bold transition-all ${isActive('/admin/keuangan/pengeluaran') ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-md' : 'border-yellow-400 bg-white text-gray-900 hover:bg-yellow-50'}`}
                >
                    Pengeluaran
                </Link>

                <Link href="/admin/keuangan/laporan" className={`rounded-full border px-8 py-3 text-sm font-bold transition-all ${isActive('/admin/keuangan/laporan') ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-md' : 'border-yellow-400 bg-white text-gray-900 hover:bg-yellow-50'}`}>
                    Laporan
                </Link>

                <Link href="/admin/keuangan/gaji" className={`rounded-full border px-8 py-3 text-sm font-bold transition-all ${isActive('/admin/keuangan/gaji') ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-md' : 'border-yellow-400 bg-white text-gray-900 hover:bg-yellow-50'}`}>
                    Gaji
                </Link>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="min-h-[600px] rounded-[2.5rem] bg-white p-8 shadow-sm">{children}</div>
        </AdminDashboardLayout>
    );
}
