import PenggunaLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiPencil, HiPlus, HiSearch, HiTrash, HiX } from 'react-icons/hi';

// --- TIPE DATA ---
interface User {
    id: string;
    name: string;
    nama_panggilan?: string;
    email: string;
    no_telp?: string;
    alamat?: string;
    negara?: string;
    kota?: string;
    tgl_lahir?: string;
    jenis_kelamin?: string;
    gol_darah?: string;
    created_at?: string;
}

interface PaginatedData<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    from: number;
    to: number;
    total: number;
}

interface Props {
    users: PaginatedData<User>;
    filters: { search?: string };
}

// --- KOMPONEN MODAL ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
            <div className="w-full max-w-3xl scale-100 transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <HiX className="h-6 w-6" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default function PersonalPage({ users, filters }: Props) {
    const { url } = usePage(); // Untuk cek URL aktif
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: '',
        nama: '',
        nama_panggilan: '',
        email: '',
        password: '',
        no_telp: '',
        alamat: '',
        negara: '',
        kota: '',
        tgl_lahir: '',
        jenis_kelamin: '',
        gol_darah: '',
        tab_type: 'Personal',
    });

    // --- HANDLERS ---
    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/pengguna/personal', { search }, { preserveState: true });
    };

    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        setShowPassword(false);
        setData('tab_type', 'Personal');
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setIsEditMode(true);
        setShowPassword(false);
        setData({
            id: user.id,
            nama: user.name,
            nama_panggilan: user.nama_panggilan || '',
            email: user.email,
            no_telp: user.no_telp || '',
            alamat: user.alamat || '',
            negara: user.negara || '',
            kota: user.kota || '',
            tgl_lahir: user.tgl_lahir || '',
            jenis_kelamin: user.jenis_kelamin || '',
            gol_darah: user.gol_darah || '',
            password: '',
            tab_type: 'Personal',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/pengguna/${data.id}`, { onSuccess: () => setIsModalOpen(false) });
        } else {
            post('/admin/pengguna', { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus data Personal ini?')) {
            router.delete(`/admin/pengguna/${id}`, {
                data: { tab_type: 'Personal' },
                preserveScroll: true,
            });
        }
    };

    // Helper Styles
    const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none';
    const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700';

    return (
        <PenggunaLayout>
            <Head title="Pengguna Personal" />

            <div className="space-y-6 font-sans">
                {/* === NAVIGATION TABS (DITAMBAHKAN KEMBALI) === */}
                <div className="flex w-fit space-x-1 rounded-xl bg-gray-200 p-1">
                    <Link href="/admin/pengguna/personal" className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${url.startsWith('/admin/pengguna/personal') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        Personal
                    </Link>
                    <Link href="/admin/pengguna/instansi" className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${url.startsWith('/admin/pengguna/instansi') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        Instansi
                    </Link>
                </div>

                {/* HEADER & ACTIONS */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Data Pengguna Personal</h1>
                        <p className="text-sm text-gray-500">Kelola data pengguna individu yang terdaftar.</p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative w-full md:w-64">
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama/email..." className="w-full rounded-full border-none bg-white py-2.5 pr-10 pl-4 text-gray-600 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400" />
                            <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-yellow-500">
                                <HiSearch className="h-5 w-5" />
                            </button>
                        </form>

                        {/* Add Button */}
                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-yellow-500 hover:shadow-md">
                            <HiPlus className="h-5 w-5" />
                            Tambah Personal
                        </button>
                    </div>
                </div>

                {/* TABEL DATA */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-900">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Nama Lengkap</th>
                                    <th className="hidden px-6 py-4 font-bold md:table-cell">Gender</th>
                                    <th className="px-6 py-4 font-bold">Email</th>
                                    <th className="px-6 py-4 font-bold">No. Telp</th>
                                    <th className="hidden px-6 py-4 font-bold lg:table-cell">Alamat</th>
                                    <th className="px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {users.data.length > 0 ? (
                                    users.data.map((user, index) => (
                                        <tr key={user.id || index} className="transition-colors hover:bg-yellow-50/50">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                                            <td className="hidden px-6 py-4 capitalize md:table-cell">{user.jenis_kelamin || '-'}</td>
                                            <td className="px-6 py-4 text-blue-600">{user.email}</td>
                                            <td className="px-6 py-4">{user.no_telp || '-'}</td>
                                            <td className="hidden max-w-[200px] truncate px-6 py-4 lg:table-cell" title={user.alamat}>
                                                {user.alamat || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openEditModal(user)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700" title="Edit">
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(user.id)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700" title="Hapus">
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <HiSearch className="h-10 w-10 opacity-20" />
                                                <p>Tidak ada data personal ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-end gap-2">
                    {users.links.map(
                        (link, i) =>
                            link.url && (
                                <button
                                    key={i}
                                    onClick={() => router.get(link.url as string, { search }, { preserveState: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${link.active ? 'bg-yellow-400 text-black shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                                />
                            ),
                    )}
                </div>

                {/* === MODAL FORM === */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Personal' : 'Tambah Personal'}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Lengkap & Panggilan */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input type="text" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className={inputClass} placeholder="Sesuai KTP" required />
                                {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Nama Panggilan</label>
                                <input type="text" value={data.nama_panggilan} onChange={(e) => setData('nama_panggilan', e.target.value)} className={inputClass} placeholder="Panggilan" />
                            </div>
                        </div>

                        {/* Email & No Telp */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} placeholder="contoh@email.com" required />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>No. Telepon</label>
                                <input type="text" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} className={inputClass} placeholder="08..." />
                            </div>
                        </div>

                        {/* Info Fisik & Lainnya */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div>
                                <label className={labelClass}>Tanggal Lahir</label>
                                <input type="date" value={data.tgl_lahir} onChange={(e) => setData('tgl_lahir', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Jenis Kelamin</label>
                                <select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className={inputClass}>
                                    <option value="">Pilih...</option>
                                    <option value="Pria">Pria</option>
                                    <option value="Wanita">Wanita</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Golongan Darah</label>
                                <select value={data.gol_darah} onChange={(e) => setData('gol_darah', e.target.value)} className={inputClass}>
                                    <option value="">Pilih...</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                    <option value="Tidak Tahu">Tidak Tahu</option>
                                </select>
                            </div>
                        </div>

                        {/* Alamat */}
                        <div>
                            <label className={labelClass}>Alamat Lengkap</label>
                            <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Alamat domisili saat ini..." />
                        </div>

                        {/* Kota & Negara */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Kota</label>
                                <input type="text" value={data.kota} onChange={(e) => setData('kota', e.target.value)} className={inputClass} placeholder="Kota domisili" />
                            </div>
                            <div>
                                <label className={labelClass}>Negara</label>
                                <input type="text" value={data.negara} onChange={(e) => setData('negara', e.target.value)} className={inputClass} placeholder="Negara" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelClass}>{isEditMode ? 'Password (Isi jika ingin mengganti)' : 'Password'}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`${inputClass} pr-10`}
                                    placeholder={isEditMode ? 'Biarkan kosong jika tidak diganti' : 'Masukkan password'}
                                    required={!isEditMode}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
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
        </PenggunaLayout>
    );
}
