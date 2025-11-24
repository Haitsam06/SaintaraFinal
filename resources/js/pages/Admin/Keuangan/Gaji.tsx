import AdminLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiPencil, HiPlus, HiSearch, HiTrash, HiUser, HiX } from 'react-icons/hi';

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

export default function GajiPage({ gaji, karyawan }: Props) {
    const { url } = usePage();
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
        status: 'pending',
    });

    const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // --- HANDLERS ---
    const openAddModal = () => {
        setIsEditMode(false);
        reset();
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

    // Helper Styles
    const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none';
    const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700';

    return (
        <AdminLayout>
            <Head title="Keuangan - Gaji Karyawan" />

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

                {/* === HEADER & ACTIONS === */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Penggajian Karyawan</h1>
                        <p className="text-sm text-gray-500">Kelola gaji, bonus, dan potongan tim.</p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        {/* Search Bar (Opsional, bisa diaktifkan jika backend support search) */}
                        <div className="relative w-full md:w-64">
                            <input type="text" placeholder="Cari data gaji..." className="w-full rounded-full border-none bg-white py-2.5 pr-10 pl-4 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400" />
                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                                <HiSearch className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Add Button */}
                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-yellow-500 hover:shadow-md">
                            <HiPlus className="h-5 w-5" />
                            Buat Penggajian
                        </button>
                    </div>
                </div>

                {/* === TABEL DATA === */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-yellow-400 text-gray-900">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Karyawan</th>
                                    <th className="px-6 py-4 font-bold">Tanggal</th>
                                    <th className="px-6 py-4 font-bold">Rincian (Pokok / Bonus / Potongan)</th>
                                    <th className="px-6 py-4 font-bold">Total Gaji</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {gaji.data.length > 0 ? (
                                    gaji.data.map((item) => (
                                        <tr key={item.id_keuangan} className="transition-colors hover:bg-yellow-50/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                        <HiUser className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.admin?.nama_admin || 'Unknown'}</p>
                                                        <p className="text-xs text-gray-500">{item.admin?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(item.tanggal_transaksi).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="space-y-1 px-6 py-4 text-xs">
                                                <div className="text-gray-600">Gaji: {formatRupiah(item.detail?.gaji_pokok || 0)}</div>
                                                <div className="font-medium text-green-600">Bonus: +{formatRupiah(item.detail?.bonus || 0)}</div>
                                                <div className="font-medium text-red-600">Potongan: -{formatRupiah(item.detail?.potongan || 0)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-base font-bold text-blue-600">{formatRupiah(item.jumlah)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${item.status_pembayaran === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status_pembayaran}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openEditModal(item)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-800" title="Edit">
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id_keuangan)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:text-red-800" title="Hapus">
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400 italic">
                                            Belum ada data penggajian.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* === MODAL FORM === */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Gaji' : 'Buat Penggajian'}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Karyawan Selection */}
                        <div>
                            <label className={labelClass}>Pilih Karyawan</label>
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
                                <label className={labelClass}>Tanggal Gaji</label>
                                <input type="date" value={data.tanggal_gaji} onChange={(e) => setData('tanggal_gaji', e.target.value)} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={inputClass}>
                                    <option value="pending">Pending</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                            </div>
                        </div>

                        {/* Gaji Pokok */}
                        <div>
                            <label className={labelClass}>Gaji Pokok (Rp)</label>
                            <div className="relative">
                                <span className="absolute top-2.5 left-4 text-gray-500">Rp</span>
                                <input type="number" value={data.gaji_pokok} onChange={(e) => setData('gaji_pokok', e.target.value)} className={`${inputClass} pl-10`} placeholder="0" required />
                            </div>
                        </div>

                        {/* Bonus & Potongan */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-green-600">Bonus (+)</label>
                                <input type="number" value={data.bonus} onChange={(e) => setData('bonus', e.target.value)} className={inputClass} placeholder="0" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-red-600">Potongan (-)</label>
                                <input type="number" value={data.potongan} onChange={(e) => setData('potongan', e.target.value)} className={inputClass} placeholder="0" />
                            </div>
                        </div>

                        {/* Catatan */}
                        <div>
                            <label className={labelClass}>Catatan Tambahan</label>
                            <textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Keterangan (opsional)..." />
                        </div>

                        {/* Estimasi Total */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-right">
                            <span className="text-sm font-medium text-gray-500">Estimasi Total Terima: </span>
                            <span className="block text-2xl font-bold text-blue-600">{formatRupiah((Number(data.gaji_pokok) || 0) + (Number(data.bonus) || 0) - (Number(data.potongan) || 0))}</span>
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
