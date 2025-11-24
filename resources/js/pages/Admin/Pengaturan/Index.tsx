import AdminLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link } from '@inertiajs/react';
import { HiAdjustments, HiArrowRight, HiCollection, HiUserGroup } from 'react-icons/hi';

export default function PengaturanIndex() {
    const menus = [
        {
            title: 'Pengaturan Umum',
            desc: 'Kelola nama aplikasi, logo, informasi kontak, dan mode pemeliharaan.',
            icon: HiAdjustments,
            color: 'bg-blue-50 text-blue-600',
            link: '/admin/pengaturan/umum',
        },
        {
            title: 'Manajemen Tim & Akses',
            desc: 'Tambah atau hapus anggota tim dan atur peran serta hak akses mereka.',
            icon: HiUserGroup,
            color: 'bg-green-50 text-green-600',
            link: '/admin/pengaturan/tim',
        },
        {
            title: 'Jenis Tes & Paket',
            desc: 'Edit, tambah, atau hapus jenis tes dan paket yang ditawarkan kepada pengguna.',
            icon: HiCollection,
            color: 'bg-purple-50 text-purple-600',
            link: '/admin/pengaturan/paket',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Pengaturan Sistem" />

            <div className="space-y-6 font-sans">
                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
                    <p className="text-sm text-gray-500">Pusat kontrol konfigurasi aplikasi Saintara.</p>
                </div>

                {/* MENU GRID */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {menus.map((menu, index) => (
                        <Link key={index} href={menu.link} className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div>
                                {/* Icon Wrapper */}
                                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${menu.color} transition-transform group-hover:scale-110`}>
                                    <menu.icon className="h-7 w-7" />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-yellow-600">{menu.title}</h3>

                                <p className="text-sm leading-relaxed text-gray-500">{menu.desc}</p>
                            </div>

                            <div className="mt-8 flex items-center text-sm font-bold text-gray-400 transition-colors group-hover:text-yellow-500">
                                <span>Buka Pengaturan</span>
                                <HiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
