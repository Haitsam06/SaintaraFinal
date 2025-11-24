import KeuanganLayout from '@/layouts/KeuanganLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiPencil, HiPlus, HiSearch, HiTrash, HiX } from 'react-icons/hi';

interface KeuanganData {
    id_keuangan: string;
    tanggal_transaksi: string;
    deskripsi: string;
    jumlah: number;
    tipe: string;
}

interface Props {
    transaksi: { data: KeuanganData[]; links: any[] };
    totalPengeluaran: number;
}

// --- MODAL COMPONENT (Reused) ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all">
            <div className="w-full max-w-lg transform rounded-3xl bg-white p-8 shadow-2xl transition-all">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                        <HiX size={28} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default function Pengeluaran({ transaksi, totalPengeluaran }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

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
        tipe: 'pengeluaran', // Default Pengeluaran
    });

    const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

    // --- HANDLERS ---
    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        setData('tipe', 'pengeluaran');
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

    const inputClass = 'w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500';
    const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

    return (
        <KeuanganLayout>
            <Head title="Keuangan - Pengeluaran" />

            <div className="animate-fade-in space-y-6 font-poppins">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <p className="text-sm font-medium text-red-600">Total Pengeluaran:</p>
                        <h3 className="mt-1 text-3xl font-bold text-red-600">{formatRupiah(totalPengeluaran)}</h3>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4 md:flex-row">
                    <div className="relative w-full md:w-1/2">
                        <input type="text" placeholder="Cari pengeluaran..." className="w-full rounded-full border-none bg-gray-100 py-2 pr-4 pl-10 text-slate-800 focus:ring-2 focus:ring-yellow-400" />
                        <HiSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button onClick={openAddModal} className="flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-2 font-bold text-gray-900 shadow-md transition-all hover:scale-105 hover:bg-yellow-500">
                        <HiPlus className="h-5 w-5" /> Tambah Pengeluaran
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-yellow-400 text-gray-900">
                                <th className="rounded-l-xl px-6 py-4 text-left font-bold">TANGGAL</th>
                                <th className="px-6 py-4 text-left font-bold">KETERANGAN</th>
                                <th className="px-6 py-4 text-left font-bold">JUMLAH</th>
                                <th className="rounded-r-xl px-6 py-4 text-center font-bold">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white font-semibold text-gray-800">
                            {transaksi.data.length > 0 ? (
                                transaksi.data.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-5">{new Date(item.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                        <td className="px-6 py-5">{item.deskripsi}</td>
                                        <td className="px-6 py-5 text-red-600">{formatRupiah(item.jumlah)}</td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800">
                                                    <HiPencil size={20} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id_keuangan)} className="text-red-600 hover:text-red-800">
                                                    <HiTrash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-400">
                                        Belum ada data pengeluaran.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelClass}>Jumlah (Rp)</label>
                            <input type="number" value={data.jumlah} onChange={(e) => setData('jumlah', e.target.value)} className={inputClass} placeholder="Contoh: 50000" required />
                            {errors.jumlah && <p className="text-xs text-red-500">{errors.jumlah}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Tanggal Transaksi</label>
                            <input type="date" value={data.tanggal_transaksi} onChange={(e) => setData('tanggal_transaksi', e.target.value)} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Keterangan Pengeluaran</label>
                            <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="Contoh: Beli ATK, Bayar Listrik" required />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-200 px-4 py-2 font-bold">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 font-bold hover:bg-yellow-500">
                                Simpan
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </KeuanganLayout>
    );
}
