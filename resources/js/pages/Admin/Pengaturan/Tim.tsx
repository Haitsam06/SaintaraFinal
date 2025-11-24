import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiArrowLeft, HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';

// Interface sesuai Database
interface AdminUser {
    id_admin: string;
    nama_admin: string;
    email: string;
    no_telp: string;
    jenis_kelamin: string;
    status_akun: string;
    tanggal_dibuat: string;
}

interface Props {
    tim: { data: AdminUser[]; links: any[] };
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

export default function ManajemenTim({ tim }: Props) {
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
        nama: '',
        email: '',
        password: '',
        no_telp: '',
        jenis_kelamin: 'Pria',
        status_akun: 'aktif',
    });

    // --- HANDLERS ---
    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        setData({
            id: '',
            nama: '',
            email: '',
            password: '',
            no_telp: '',
            jenis_kelamin: 'Pria',
            status_akun: 'aktif',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user: AdminUser) => {
        setIsEditMode(true);
        setData({
            id: user.id_admin,
            nama: user.nama_admin,
            email: user.email,
            password: '',
            no_telp: user.no_telp || '',
            jenis_kelamin: user.jenis_kelamin || 'Pria',
            status_akun: user.status_akun || 'aktif',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/pengaturan/tim/${data.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/pengaturan/tim', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus admin ini?')) {
            destroy(`/admin/pengaturan/tim/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // Helper Styles
    const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none';
    const labelClass = 'mb-1.5 block text-sm font-bold text-gray-700';

    return (
        <AdminDashboardLayout>
            <Head title="Manajemen Tim" />

            <div className="space-y-6 font-sans">
                {/* HEADER & ACTIONS */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2">
                            <Link href="/admin/pengaturan" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-yellow-600">
                                <HiArrowLeft className="h-4 w-4" />
                                Kembali ke Pengaturan
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Manajemen Tim & Akses</h1>
                        <p className="text-sm text-gray-500">Kelola anggota tim admin dan hak akses mereka.</p>
                    </div>

                    <button onClick={openAddModal} className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-yellow-500 hover:shadow-md">
                        <HiPlus className="h-5 w-5" />
                        Tambah Admin
                    </button>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-yellow-400 text-gray-900">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Nama</th>
                                    <th className="px-6 py-4 font-bold">Email</th>
                                    <th className="px-6 py-4 font-bold">No. Telp</th>
                                    <th className="px-6 py-4 text-center font-bold">Status</th>
                                    <th className="px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {tim.data.length > 0 ? (
                                    tim.data.map((user) => (
                                        <tr key={user.id_admin} className="transition-colors hover:bg-yellow-50/30">
                                            <td className="px-6 py-4 font-bold text-gray-900">{user.nama_admin}</td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-gray-600">{user.no_telp || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${user.status_akun === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status_akun}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openEditModal(user)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700" title="Edit">
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(user.id_admin)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700" title="Hapus">
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            Belum ada data admin.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL FORM */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Admin' : 'Tambah Admin'}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Lengkap */}
                        <div>
                            <label className={labelClass}>Nama Lengkap</label>
                            <input type="text" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className={inputClass} placeholder="Nama Lengkap" required />
                            {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
                        </div>

                        {/* Email & No Telp */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Email</label>
                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} placeholder="email@saintara.com" required />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>No. Telp</label>
                                <input type="text" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} className={inputClass} placeholder="08..." />
                            </div>
                        </div>

                        {/* Jenis Kelamin & Status */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Jenis Kelamin</label>
                                <select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className={inputClass}>
                                    <option value="Pria">Pria</option>
                                    <option value="Wanita">Wanita</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Status Akun</label>
                                <select value={data.status_akun} onChange={(e) => setData('status_akun', e.target.value)} className={inputClass}>
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelClass}>{isEditMode ? 'Password (Opsional)' : 'Password'}</label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} placeholder={isEditMode ? 'Kosongkan jika tidak diganti' : 'Masukkan password'} required={!isEditMode} />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
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
