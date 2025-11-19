import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head } from '@inertiajs/react';
import { FaDownload } from 'react-icons/fa';
import { HiOutlineArrowDown } from 'react-icons/hi';

// Komponen Placeholder untuk Chart
const PlaceholderPieChart = () => (
    <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-200">
        <span className="text-xs text-gray-500">Pie Chart</span>
    </div>
);
const PlaceholderBarChart = () => (
    <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-200">
        <span className="text-xs text-gray-500">Bar Chart</span>
    </div>
);

export default function Dashboard() {
    // Data Dummy
    const hasilTes = [
        {
            no: 1,
            nama: 'Andi',
            devisi: 'Marketing',
            tgl: '12/10/..',
            kelamin: 'Pria',
            gol: 'A',
            email: 'Andiara...',
        },
        {
            no: 2,
            nama: 'Rara Aisya',
            devisi: 'Finance',
            tgl: '10/6/..',
            kelamin: 'Wanita',
            gol: 'B',
            email: 'Rara123...',
        },
        {
            no: 3,
            nama: 'Andi',
            devisi: 'SDM',
            tgl: '12/10/..',
            kelamin: 'Pria',
            gol: 'A',
            email: 'Andiara...',
        },
        {
            no: 4,
            nama: 'Rara Aisya',
            devisi: 'Manager',
            tgl: '10/6/..',
            kelamin: 'Wanita',
            gol: 'B',
            email: 'Rara123...',
        },
    ];

    const vouchers = [
        { kode: 'VOU123456', paket: '...', tgl: '30/08/2024' },
        { kode: 'VOU123457', paket: '...', tgl: '15/10/2024' },
    ];

    return (
        <InstansiLayout>
            <Head title="Dashboard Institusi" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* === KOLOM KIRI (2/3) === */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Ringkasan Utama */}
                    <div className="flex flex-col items-center justify-between rounded-xl bg-white p-6 shadow-sm md:flex-row">
                        <div className="text-center md:text-left">
                            <h3 className="mb-4 text-lg font-bold text-gray-800">Ringkasan Utama</h3>
                            <p className="text-sm text-gray-500">Total peserta</p>
                            <h4 className="mt-2 text-6xl font-bold text-gray-900">126</h4>
                        </div>
                        <div className="mt-6 md:mt-0">
                            {/* Placeholder Chart */}
                            <PlaceholderPieChart />
                        </div>
                    </div>

                    {/* Hasil Peserta Tes */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Hasil Peserta Tes</h3>
                            <button className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600">
                                <HiOutlineArrowDown className="h-5 w-5" />
                                Unduh Form Tes
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-gray-500">
                                    <tr>
                                        <th className="px-3 py-2">No</th>
                                        <th className="px-3 py-2">Nama</th>
                                        <th className="px-3 py-2">Devisi</th>
                                        <th className="px-3 py-2">Tanggal</th>
                                        <th className="px-3 py-2">Email</th>
                                        <th className="px-3 py-2">Unduh</th>
                                    </tr>
                                </thead>
                                <tbody className="font-medium text-gray-800">
                                    {hasilTes.map((tes) => (
                                        <tr key={tes.no} className="border-b border-gray-100">
                                            <td className="px-3 py-3">{tes.no}</td>
                                            <td className="px-3 py-3">{tes.nama}</td>
                                            <td className="px-3 py-3">{tes.devisi}</td>
                                            <td className="px-3 py-3">{tes.tgl}</td>
                                            <td className="px-3 py-3">{tes.email}</td>
                                            <td className="px-3 py-3">
                                                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                                                    <FaDownload />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="relative h-48 overflow-hidden rounded-xl shadow-sm">
                        <img
                            src="https://via.placeholder.com/800x200.png?text=Placeholder+Image" // Ganti dengan URL gambar banner Anda
                            alt="Banner PT Maju Jaya"
                            className="h-full w-full object-cover"
                        />
                        <div className="bg-opacity-40 absolute inset-0 bg-black"></div>
                        <h3 className="absolute bottom-6 left-6 max-w-sm text-2xl font-bold text-white">PT. Maju Jaya Bersama, Mari Bertumbuh Lebih Cepat.</h3>
                    </div>
                </div>

                {/* === KOLOM KANAN (1/3) === */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Laporan Terbaru */}
                    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                        <p className="text-sm text-gray-500">Laporan terbaru</p>
                        <h4 className="my-4 text-7xl font-bold text-gray-900">5</h4>
                    </div>

                    {/* Voucher */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Voucher</h3>
                            <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Buat voucher baru</button>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-500">
                                <tr>
                                    <th className="px-3 py-2">Kode</th>
                                    <th className="px-3 py-2">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="font-medium text-gray-800">
                                {vouchers.map((v) => (
                                    <tr key={v.kode} className="border-b border-gray-100">
                                        <td className="px-3 py-3">{v.kode}</td>
                                        <td className="px-3 py-3">{v.tgl}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Organisasi */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Organisasi</h3>
                        {/* Placeholder Chart */}
                        <PlaceholderBarChart />
                    </div>
                </div>
            </div>
        </InstansiLayout>
    );
}
