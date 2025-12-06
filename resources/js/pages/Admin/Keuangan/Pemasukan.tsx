import AdminLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react'; // [PERBAIKAN] Tambah 'router'
import { FormEvent, ReactNode, useState } from 'react';
import { HiChip, HiCurrencyDollar, HiPencil, HiPlus, HiSearch, HiTrash, HiTrendingUp, HiX } from 'react-icons/hi';

// --- TYPES ---
interface TransaksiData {
    id: string;
    tanggal_transaksi: string;
    deskripsi: string;
    jumlah: number;
    sumber_data: 'manual' | 'otomatis';
}

interface Props {
    transaksi: { data: TransaksiData[]; links: any[] };
    totalPemasukan: number;
    countBulanIni: number;
}

// --- KOMPONEN MODAL ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
            <div className="w-full max-w-lg scale-100 transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <HiX className="h-6 w-6" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default function Pemasukan({ transaksi, totalPemasukan, countBulanIni }: Props) {
    const { url } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form Setup
    const {
        data,
        setData,
        post,
        put,
        processing, // Jangan ambil 'delete' dari sini agar tidak bingung
        errors,
        reset,
    } = useForm({
        id: '',
        jumlah: '',
        deskripsi: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        tipe: 'pemasukan',
    });

    const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // --- HANDLERS ---
    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        setData('tipe', 'pemasukan');
        setIsModalOpen(true);
    };

    const openEditModal = (item: TransaksiData) => {
        // [PERBAIKAN] Logika guard dipindah ke tombol (disabled), tapi tetap dijaga di sini
        if (item.sumber_data === 'otomatis') return;

        setIsEditMode(true);
        setData({
            id: item.id,
            jumlah: item.jumlah.toString(),
            deskripsi: item.deskripsi,
            tanggal_transaksi: item.tanggal_transaksi,
            tipe: 'pemasukan',
        });
        setIsModalOpen(true);
    };

    // [PERBAIKAN] Menggunakan Manual URL string karena tidak ada Ziggy
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            // URL Manual: /admin/keuangan/update/{id}
            put(`/admin/keuangan/update/${data.id}`, { 
                onSuccess: () => setIsModalOpen(false) 
            });
        } else {
            // URL Manual: /admin/keuangan/store
            post('/admin/keuangan/store', { 
                onSuccess: () => setIsModalOpen(false) 
            });
        }
    };

    // [PERBAIKAN] Handler Delete menggunakan router.delete (Bukan useForm)
    const handleDelete = (id: string) => {
        if (confirm('Hapus data pemasukan ini?')) {
            // URL Manual: /admin/keuangan/destroy/{id}
            router.delete(`/admin/keuangan/destroy/${id}`, {
                onSuccess: () => {
                    // Refresh halaman otomatis terjadi
                }
            });
        }
    };

    const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none';
    const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700';

    return (
        <AdminLayout>
            <Head title="Keuangan - Pemasukan" />

            <div className="space-y-6 font-sans">
                {/* === NAVIGATION TABS === */}
                <div className="flex w-fit flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm">
                    {[
                        { name: 'Pemasukan', href: '/admin/keuangan/pemasukan' },
                        { name: 'Pengeluaran', href: '/admin/keuangan/pengeluaran' },
                        { name: 'Laporan', href: '/admin/keuangan/laporan' },
                        { name: 'Gaji', href: '/admin/keuangan/gaji' },
                    ].map((tab) => (
                        <Link key={tab.name} href={tab.href} className={`rounded-lg px-5 py-2 text-sm font-bold transition-all ${url.startsWith(tab.href) ? 'bg-yellow-400 text-black shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
                            {tab.name}
                        </Link>
                    ))}
                </div>

                {/* === STATS CARDS === */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Total Pemasukan</p>
                                <h3 className="mt-2 text-2xl font-bold text-green-600">{formatRupiah(totalPemasukan)}</h3>
                            </div>
                            <div className="rounded-full bg-green-50 p-3 text-green-600">
                                <HiCurrencyDollar className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Transaksi Bulan Ini</p>
                                <h3 className="mt-2 text-2xl font-bold text-blue-600">{countBulanIni}</h3>
                            </div>
                            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                                <HiTrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* === HEADER & ACTIONS === */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Riwayat Pemasukan</h1>
                        <p className="text-sm text-gray-500">Gabungan transaksi manual dan pembayaran sistem.</p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative w-full md:w-64">
                            <input type="text" placeholder="Cari transaksi..." className="w-full rounded-full border-none bg-white py-2.5 pr-10 pl-4 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400" />
                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                                <HiSearch className="h-5 w-5" />
                            </div>
                        </div>

                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-yellow-500 hover:shadow-md">
                            <HiPlus className="h-5 w-5" />
                            Tambah Manual
                        </button>
                    </div>
                </div>

                {/* === TABLE === */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-900">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Tanggal</th>
                                    <th className="px-6 py-4 font-bold">Keterangan</th>
                                    <th className="px-6 py-4 font-bold">Tipe</th>
                                    <th className="px-6 py-4 font-bold">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {transaksi.data.length > 0 ? (
                                    transaksi.data.map((item, idx) => {
                                        // [PERBAIKAN] Cek apakah item otomatis
                                        const isAutomated = item.sumber_data === 'otomatis';

                                        return (
                                            <tr key={idx} className="transition-colors hover:bg-green-50/30">
                                                <td className="px-6 py-4">{item.tanggal_transaksi ? new Date(item.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                                                <td className="px-6 py-4 font-medium text-gray-800">{item.deskripsi}</td>
                                                <td className="px-6 py-4">
                                                    {isAutomated ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                                            <HiChip className="h-3 w-3" /> Sistem
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Manual</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-green-600">{formatRupiah(item.jumlah)}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <HiCurrencyDollar className="h-10 w-10 opacity-20" />
                                                <p>Belum ada data pemasukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL FORM */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Pemasukan' : 'Tambah Pemasukan Manual'}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={labelClass}>Jumlah (Rp)</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <span className="text-gray-500">Rp</span>
                                </div>
                                <input type="number" value={data.jumlah} onChange={(e) => setData('jumlah', e.target.value)} className={`${inputClass} pl-12`} placeholder="0" required />
                            </div>
                            {errors.jumlah && <p className="mt-1 text-xs text-red-500">{errors.jumlah}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Tanggal Transaksi</label>
                            <input type="date" value={data.tanggal_transaksi} onChange={(e) => setData('tanggal_transaksi', e.target.value)} className={inputClass} required />
                        </div>

                        <div>
                            <label className={labelClass}>Keterangan / Sumber Dana</label>
                            <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Contoh: Pembayaran Token dari Budi" required />
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-gray-100 px-6 py-2.5 font-bold text-gray-700 transition-colors hover:bg-gray-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-xl bg-yellow-400 px-6 py-2.5 font-bold text-gray-900 shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
}