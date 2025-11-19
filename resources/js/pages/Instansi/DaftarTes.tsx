import InstansiLayout from '@/layouts/dashboardLayoutInstansi'; // Import layout baru
import { Head } from '@inertiajs/react';
import {
    HiCreditCard,
    HiOutlineCheckCircle,
    HiOutlineGift,
    HiOutlineUser,
    HiOutlineUsers,
} from 'react-icons/hi';

export default function Tes() {
    // Data Dummy untuk Daftar Tes
    const testList = [
        {
            title: 'Tes Karakter Personal',
            desc: 'Analisis mendalam 9 tipe karakter untuk individu.',
            cost: '1 Token',
            icon: HiOutlineUser,
            color: 'text-blue-600 bg-blue-100',
        },
        {
            title: 'Tes Karakter Tim',
            desc: 'Melihat dinamika tim dan peta karakter dalam 1 grup.',
            cost: '5 Token',
            icon: HiOutlineUsers,
            color: 'text-green-600 bg-green-100',
        },
        {
            title: 'Tes Gift (Hadiah)',
            desc: 'Membuat voucher tes yang bisa dibagikan sebagai hadiah.',
            cost: '1 Token',
            icon: HiOutlineGift,
            color: 'text-orange-600 bg-orange-100',
        },
    ];

    return (
        <InstansiLayout>
            <Head title="Daftar Tes Karakter" />

            <div className="space-y-8 font-poppins">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Daftar Tes Karakter
                    </h2>
                    <button className="flex items-center gap-2 rounded-full bg-saintara-yellow px-6 py-3 font-bold text-gray-900 shadow-md transition-colors hover:bg-yellow-500">
                        <HiCreditCard className="h-5 w-5" />
                        Beli Token Tambahan
                    </button>
                </div>

                {/* === RINGKASAN TOKEN === */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex items-center gap-5 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-saintara-yellow">
                            <HiCreditCard className="h-8 w-8 text-gray-900" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                Token Tersisa
                            </p>
                            <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
                                150 Token
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-800">
                            <HiOutlineCheckCircle className="h-8 w-8 text-saintara-yellow" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                Tes Selesai (Bulan Ini)
                            </p>
                            <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
                                42 Tes
                            </h3>
                        </div>
                    </div>
                </div>

                {/* === DAFTAR PAKET TES === */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                        Pilih Paket Tes
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {testList.map((test, index) => (
                            <div
                                key={index}
                                className="flex transform flex-col justify-between rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-saintara-yellow hover:shadow-xl"
                            >
                                {/* Bagian Atas: Info */}
                                <div>
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-full ${test.color}`}
                                    >
                                        <test.icon className="h-7 w-7" />
                                    </div>
                                    <h4 className="mt-5 text-lg font-bold text-gray-900">
                                        {test.title}
                                    </h4>
                                    <p className="mt-2 min-h-[40px] text-sm text-gray-500">
                                        {test.desc}
                                    </p>
                                </div>

                                {/* Bagian Bawah: Harga & Tombol */}
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-gray-600">
                                        Biaya:
                                    </p>
                                    <p className="mb-4 text-2xl font-bold text-gray-900">
                                        {test.cost}
                                    </p>
                                    <button className="w-full rounded-full bg-saintara-black px-4 py-3 font-bold text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-saintara-yellow focus:ring-offset-2 focus:outline-none">
                                        Gunakan Paket
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </InstansiLayout>
    );
}
