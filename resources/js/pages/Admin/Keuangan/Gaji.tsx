import KeuanganLayout from '@/layouts/KeuanganLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';

// --- TIPE DATA ---
interface Admin {
    id_admin: string;
    nama_admin: string;
    email: string;
}

interface GajiItem {
    id_keuangan: string;
    admin_id: string;
    admin: Admin;
    tanggal_transaksi: string;
    jumlah: number;
    status_pembayaran: 'pending' | 'lunas';
    deskripsi: string;
    detail: {
        gaji_pokok: number;
        bonus: number;
        potongan: number;
    };
}

interface Props {
    gaji: { data: GajiItem[]; links: any[] };
    karyawan: Admin[];
}

// --- MODAL ---
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

export default function GajiPage({ gaji, karyawan }: Props) {
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
        admin_id: '',
        tanggal_gaji: new Date().toISOString().split('T')[0],
        gaji_pokok: '',
        bonus: '0',
        potongan: '0',
        catatan: '',
        status: 'pending', // <-- DIKEMBALIKAN (Default Pending)
    });

    const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        // Reset status ke pending saat tambah baru
        setData((data) => ({ ...data, status: 'pending' }));
        setIsModalOpen(true);
    };

    const openEditModal = (item: GajiItem) => {
        setIsEditMode(true);
        setData({
            id: item.id_keuangan,
            admin_id: item.admin_id,
            tanggal_gaji: item.tanggal_transaksi.substring(0, 10),
            gaji_pokok: item.detail?.gaji_pokok?.toString() || '0',
            bonus: item.detail?.bonus?.toString() || '0',
            potongan: item.detail?.potongan?.toString() || '0',
            status: item.status_pembayaran || 'pending',
            catatan: item.deskripsi || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/keuangan/gaji/${data.id}`, { onSuccess: () => setIsModalOpen(false) });
        } else {
            post('/admin/keuangan/gaji', { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus data gaji ini?')) {
            destroy(`/admin/keuangan/gaji/${id}`);
        }
    };

    const inputClass = 'w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-gray-800';

    return (
        <KeuanganLayout>
            <Head title="Manajemen Gaji" />

            {/* CSS Khusus Icon Kalender Hitam */}
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: brightness(0) saturate(100%);
                    cursor: pointer;
                }
            `}</style>

            <div className="animate-fade-in font-poppins">
                {/* Header & Tombol */}
                <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div>
                        <h3 className="text-xl font-bold text-blue-900">Penggajian Karyawan</h3>
                        <p className="text-sm text-gray-500">Kelola gaji, bonus, dan potongan tim.</p>
                    </div>
                    <button onClick={openAddModal} className="flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 font-bold text-gray-900 shadow-md transition-all hover:bg-yellow-500">
                        <HiPlus /> Buat Penggajian
                    </button>
                </div>

                {/* Tabel Data */}
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead className="bg-yellow-400 text-gray-900">
                                <tr>
                                    <th className="rounded-l-xl px-6 py-4 font-bold">Karyawan</th>
                                    <th className="px-6 py-4 font-bold">Tanggal</th>
                                    <th className="px-6 py-4 font-bold">Rincian (Pokok / Bonus / Potongan)</th>
                                    <th className="px-6 py-4 font-bold">Total Gaji</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="rounded-r-xl px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-800">
                                {gaji.data.length > 0 ? (
                                    gaji.data.map((item) => (
                                        <tr key={item.id_keuangan} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold">{item.admin?.nama_admin || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{item.admin?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{new Date(item.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="space-y-1 px-6 py-4 text-xs">
                                                <div className="text-gray-600">P: {formatRupiah(item.detail?.gaji_pokok || 0)}</div>
                                                <div className="text-green-600">B: +{formatRupiah(item.detail?.bonus || 0)}</div>
                                                <div className="text-red-600">P: -{formatRupiah(item.detail?.potongan || 0)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-lg font-bold text-blue-600">{formatRupiah(item.jumlah)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${item.status_pembayaran === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status_pembayaran}</span>
                                            </td>
                                            <td className="flex justify-center gap-3 px-6 py-4 text-center">
                                                <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800">
                                                    <HiPencil size={20} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id_keuangan)} className="text-red-600 hover:text-red-800">
                                                    <HiTrash size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            Belum ada data gaji.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Form */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Gaji' : 'Buat Penggajian'}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Karyawan Selection */}
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">Pilih Karyawan</label>
                            <select value={data.admin_id} onChange={(e) => setData('admin_id', e.target.value)} className={inputClass} disabled={isEditMode} required>
                                <option value="">-- Pilih Karyawan --</option>
                                {karyawan.map((k) => (
                                    <option key={k.id_admin} value={k.id_admin}>
                                        {k.nama_admin}
                                    </option>
                                ))}
                            </select>
                            {errors.admin_id && <p className="mt-1 text-xs text-red-500">{errors.admin_id}</p>}
                        </div>

                        {/* Tanggal & Status Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-700">Tanggal Gaji</label>
                                <input type="date" value={data.tanggal_gaji} onChange={(e) => setData('tanggal_gaji', e.target.value)} className={inputClass} required />
                            </div>
                            {/* INPUT STATUS DIKEMBALIKAN DI SINI */}
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-700">Status</label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={inputClass}>
                                    <option value="pending">Pending</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                            </div>
                        </div>

                        {/* Gaji Pokok */}
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">Gaji Pokok (Rp)</label>
                            <input type="number" value={data.gaji_pokok} onChange={(e) => setData('gaji_pokok', e.target.value)} className={inputClass} placeholder="0" required />
                        </div>

                        {/* Bonus & Potongan */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-green-600">Bonus (+)</label>
                                <input type="number" value={data.bonus} onChange={(e) => setData('bonus', e.target.value)} className={inputClass} placeholder="0" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-red-600">Potongan (-)</label>
                                <input type="number" value={data.potongan} onChange={(e) => setData('potongan', e.target.value)} className={inputClass} placeholder="0" />
                            </div>
                        </div>

                        {/* Catatan */}
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">Catatan</label>
                            <textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className={inputClass} rows={2} placeholder="Keterangan tambahan..."></textarea>
                        </div>

                        {/* Estimasi Total */}
                        <div className="rounded-lg bg-gray-50 p-3 text-right">
                            <span className="text-sm text-gray-600">Estimasi Total Terima: </span>
                            <span className="text-xl font-bold text-blue-900">{formatRupiah((Number(data.gaji_pokok) || 0) + (Number(data.bonus) || 0) - (Number(data.potongan) || 0))}</span>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-100 px-4 py-2 font-bold text-gray-700 hover:bg-gray-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 font-bold text-gray-900 hover:bg-yellow-500">
                                Simpan
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </KeuanganLayout>
    );
}
