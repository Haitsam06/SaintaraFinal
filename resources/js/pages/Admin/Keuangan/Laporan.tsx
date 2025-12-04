import AdminLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, router } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { HiDocumentText, HiPrinter, HiRefresh, HiSearch } from 'react-icons/hi';

// --- TYPES ---
interface KeuanganItem {
    id_keuangan: string; // atau 'id' jika dari union query
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
    // Default tahun ke tahun ini jika filter kosong
    const [year, setYear] = useState(filters.year || new Date().getFullYear());

    // Format Rupiah (Safe Check agar tidak NaN)
    const formatRupiah = (angka: number) => {
        if (isNaN(angka) || angka === null) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    // Format Tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    // --- LOGIKA GROUPING BULAN ---
    const shouldShowGroupHeader = (currentIndex: number) => {
        if (currentIndex === 0) return true;

        const currentDate = new Date(laporan[currentIndex].tanggal_transaksi);
        const prevDate = new Date(laporan[currentIndex - 1].tanggal_transaksi);

        if (isNaN(currentDate.getTime()) || isNaN(prevDate.getTime())) return false;

        const currentMonthYear = `${currentDate.getMonth()}-${currentDate.getFullYear()}`;
        const prevMonthYear = `${prevDate.getMonth()}-${prevDate.getFullYear()}`;

        return currentMonthYear !== prevMonthYear;
    };

    const getGroupLabel = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const monthName = date.toLocaleDateString('id-ID', { month: 'long' });
        const yearVal = date.getFullYear();
        return `${monthName} ${yearVal}`.toUpperCase();
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

    return (
        <AdminLayout>
            <Head title="Laporan Keuangan" />

            {/* --- CSS KHUSUS CETAK (FULL WIDTH & HEADER KUNING) --- */}
            <style>{`
                @media print {
                    @page { margin: 10mm; size: auto; }
                    body { visibility: hidden; overflow: visible !important; }
                    #printable-area {
                        visibility: visible;
                        position: fixed;
                        top: 0; left: 0;
                        width: 100vw;
                        height: auto;
                        margin: 0; padding: 0;
                        background: white;
                        z-index: 9999;
                    }
                    #printable-area * { visibility: visible; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="space-y-6 font-sans text-gray-800">
                {/* --- NAVIGASI & FILTER (NO PRINT) --- */}
                <div className="no-print space-y-6">
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

                    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
                            <p className="text-sm text-gray-500">Ringkasan arus kas tahunan.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="w-full sm:w-32">
                                <label className="mb-1.5 block text-xs font-bold text-gray-600">Tahun</label>
                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-yellow-400 focus:ring-2 focus:outline-none" />
                            </div>
                            <button onClick={handleFilter} className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
                                <HiSearch /> Cari
                            </button>
                            <button onClick={handleReset} className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200">
                                <HiRefresh /> Reset
                            </button>
                            <button onClick={handlePrint} className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">
                                <HiPrinter /> Cetak
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                            <p className="text-xs font-bold tracking-wider text-green-700 uppercase">Total Pemasukan</p>
                            <h3 className="mt-2 text-2xl font-extrabold text-green-600">{formatRupiah(summary.total_pemasukan)}</h3>
                        </div>
                        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                            <p className="text-xs font-bold tracking-wider text-red-700 uppercase">Total Pengeluaran</p>
                            <h3 className="mt-2 text-2xl font-extrabold text-red-600">{formatRupiah(summary.total_pengeluaran)}</h3>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                            <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">Saldo Akhir</p>
                            <h3 className={`mt-2 text-2xl font-extrabold ${summary.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatRupiah(summary.saldo)}</h3>
                        </div>
                    </div>
                </div>

                {/* --- AREA TABEL UTAMA --- */}
                <div id="printable-area">
                    <div className="mb-6 hidden text-center print:block">
                        <h2 className="text-xl font-bold text-gray-900 uppercase">LAPORAN KEUANGAN TAHUN {year}</h2>
                        <p className="text-sm text-gray-600">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
                    </div>

                    <div className="w-full border border-gray-200 bg-white print:border-none">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-900" style={{ backgroundColor: '#FFC107', color: 'black', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                                    <th className="border-none px-4 py-3 text-xs font-bold tracking-wider uppercase">No</th>
                                    <th className="border-none px-4 py-3 text-xs font-bold tracking-wider uppercase">Tanggal</th>
                                    <th className="border-none px-4 py-3 text-center text-xs font-bold tracking-wider uppercase">Tipe</th>
                                    <th className="border-none px-4 py-3 text-xs font-bold tracking-wider uppercase">Keterangan</th>
                                    <th className="border-none px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">Nominal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {laporan.length > 0 ? (
                                    laporan.map((item, index) => (
                                        <Fragment key={index}>
                                            {/* GROUP HEADER (BULAN) */}
                                            {shouldShowGroupHeader(index) && (
                                                <tr className="bg-gray-100 print:bg-gray-100">
                                                    <td colSpan={5} className="border-b border-gray-200 px-4 py-2 text-xs font-extrabold text-gray-700 uppercase">
                                                        {getGroupLabel(item.tanggal_transaksi)}
                                                    </td>
                                                </tr>
                                            )}

                                            {/* BARIS DATA */}
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-gray-500">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-bold text-gray-800">{formatDate(item.tanggal_transaksi)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold tracking-wide uppercase ${item.tipe === 'pemasukan' ? 'border-green-200 bg-green-100 text-green-700' : 'border-red-200 bg-red-100 text-red-700'}`}>{item.tipe === 'pemasukan' ? 'MASUK' : 'KELUAR'}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.deskripsi}</td>
                                                <td className={`px-4 py-3 text-right text-sm font-bold ${item.tipe === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.tipe === 'pemasukan' ? '+ ' : '- '}
                                                    {formatRupiah(item.jumlah)}
                                                </td>
                                            </tr>
                                        </Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <HiDocumentText className="h-8 w-8 opacity-20" />
                                                <p>Tidak ada data transaksi untuk tahun {year}.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {laporan.length > 0 && (
                                <tfoot>
                                    <tr className="border-t-2 border-gray-300 bg-gray-50">
                                        <td colSpan={4} className="px-4 py-4 text-right text-xs font-bold tracking-wider text-gray-700 uppercase">
                                            Saldo Akhir (Surplus/Defisit)
                                        </td>
                                        <td className={`px-4 py-4 text-right text-base font-extrabold ${summary.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatRupiah(summary.saldo)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
