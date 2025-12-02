import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

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
    year: string | number;
    company_name: string;
}

export default function CetakLaporan({ laporan, summary, year, company_name }: Props) {
    // Otomatis buka dialog print saat halaman dimuat
    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Format: 10-07-2025 23:16
        return date
            .toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(/\./g, ':'); // Ganti titik waktu jadi titik dua (opsional)
    };

    return (
        <div className="min-h-screen bg-white p-8 font-sans text-black">
            <Head title={`Laporan Keuangan - ${year}`} />

            {/* CSS Khusus Kertas A4 */}
            <style>{`
                @page {
                    size: A4;
                    margin: 2cm;
                }
                body {
                    background: white;
                    -webkit-print-color-adjust: exact;
                }
                /* Hilangkan URL header/footer browser default */
                @media print {
                    @page { margin: 0; }
                    body { margin: 1.6cm; }
                }
            `}</style>

            {/* --- HEADER LAPORAN --- */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold uppercase">Laporan Keuangan</h1>
                <h2 className="mt-1 text-lg font-semibold">{company_name}</h2>
                <p className="mt-1 text-sm text-gray-600">Periode: Tahun {year}</p>
            </div>

            {/* --- TABEL DATA --- */}
            <div className="mb-6 w-full border-t border-black">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="w-10 py-2 text-left font-bold">No.</th>
                            <th className="w-40 py-2 text-left font-bold">Tanggal</th>
                            <th className="w-24 py-2 text-left font-bold">Tipe</th>
                            <th className="py-2 text-left font-bold">Keterangan</th>
                            <th className="w-24 py-2 text-left font-bold">User</th>
                            <th className="w-32 py-2 text-right font-bold">Nominal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {laporan.length > 0 ? (
                            laporan.map((item, index) => (
                                <tr key={item.id_keuangan} className="border-b border-gray-200">
                                    <td className="py-2 align-top">{index + 1}</td>
                                    <td className="py-2 align-top">{formatDate(item.tanggal_transaksi)}</td>
                                    <td className="py-2 align-top capitalize">{item.tipe === 'pemasukan' ? 'Masuk' : 'Keluar'}</td>
                                    <td className="py-2 align-top">{item.deskripsi}</td>
                                    <td className="py-2 align-top">ADMIN</td>
                                    <td className="py-2 text-right align-top">{formatRupiah(item.jumlah)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                                    Tidak ada data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- FOOTER SUMMARY (POJOK KANAN BAWAH) --- */}
            <div className="mt-6 flex justify-end">
                <div className="w-1/2 sm:w-1/3">
                    <div className="flex justify-between py-1">
                        <span className="text-sm">Total Pemasukan:</span>
                        <span className="text-sm font-bold">{formatRupiah(summary.total_pemasukan)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span className="text-sm">Total Pengeluaran:</span>
                        <span className="text-sm font-bold">{formatRupiah(summary.total_pengeluaran)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-black py-2">
                        <span className="text-sm font-bold">Perubahan Saldo:</span>
                        <span className="text-sm font-bold">{formatRupiah(summary.saldo)}</span>
                    </div>
                </div>
            </div>

            {/* Footer Cetak */}
            <div className="fixed bottom-0 left-0 w-full text-[10px] text-gray-400 italic">Dicetak pada: {new Date().toLocaleString('id-ID')}</div>
        </div>
    );
}
