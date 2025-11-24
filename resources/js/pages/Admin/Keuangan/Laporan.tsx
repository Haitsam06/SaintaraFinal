import AdminLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiDocumentText, HiPrinter, HiRefresh, HiSearch } from 'react-icons/hi';

// --- TYPES ---
interface KeuanganItem {
    id_keuangan: string;
    tanggal_transaksi: string;
    tipe: 'pemasukan' | 'pengeluaran';
    deskripsi: string;
    jumlah: number;
}

interface Props {
    laporan: KeuanganItem[];
    summary: {
        total_pemasukan: number;
        total_pengeluaran: number;
        saldo: number;
    };
    filters: {
        year: string | number;
    };
}

export default function Laporan({ laporan, summary, filters }: Props) {
    const [year, setYear] = useState(filters.year);

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    // --- HANDLERS ---
    const handleFilter = () => {
        router.get('/admin/keuangan/laporan', { year }, { preserveState: true });
    };

    const handleReset = () => {
        const currentYear = new Date().getFullYear();
        setYear(currentYear);
        router.get('/admin/keuangan/laporan', { year: currentYear }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    // Helper Style untuk Status Badge
    const getBadgeColor = (tipe: string) => {
        return tipe === 'pemasukan' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <AdminLayout>
            <Head title="Laporan Keuangan" />

            {/* --- CSS KHUSUS CETAK --- */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-area, #printable-area * {
                        visibility: visible;
                    }
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 20px;
                        background-color: white;
                    }
                    /* Sembunyikan elemen dekoratif saat print */
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="space-y-6 font-sans">
                {/* --- BAGIAN INI TIDAK DICETAK (no-print) --- */}
                <div className="no-print space-y-6">
                    {/* Navigation Tabs */}
                    <div className="flex w-fit flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm">
                        {[
                            { name: 'Pemasukan', href: '/admin/keuangan/pemasukan' },
                            { name: 'Pengeluaran', href: '/admin/keuangan/pengeluaran' },
                            { name: 'Laporan', href: '/admin/keuangan/laporan' },
                            { name: 'Gaji', href: '/admin/keuangan/gaji' },
                        ].map((tab) => (
                            <Link key={tab.name} href={tab.href} className={`rounded-lg px-5 py-2 text-sm font-bold transition-all ${window.location.pathname.includes(tab.href) ? 'bg-yellow-400 text-black shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
                                {tab.name}
                            </Link>
                        ))}
                    </div>

                    {/* Header & Filter */}
                    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
                            <p className="text-sm text-gray-500">Ringkasan arus kas tahunan.</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="w-full sm:w-32">
                                <label className="mb-1.5 block text-xs font-bold text-gray-600">Tahun</label>
                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none" />
                            </div>
                            <button onClick={handleFilter} className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-black hover:shadow-md">
                                <HiSearch /> Cari
                            </button>
                            <button onClick={handleReset} className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-200">
                                <HiRefresh /> Reset
                            </button>
                            <button onClick={handlePrint} className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-green-700 hover:shadow-md">
                                <HiPrinter /> Cetak PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- AREA YANG AKAN DICETAK (printable-area) --- */}
                <div id="printable-area" className="rounded-2xl bg-white p-1 md:p-0">
                    {/* Judul Khusus Print */}
                    <div className="mb-8 hidden border-b-2 border-gray-800 pb-4 text-center print:block">
                        <h1 className="text-3xl font-extrabold text-gray-900">SAINTARA</h1>
                        <h2 className="mt-2 text-xl font-medium text-gray-700">Laporan Keuangan Tahun {filters.year}</h2>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Pemasukan */}
                        <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-green-50/50 p-6 shadow-sm print:border-green-500 print:bg-white">
                            <p className="text-xs font-bold tracking-wider text-green-700 uppercase">Total Pemasukan</p>
                            <h3 className="mt-2 text-2xl font-extrabold text-green-600">{formatRupiah(summary.total_pemasukan)}</h3>
                        </div>

                        {/* Pengeluaran */}
                        <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-red-50/50 p-6 shadow-sm print:border-red-500 print:bg-white">
                            <p className="text-xs font-bold tracking-wider text-red-700 uppercase">Total Pengeluaran</p>
                            <h3 className="mt-2 text-2xl font-extrabold text-red-600">{formatRupiah(summary.total_pengeluaran)}</h3>
                        </div>

                        {/* Saldo */}
                        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm print:border-blue-500 print:bg-white">
                            <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">Saldo Akhir</p>
                            <h3 className={`mt-2 text-2xl font-extrabold ${summary.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatRupiah(summary.saldo)}</h3>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm print:border-gray-300 print:shadow-none">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-yellow-400 text-gray-900 print:bg-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-extrabold tracking-wider uppercase">No</th>
                                    <th className="px-6 py-4 font-extrabold tracking-wider uppercase">Tanggal</th>
                                    <th className="px-6 py-4 font-extrabold tracking-wider uppercase">Tipe</th>
                                    <th className="px-6 py-4 font-extrabold tracking-wider uppercase">Keterangan</th>
                                    <th className="px-6 py-4 text-right font-extrabold tracking-wider uppercase">Nominal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {laporan.length > 0 ? (
                                    laporan.map((item, index) => (
                                        <tr key={item.id_keuangan} className="hover:bg-gray-50 print:break-inside-avoid">
                                            <td className="px-6 py-4 font-medium text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{formatDate(item.tanggal_transaksi)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${getBadgeColor(item.tipe)}`}>{item.tipe === 'pemasukan' ? 'Masuk' : 'Keluar'}</span>
                                            </td>
                                            <td className="max-w-xs truncate px-6 py-4 text-gray-600">{item.deskripsi}</td>
                                            <td className={`px-6 py-4 text-right font-bold ${item.tipe === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                                {item.tipe === 'pemasukan' ? '+' : '-'} {formatRupiah(item.jumlah)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <HiDocumentText className="h-8 w-8 opacity-20" />
                                                <p>Tidak ada data transaksi untuk tahun {filters.year}.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Print Footer */}
                    <div className="mt-8 hidden border-t border-gray-200 pt-4 text-right text-xs text-gray-500 italic print:block">
                        <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                        <p>Sistem Keuangan Saintara</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
