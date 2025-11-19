import InstansiLayout from '@/layouts/dashboardLayoutInstansi'; // Import layout baru
import { Head } from '@inertiajs/react';
import { HiCreditCard, HiDownload } from 'react-icons/hi';

export default function Transaksi() {
    // Data Dummy untuk Riwayat Transaksi
    const transactions = [
        {
            id: 'INV/2025/10/001',
            tanggal: '5 Oktober 2025',
            keterangan: 'Pembelian 100 Token (Paket Institusi)',
            jumlah: 'Rp2.500.000',
            status: 'Lunas',
        },
        {
            id: 'INV/2025/09/015',
            tanggal: '15 September 2025',
            keterangan: 'Top-up Saldo AI Karakter',
            jumlah: 'Rp500.000',
            status: 'Lunas',
        },
        {
            id: 'INV/2025/09/002',
            tanggal: '2 September 2025',
            keterangan: 'Pembelian 50 Token (Paket Sekolah)',
            jumlah: 'Rp1.250.000',
            status: 'Lunas',
        },
    ];

    // Data Dummy untuk Riwayat Voucher
    const vouchers = [
        {
            kode: 'VCR/INST/001',
            tanggal: '5 Oktober 2025',
            jumlah: '100 Voucher',
            status: 'Sudah Dibuat',
        },
        {
            kode: 'VCR/GIFT/050',
            tanggal: '10 September 2025',
            jumlah: '50 Voucher',
            status: 'Sudah Dibuat',
        },
    ];

    return (
        <InstansiLayout>
            <Head title="Transaksi & Voucher" />

            <div className="space-y-8 font-poppins">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Transaksi & Voucher
                    </h2>
                    <button className="flex items-center gap-2 rounded-full bg-saintara-yellow px-6 py-3 font-bold text-gray-900 shadow-md transition-colors hover:bg-yellow-500">
                        <HiCreditCard className="h-5 w-5" />
                        Beli Token/Voucher Baru
                    </button>
                </div>

                {/* === RINGKASAN === */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            Total Transaksi (30 Hari)
                        </p>
                        <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                            Rp4.250.000
                        </h3>
                    </div>
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            Token Tersisa
                        </p>
                        <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                            150
                        </h3>
                    </div>
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-gray-500">
                            Voucher Dibuat (30 Hari)
                        </p>
                        <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
                            150
                        </h3>
                    </div>
                </div>

                {/* === RIWAYAT TRANSAKSI === */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                        Riwayat Transaksi
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-gray-50 text-sm font-medium text-gray-500 uppercase">
                                <tr>
                                    <th className="rounded-l-lg px-4 py-3 text-left">
                                        ID Transaksi
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Keterangan
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Jumlah
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Status
                                    </th>
                                    <th className="rounded-r-lg px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white font-semibold text-gray-800">
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="px-4 py-4">{tx.id}</td>
                                        <td className="px-4 py-4">
                                            {tx.tanggal}
                                        </td>
                                        <td className="px-4 py-4">
                                            {tx.keterangan}
                                        </td>
                                        <td className="px-4 py-4">
                                            {tx.jumlah}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button className="font-bold text-gray-900 hover:text-saintara-yellow">
                                                <HiDownload className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* === RIWAYAT VOUCHER === */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                        Riwayat Pembuatan Voucher
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50 text-sm font-medium text-gray-500 uppercase">
                                <tr>
                                    <th className="rounded-l-lg px-4 py-3 text-left">
                                        Kode Batch
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Tanggal Dibuat
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Jumlah Voucher
                                    </th>
                                    <th className="rounded-r-lg px-4 py-3 text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white font-semibold text-gray-800">
                                {vouchers.map((vc) => (
                                    <tr key={vc.kode}>
                                        <td className="px-4 py-4">{vc.kode}</td>
                                        <td className="px-4 py-4">
                                            {vc.tanggal}
                                        </td>
                                        <td className="px-4 py-4">
                                            {vc.jumlah}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                                {vc.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </InstansiLayout>
    );
}
