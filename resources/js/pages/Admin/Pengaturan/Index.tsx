import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link } from '@inertiajs/react';
import { HiAdjustments, HiArrowRight, HiCollection, HiUserGroup } from 'react-icons/hi';

export default function PengaturanIndex() {
    const menus = [
        {
            title: 'Pengaturan Umum',
            desc: 'Kelola nama aplikasi, logo, informasi kontak, dan mode pemeliharaan.',
            icon: HiAdjustments,
            color: 'bg-blue-100 text-blue-600',
            link: '/admin/pengaturan/umum',
        },
        {
            title: 'Manajemen Tim & Akses',
            desc: 'Tambah atau hapus anggota tim dan atur peran serta hak akses mereka.',
            icon: HiUserGroup,
            color: 'bg-green-100 text-green-600',
            link: '/admin/pengaturan/tim',
        },
        {
            title: 'Jenis Tes & Paket',
            desc: 'Edit, tambah, atau hapus jenis tes dan paket yang ditawarkan kepada pengguna.',
            icon: HiCollection,
            color: 'bg-purple-100 text-purple-600',
            link: '/admin/pengaturan/paket',
        },
    ];

    return (
        <AdminDashboardLayout>
            <Head title="Pengaturan Sistem" />

            <div className="font-poppins">
                <h2 className="mb-8 text-3xl font-bold text-blue-900">Pengaturan Sistem</h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {menus.map((menu, index) => (
                        <div key={index} className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                            <div>
                                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${menu.color}`}>
                                    <menu.icon size={28} />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-900">{menu.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-500">{menu.desc}</p>
                            </div>

                            <div className="mt-8">
                                <Link href={menu.link} className="group flex items-center text-sm font-bold text-yellow-500 transition-colors hover:text-yellow-600">
                                    Kelola Pengaturan
                                    <HiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
