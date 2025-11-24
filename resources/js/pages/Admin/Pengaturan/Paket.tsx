import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, useForm } from '@inertiajs/react'; // Hapus 'router' jika tidak dipakai langsung
import { FormEvent, ReactNode, useState } from 'react';
import { HiArrowLeft, HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';

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

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between border-b pb-4">
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
        id: '', // Untuk ID Paket yang sedang diedit
        nama_paket: '',
        harga: '',
        deskripsi: '',
        jumlah_karakter: '',
    });

    const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        // Set default value
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
            // Gunakan URL Manual untuk Update
            put(`/admin/pengaturan/paket/${data.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            // Gunakan URL Manual untuk Store
            post('/admin/pengaturan/paket', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus paket ini?')) {
            // Gunakan URL Manual untuk Delete
            destroy(`/admin/pengaturan/paket/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const inputClass = 'w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-gray-800';

    return (
        <AdminDashboardLayout>
            <Head title="Jenis Tes & Paket" />
            <div className="font-poppins">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-900">Jenis Tes & Paket</h2>
                    <button onClick={openAddModal} className="flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-2 font-bold text-gray-900 shadow transition-all hover:scale-105 hover:bg-yellow-500">
                        <HiPlus /> Tambah Paket
                    </button>
                </div>
                <div className="mb-4">
                    <Link href="/admin/pengaturan" className="flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-900">
                        <HiArrowLeft className="h-4 w-4" />
                        Kembali ke Menu Pengaturan
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-yellow-400 text-gray-900">
                            <tr>
                                <th className="rounded-l-xl px-6 py-4">Nama Paket</th>
                                <th className="px-6 py-4">Harga</th>
                                <th className="px-6 py-4">Karakter</th>
                                <th className="rounded-r-xl px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                            {paket.data.length > 0 ? (
                                paket.data.map((item) => (
                                    <tr key={item.id_paket} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{item.nama_paket}</div>
                                            <div className="max-w-[200px] truncate text-xs text-gray-500">{item.deskripsi}</div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-green-600">{formatRupiah(item.harga)}</td>
                                        <td className="px-6 py-4 text-center">{item.jumlah_karakter}</td>
                                        <td className="flex justify-center gap-3 px-6 py-4 text-center">
                                            <button onClick={() => openEditModal(item)} className="text-blue-600 transition-colors hover:text-blue-800">
                                                <HiPencil size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id_paket)} className="text-red-600 transition-colors hover:text-red-800">
                                                <HiTrash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Belum ada data paket.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Paket' : 'Tambah Paket'}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-800">Nama Paket</label>
                            <input type="text" value={data.nama_paket} onChange={(e) => setData('nama_paket', e.target.value)} className={inputClass} placeholder="Contoh: Paket Premium" required />
                            {errors.nama_paket && <div className="mt-1 text-xs text-red-500">{errors.nama_paket}</div>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-800">Harga (Rp)</label>
                                <input type="number" value={data.harga} onChange={(e) => setData('harga', e.target.value)} className={inputClass} placeholder="150000" required />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-800">Jumlah Karakter</label>
                                <input type="number" value={data.jumlah_karakter} onChange={(e) => setData('jumlah_karakter', e.target.value)} className={inputClass} placeholder="10" required />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-800">Deskripsi</label>
                            <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className={inputClass} rows={3} placeholder="Deskripsi paket singkat..."></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-100 px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 font-bold text-gray-900 transition-colors hover:bg-yellow-500 disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminDashboardLayout>
    );
}
