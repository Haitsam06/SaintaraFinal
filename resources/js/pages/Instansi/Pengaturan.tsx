import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, Link } from '@inertiajs/react';
import {
    HiOutlineArrowSmRight,
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiOutlineUserCircle,
} from 'react-icons/hi';

export default function Pengaturan() {
    // Data Menu
    const settingsMenu = [
        // {
        //     title: 'Profil Organisasi',
        //     desc: 'Perbarui nama institusi, alamat, logo, dan kontak.',
        //     icon: HiOutlineUserCircle,
        //     color: 'blue',
        //     href: route('instansi.profil'), // Link ke halaman profil yang sudah ada
        // },
        {
            title: 'Keamanan',
            desc: 'Ubah kata sandi akun institusi dan atur otentikasi dua faktor (2FA).',
            icon: HiOutlineShieldCheck,
            color: 'green',
            href: '#', // Ganti dengan route keamanan
        },
        // {
        //     title: 'Billing & Pembayaran',
        //     desc: 'Kelola metode pembayaran, lihat riwayat tagihan, dan atur paket langganan.',
        //     icon: HiOutlineCreditCard,
        //     color: 'orange',
        //     href: route('instansi.transaksi'), // Link ke halaman transaksi
        // },
    ];

    // Helper warna
    const getColorClass = (color: string) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-100 text-blue-600';
            case 'green':
                return 'bg-green-100 text-green-600';
            case 'orange':
                return 'bg-orange-100 text-orange-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <InstansiLayout>
            <Head title="Pengaturan" />

            <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Pengaturan Akun
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {settingsMenu.map((item, index) => (
                    <div
                        key={index}
                        className="group rounded-[2rem] border border-transparent bg-white p-8 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
                    >
                        <div className="flex items-start gap-5">
                            <div
                                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${getColorClass(item.color)}`}
                            >
                                <item.icon className="h-7 w-7" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="min-h-[40px] text-sm leading-relaxed text-gray-500">
                                    {item.desc}
                                </p>
                                <Link
                                    href={item.href}
                                    className="mt-2 inline-flex items-center text-sm font-bold text-saintara-yellow transition-all group-hover:gap-2 hover:text-yellow-500"
                                >
                                    Kelola Pengaturan{' '}
                                    <HiOutlineArrowSmRight className="ml-1 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </InstansiLayout>
    );
}
