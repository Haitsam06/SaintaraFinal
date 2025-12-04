import AdminLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiCurrencyDollar, HiPencil, HiPlus, HiSearch, HiTag, HiTrash, HiX } from 'react-icons/hi'; // Tambah HiTag

// --- TYPES ---
interface KeuanganData {
    id_keuangan: string;
    tanggal_transaksi: string;
    deskripsi: string;
    jumlah: number;
    tipe: string;
    kategori?: string; // Tambahkan properti kategori (opsional karena data lama mungkin null)
}

interface Props {
    transaksi: { data: KeuanganData[]; links: any[] };
    totalPengeluaran: number;
    filters?: { search?: string };
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

export default function Pengeluaran({ transaksi, totalPengeluaran, filters }: Props) {
    const { url } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        id: '',
        jumlah: '',
        deskripsi: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        tipe: 'pengeluaran',
        kategori: 'umum', // Default kategori untuk input manual
    });

    const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // --- HANDLERS ---
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        router.get('/admin/keuangan/pengeluaran', { search: value }, { preserveState: true, replace: true, preserveScroll: true });
    };

    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        setData((prev) => ({ ...prev, tipe: 'pengeluaran', kategori: 'umum' }));
        setIsModalOpen(true);
    };

    const openEditModal = (item: KeuanganData) => {
        setIsEditMode(true);
        setData({
            id: item.id_keuangan,
            jumlah: item.jumlah.toString(),
            deskripsi: item.deskripsi,
            tanggal_transaksi: item.tanggal_transaksi,
            tipe: 'pengeluaran',
            kategori: item.kategori || 'umum',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/keuangan/update/${data.id}`, { onSuccess: () => setIsModalOpen(false) });
        } else {
            post('/admin/keuangan/store', { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus data pengeluaran ini?')) {
            destroy(`/admin/keuangan/destroy/${id}`);
        }
    };

    // Helper Styles
    const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none';
    const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700';

    return (
        <AdminLayout>
            <Head title="Keuangan - Pengeluaran" />

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
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Total Pengeluaran */}
                    <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Total Pengeluaran</p>
                                <h3 className="mt-2 text-2xl font-bold text-red-600">{formatRupiah(totalPengeluaran)}</h3>
                            </div>
                            <div className="rounded-full bg-red-50 p-3 text-red-600">
                                <HiCurrencyDollar className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* === HEADER & ACTIONS === */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Riwayat Pengeluaran</h1>
                        <p className="text-sm text-gray-500">Daftar semua transaksi uang keluar (Umum & Gaji).</p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-64">
                            <input type="text" placeholder="Cari transaksi..." value={searchTerm} onChange={handleSearch} className="w-full rounded-full border-none bg-white py-2.5 pr-10 pl-4 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400" />
                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                                <HiSearch className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Add Button */}
                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-yellow-500 hover:shadow-md">
                            <HiPlus className="h-5 w-5" />
                            Tambah Pengeluaran
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
                                    <th className="px-6 py-4 font-bold">Kategori</th>
                                    <th className="px-6 py-4 font-bold">Keterangan</th>
                                    <th className="px-6 py-4 font-bold">Jumlah</th>
                                    <th className="px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {transaksi.data.length > 0 ? (
                                    transaksi.data.map((item, idx) => (
                                        <tr key={idx} className="transition-colors hover:bg-red-50/30">
                                            {/* Tanggal */}
                                            <td className="px-6 py-4">{new Date(item.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>

                                            {/* Kategori Badge */}
                                            <td className="px-6 py-4">
                                                {item.kategori === 'gaji' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold tracking-wide text-purple-700 uppercase">
                                                        <HiTag className="h-3 w-3" /> Gaji
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold tracking-wide text-gray-600 uppercase">Umum</span>
                                                )}
                                            </td>

                                            {/* Deskripsi */}
                                            <td className="px-6 py-4 font-medium text-gray-800">{item.deskripsi}</td>

                                            {/* Jumlah */}
                                            <td className="px-6 py-4 font-bold text-red-600">{formatRupiah(item.jumlah)}</td>

                                            {/* Aksi */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {/* Logika Tombol Edit: Jika Gaji, arahkan ke halaman Gaji. Jika Umum, buka Modal */}
                                                    {item.kategori === 'gaji' ? (
                                                        <Link href="/admin/keuangan/gaji" className="rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700" title="Detail Gaji (Pindah Halaman)">
                                                            <HiPencil className="h-5 w-5" />
                                                        </Link>
                                                    ) : (
                                                        <button onClick={() => openEditModal(item)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700" title="Edit">
                                                            <HiPencil className="h-5 w-5" />
                                                        </button>
                                                    )}

                                                    <button onClick={() => handleDelete(item.id_keuangan)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700" title="Hapus">
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <HiCurrencyDollar className="h-10 w-10 opacity-20" />
                                                <p>Belum ada data pengeluaran.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* === MODAL FORM (Hanya untuk Pengeluaran Umum) === */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Jumlah */}
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

                        {/* Tanggal */}
                        <div>
                            <label className={labelClass}>Tanggal Transaksi</label>
                            <input type="date" value={data.tanggal_transaksi} onChange={(e) => setData('tanggal_transaksi', e.target.value)} className={inputClass} required />
                        </div>

                        {/* Keterangan */}
                        <div>
                            <label className={labelClass}>Keterangan / Keperluan</label>
                            <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Contoh: Beli ATK, Bayar Listrik, Service AC" required />
                        </div>

                        {/* Tombol Aksi */}
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
