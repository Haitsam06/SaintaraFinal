import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, Link } from '@inertiajs/react';
import { HiOutlineEye, HiSearch } from 'react-icons/hi';

export default function HasilTes() {
    // Data Dummy
    const results = [
        {
            id: 1,
            nama: 'Andi Saputra',
            email: 'andi.s@gmail.com',
            devisi: 'Marketing',
            tgl: '12 Okt 2025',
            karakter: 'Pemikir Extrovert',
        },
        {
            id: 2,
            nama: 'Rara Aisya',
            email: 'rara.a@gmail.com',
            devisi: 'Finance',
            tgl: '10 Okt 2025',
            karakter: 'Perasa Introvert',
        },
        {
            id: 3,
            nama: 'Budi Hartono',
            email: 'budi.h@gmail.com',
            devisi: 'SDM',
            tgl: '10 Okt 2025',
            karakter: 'Pengamat Extrovert',
        },
        {
            id: 4,
            nama: 'Citra Lestari',
            email: 'citra.l@gmail.com',
            devisi: 'Manager',
            tgl: '9 Okt 2025',
            karakter: 'Pemimpi Introvert',
        },
    ];

    return (
        <InstansiLayout>
            <Head title="Hasil Tes Peserta" />

            <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Hasil Tes Peserta
            </h2>

            <div className="min-h-[400px] rounded-[2.5rem] bg-white p-8 shadow-sm">
                {/* === Filter dan Search === */}
                <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            className="w-full rounded-full border-none bg-gray-100 py-3 pr-12 pl-6 text-gray-600 focus:ring-2 focus:ring-saintara-yellow"
                        />
                        <HiSearch className="absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 transform text-gray-400" />
                    </div>
                    <div className="flex gap-4">
                        <select className="rounded-lg border-none bg-gray-100 font-medium text-gray-600 focus:ring-2 focus:ring-saintara-yellow">
                            <option value="">Semua Devisi</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="SDM">SDM</option>
                        </select>
                        <button className="rounded-lg bg-saintara-black px-6 py-3 font-bold text-white transition-colors hover:bg-gray-800">
                            Download Laporan
                        </button>
                    </div>
                </div>

                {/* === Tabel Hasil Tes === */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 text-sm font-medium text-gray-500 uppercase">
                            <tr>
                                <th className="rounded-l-lg px-4 py-3 text-left">
                                    Nama Peserta
                                </th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Devisi</th>
                                <th className="px-4 py-3 text-left">
                                    Tanggal Tes
                                </th>
                                <th className="px-4 py-3 text-left">
                                    Tipe Karakter
                                </th>
                                <th className="rounded-r-lg px-4 py-3 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white font-semibold text-gray-800">
                            {results.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-4">{item.nama}</td>
                                    <td className="px-4 py-4">{item.email}</td>
                                    <td className="px-4 py-4">{item.devisi}</td>
                                    <td className="px-4 py-4">{item.tgl}</td>
                                    <td className="px-4 py-4">
                                        {item.karakter}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <Link
                                            href="#"
                                            className="inline-flex items-center gap-1 font-bold text-saintara-yellow hover:text-yellow-500"
                                        >
                                            <HiOutlineEye className="h-5 w-5" />{' '}
                                            Lihat Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </InstansiLayout>
    );
}
