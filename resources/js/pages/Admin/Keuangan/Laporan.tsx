import KeuanganLayout from '@/layouts/KeuanganLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiPrinter, HiRefresh, HiSearch } from 'react-icons/hi';

// Tipe Data
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
            month: '2-digit',
            year: 'numeric',
        });
    };

    // --- Handlers ---
    const handleFilter = () => {
        router.get('/admin/keuangan/laporan', { year }, { preserveState: true });
    };

    const handleReset = () => {
        const currentYear = new Date().getFullYear();
        setYear(currentYear);
        router.get('/admin/keuangan/laporan', { year: currentYear }, { preserveState: true });
    };

    const handlePrint = () => {
        // Buka halaman cetak di tab baru dengan parameter tahun yang sedang dipilih
        const url = `/admin/keuangan/laporan/cetak?year=${year}`;
        window.open(url, '_blank');
    };

    return (
        <KeuanganLayout>
            <Head title="Laporan Keuangan" />

            {/* --- CSS KHUSUS CETAK --- */}
            <style>{`
                @media print {
                    /* Sembunyikan semua elemen body secara default */
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Tampilkan hanya container #printable-area dan isinya */
                    #printable-area, #printable-area * {
                        visibility: visible;
                    }

                    /* Posisikan area cetak ke pojok kiri atas kertas */
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 20px;
                        background-color: white;
                    }

                    /* Hilangkan background warna page/layout saat print */
                    html, body {
                        background: white;
                        height: auto;
                        overflow: visible;
                    }
                }
            `}</style>

            <div className="animate-fade-in font-poppins">
                {/* --- BAGIAN INI DISEMBUNYIKAN SAAT PRINT (print:hidden) --- */}
                <div className="print:hidden">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-blue-900">Laporan Keuangan</h3>
                        <p className="text-sm text-gray-500">Ringkasan arus kas berdasarkan tahun periode.</p>
                    </div>

                    {/* Filter & Actions */}
                    <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-end">
                        <div className="flex w-full items-end gap-3 md:w-auto">
                            <div className="w-full md:w-48">
                                <label className="mb-2 block text-sm font-bold text-gray-700">Pilih Tahun</label>
                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-lg border text-slate-800 border-gray-300 px-4 py-2 focus:border-yellow-400 focus:ring-yellow-400" placeholder="Contoh: 2025" />
                            </div>
                            <button onClick={handleFilter} className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-6 py-2.5 font-bold text-gray-900 transition-all hover:bg-yellow-500 hover:shadow-md">
                                <HiSearch /> Tampilkan
                            </button>
                            <button onClick={handleReset} className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 font-bold text-gray-600 transition-all hover:bg-gray-200">
                                <HiRefresh /> Reset
                            </button>
                        </div>
                        <div>
                            <button onClick={handlePrint} className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white transition-all hover:bg-green-700 hover:shadow-md">
                                <HiPrinter /> Cetak Laporan
                            </button>
                        </div>
                    </div>
                </div>
                {/* --- AKHIR BAGIAN DISEMBUNYIKAN --- */}

                {/* --- AREA YANG AKAN DICETAK (ID: printable-area) --- */}
                <div id="printable-area">
                    {/* Judul Tambahan Khusus Print (Muncul hanya saat print) */}
                    <div className="mb-8 hidden border-b-2 border-gray-800 pb-4 text-center print:block">
                        <h1 className="text-3xl font-bold text-gray-900">SAINTARA</h1>
                        <h2 className="mt-2 text-xl font-semibold text-gray-700">Laporan Keuangan Tahun {filters.year}</h2>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Pemasukan */}
                        <div className="rounded-2xl border border-green-100 bg-green-50 p-6 print:border-green-200 print:bg-green-50">
                            <p className="text-sm font-bold text-green-700">Pemasukan (Tahun {filters.year})</p>
                            <h3 className="mt-2 truncate text-2xl font-extrabold text-green-600">{formatRupiah(summary.total_pemasukan)}</h3>
                        </div>

                        {/* Pengeluaran */}
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 print:border-red-200 print:bg-red-50">
                            <p className="text-sm font-bold text-red-700">Pengeluaran (Tahun {filters.year})</p>
                            <h3 className="mt-2 truncate text-2xl font-extrabold text-red-600">{formatRupiah(summary.total_pengeluaran)}</h3>
                        </div>

                        {/* Saldo */}
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 print:border-blue-200 print:bg-blue-50">
                            <p className="text-sm font-bold text-blue-700">Perubahan Saldo</p>
                            <h3 className={`mt-2 truncate text-2xl font-extrabold ${summary.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatRupiah(summary.saldo)}</h3>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm print:border-gray-300 print:shadow-none">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-yellow-400 text-gray-900 print:bg-yellow-400">
                                        <th className="px-6 py-4 text-left text-xs font-extrabold tracking-wider uppercase">No.</th>
                                        <th className="px-6 py-4 text-left text-xs font-extrabold tracking-wider uppercase">Tanggal</th>
                                        <th className="px-6 py-4 text-left text-xs font-extrabold tracking-wider uppercase">Tipe</th>
                                        <th className="px-6 py-4 text-left text-xs font-extrabold tracking-wider uppercase">Keterangan</th>
                                        <th className="px-6 py-4 text-left text-xs font-extrabold tracking-wider uppercase">User</th>
                                        <th className="px-6 py-4 text-right text-xs font-extrabold tracking-wider uppercase">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {laporan.length > 0 ? (
                                        laporan.map((item, index) => (
                                            <tr key={item.id_keuangan} className="print:break-inside-avoid">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatDate(item.tanggal_transaksi)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase ${item.tipe === 'pemasukan' ? 'border-green-200 bg-green-100 text-green-700' : 'border-red-200 bg-red-100 text-red-700'}`}>
                                                        {item.tipe === 'pemasukan' ? 'Masuk' : 'Keluar'}
                                                    </span>
                                                </td>
                                                <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-700">{item.deskripsi}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">ADMIN</td>
                                                <td className={`px-6 py-4 text-right text-sm font-bold ${item.tipe === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.tipe === 'pemasukan' ? '+' : '-'} {formatRupiah(item.jumlah)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                                Tidak ada data transaksi untuk tahun {filters.year}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Print Footer */}
                    <div className="mt-8 hidden print:block">
                        <div className="flex justify-between border-t pt-4 text-xs text-gray-500 italic">
                            <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                            <p>Saintara Management System</p>
                        </div>
                    </div>
                </div>
            </div>
        </KeuanganLayout>
    );
}
