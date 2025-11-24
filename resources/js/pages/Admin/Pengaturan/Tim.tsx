import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, useForm } from '@inertiajs/react'; // Hapus 'router' jika tidak dipakai langsung
import { FormEvent, ReactNode, useState } from 'react';
import { HiArrowLeft, HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';

// Sesuaikan Interface dengan Database
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

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center text-gray-800 backdrop-blur-sm transition-all">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
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
        jenis_kelamin: 'Pria', // Default sesuai Enum DB
        status_akun: 'aktif', // Default sesuai Enum DB (huruf kecil)
    });

    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        // Set default value saat tambah baru
        setData({
            id: '', // Reset ID
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
            // URL Manual untuk Update: /admin/pengaturan/tim/{id}
            put(`/admin/pengaturan/tim/${data.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            // URL Manual untuk Store: /admin/pengaturan/tim
            post('/admin/pengaturan/tim', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus admin ini?')) {
            // URL Manual untuk Delete: /admin/pengaturan/tim/{id}
            destroy(`/admin/pengaturan/tim/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const inputClass = 'w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-gray-800';

    return (
        <AdminDashboardLayout>
            <Head title="Manajemen Tim" />
            <div className="font-poppins">
                <div className="mb-6 font-poppins">
                    {/* Baris 1: Judul & Tombol Tambah */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-blue-900">Manajemen Tim & Akses</h2>
                        <button onClick={openAddModal} className="flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-2 font-bold text-gray-900 shadow transition-all hover:scale-105 hover:bg-yellow-500">
                            <HiPlus /> Tambah Admin
                        </button>
                    </div>

                    {/* Baris 2: Tombol Kembali (Di bawahnya) */}
                    <div className="mt-2">
                        <Link href="/admin/pengaturan" className="flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-900">
                            <HiArrowLeft className="h-4 w-4" />
                            Kembali ke Menu Pengaturan
                        </Link>
                    </div>
                </div>
                <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-yellow-400 text-gray-900">
                            <tr>
                                <th className="rounded-l-xl px-6 py-4 font-bold">Nama</th>
                                <th className="px-6 py-4 font-bold">Email</th>
                                <th className="px-6 py-4 font-bold">No. Telp</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="rounded-r-xl px-6 py-4 text-center font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                            {tim.data.length > 0 ? (
                                tim.data.map((user) => (
                                    <tr key={user.id_admin} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">{user.nama_admin}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.no_telp || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${user.status_akun === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status_akun}</span>
                                        </td>
                                        <td className="flex justify-center gap-3 px-6 py-4 text-center">
                                            <button onClick={() => openEditModal(user)} className="text-blue-600 transition-colors hover:text-blue-800">
                                                <HiPencil size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(user.id_admin)} className="text-red-600 transition-colors hover:text-red-800">
                                                <HiTrash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        Belum ada data admin.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Admin' : 'Tambah Admin'}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-800">Nama Lengkap</label>
                            <input type="text" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className={inputClass} required />
                            {errors.nama && <div className="mt-1 text-xs text-red-500">{errors.nama}</div>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-800">Email</label>
                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} required />
                                {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-800">No. Telp</label>
                                <input type="text" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-800">Jenis Kelamin</label>
                                <select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className={inputClass}>
                                    <option value="Pria">Pria</option>
                                    <option value="Wanita">Wanita</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-800">Status Akun</label>
                                <select value={data.status_akun} onChange={(e) => setData('status_akun', e.target.value)} className={inputClass}>
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak aktif">Tidak Aktif</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-800">{isEditMode ? 'Password (Opsional)' : 'Password'}</label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} required={!isEditMode} />
                            {errors.password && <div className="mt-1 text-xs text-red-500">{errors.password}</div>}
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
