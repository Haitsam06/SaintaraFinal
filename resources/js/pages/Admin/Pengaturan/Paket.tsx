import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiArrowLeft, HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';

// --- TIPE DATA ---
interface PaketData {
    id_paket: string;
    nama_paket: string;
    harga: number;
    deskripsi: string;
    jumlah_karakter: number;
}

interface Props {
    paket: { data: PaketData[]; links: any[] };
}

// --- MODAL COMPONENT ---
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

export default function JenisTesPaket({ paket }: Props) {
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
        nama_paket: '',
        harga: '',
        deskripsi: '',
        jumlah_karakter: '',
    });

    const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // --- HANDLERS ---
    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        setData({
            id: '',
            nama_paket: '',
            harga: '',
            deskripsi: '',
            jumlah_karakter: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: PaketData) => {
        setIsEditMode(true);
        setData({
            id: item.id_paket,
            nama_paket: item.nama_paket,
            harga: item.harga.toString(),
            deskripsi: item.deskripsi || '',
            jumlah_karakter: item.jumlah_karakter.toString(),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/pengaturan/paket/${data.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/pengaturan/paket', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus paket ini?')) {
            destroy(`/admin/pengaturan/paket/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // Helper Styles
    const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none';
    const labelClass = 'mb-1.5 block text-sm font-bold text-gray-700';

    return (
        <AdminDashboardLayout>
            <Head title="Jenis Tes & Paket" />

            <div className="space-y-6 font-sans">
                {/* HEADER & BACK BUTTON */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2">
                            <Link href="/admin/pengaturan" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-yellow-600">
                                <HiArrowLeft className="h-4 w-4" />
                                Kembali ke Pengaturan
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Jenis Tes & Paket</h1>
                        <p className="text-sm text-gray-500">Kelola paket harga dan kuota karakter tes.</p>
                    </div>

                    <button onClick={openAddModal} className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-yellow-500 hover:shadow-md">
                        <HiPlus className="h-5 w-5" />
                        Tambah Paket
                    </button>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-yellow-400 text-gray-900">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Nama Paket</th>
                                    <th className="px-6 py-4 font-bold">Harga</th>
                                    <th className="px-6 py-4 text-center font-bold">Kuota Karakter</th>
                                    <th className="px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {paket.data.length > 0 ? (
                                    paket.data.map((item) => (
                                        <tr key={item.id_paket} className="transition-colors hover:bg-yellow-50/30">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{item.nama_paket}</div>
                                                <div className="max-w-[250px] truncate text-xs text-gray-500">{item.deskripsi}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-green-600">{formatRupiah(item.harga)}</td>
                                            <td className="px-6 py-4 text-center font-medium">{item.jumlah_karakter} Karakter</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openEditModal(item)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700" title="Edit">
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id_paket)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700" title="Hapus">
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-400">
                                            Belum ada paket yang tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL FORM */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Paket' : 'Tambah Paket'}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Paket */}
                        <div>
                            <label className={labelClass}>Nama Paket</label>
                            <input type="text" value={data.nama_paket} onChange={(e) => setData('nama_paket', e.target.value)} className={inputClass} placeholder="Contoh: Paket Premium" required />
                            {errors.nama_paket && <p className="mt-1 text-xs text-red-500">{errors.nama_paket}</p>}
                        </div>

                        {/* Grid Harga & Karakter */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Harga (Rp)</label>
                                <input type="number" value={data.harga} onChange={(e) => setData('harga', e.target.value)} className={inputClass} placeholder="150000" required />
                            </div>
                            <div>
                                <label className={labelClass}>Jml Karakter</label>
                                <input type="number" value={data.jumlah_karakter} onChange={(e) => setData('jumlah_karakter', e.target.value)} className={inputClass} placeholder="10" required />
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className={labelClass}>Deskripsi</label>
                            <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className={`${inputClass} min-h-[100px]`} rows={3} placeholder="Jelaskan benefit paket ini..."></textarea>
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
        </AdminDashboardLayout>
    );
}
