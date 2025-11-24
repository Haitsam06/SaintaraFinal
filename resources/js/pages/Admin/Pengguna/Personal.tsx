import PenggunaLayout from '@/layouts/PenggunaLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode, useState } from 'react';
import { HiPencil, HiPlus, HiSearch, HiTrash, HiX } from 'react-icons/hi';

// --- TIPE DATA (Diupdate sesuai Database) ---
interface User {
    id: string;
    name: string; // Mapping dari nama_lengkap
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
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto backdrop-blur-sm transition-all">
            {/* Padding y-8 agar modal tidak terpotong jika layar pendek */}
            <div className="my-8 w-full max-w-3xl transform rounded-3xl bg-white p-8 shadow-2xl transition-all">
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 transition-colors hover:text-red-500">
                        <HiX size={28} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default function PersonalPage({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form Inertia (Ditambahkan field baru)
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
        // Mapping data user ke form state
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

    // Class Helper
    // const inputClass = 'w-full rounded-lg border-gray-300 text-gray-900 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 fill-gray-900';
    const inputClass = 'w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-gray-800';
    const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

    return (
        <PenggunaLayout>
            <Head title="Pengguna Personal" />

            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari Personal..." className="w-full rounded-full border-none bg-gray-100 py-3 pr-12 pl-6 text-gray-600 focus:ring-2 focus:ring-yellow-400" />
                    <button type="submit" className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-yellow-500">
                        <HiSearch className="h-6 w-6" />
                    </button>
                </form>

                {/* Tombol Tambah */}
                <button onClick={openAddModal} className="flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-3 font-bold text-gray-900 shadow-md transition-all hover:scale-105 hover:bg-yellow-500">
                    <HiPlus className="h-5 w-5 rounded-full border-2 border-gray-900 p-[1px]" />
                    Tambah Personal
                </button>
            </div>

            {/* Tabel Data */}
            {/* Tabel Data Responsif */}
            <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-yellow-400 text-gray-900">
                            <tr>
                                <th className="px-6 py-4 font-bold">Nama Lengkap</th>
                                {/* Kolom Prioritas Rendah: Hidden di layar kecil (mobile/tablet), muncul di layar besar (lg/xl) */}
                                <th className="hidden px-6 py-4 font-bold md:table-cell">Jenis Kelamin</th>
                                <th className="px-6 py-4 font-bold">Email</th>
                                <th className="hidden px-6 py-4 font-bold xl:table-cell">Tanggal Lahir</th>
                                <th className="px-6 py-4 font-bold">No. Telp</th>
                                <th className="hidden px-6 py-4 font-bold lg:table-cell">Alamat</th>
                                <th className="hidden px-6 py-4 font-bold xl:table-cell">Kota</th>
                                {/* Gol Darah seringkali tidak krusial di tabel utama, disembunyikan di layar kecil */}
                                <th className="hidden px-6 py-4 font-bold 2xl:table-cell">Gol. Darah</th>
                                <th className="px-6 py-4 text-center font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                            {users.data.length > 0 ? (
                                users.data.map((user, index) => (
                                    <tr key={user.id || index} className="transition-colors hover:bg-yellow-50">
                                        {/* Nama: Selalu Muncul & Ditebalkan */}
                                        <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>

                                        {/* Sesuaikan visibility dengan header */}
                                        <td className="hidden px-6 py-4 capitalize md:table-cell">{user.jenis_kelamin || '-'}</td>
                                        <td className="px-6 py-4 text-blue-600">{user.email}</td>
                                        <td className="hidden px-6 py-4 xl:table-cell">{user.tgl_lahir || '-'}</td>
                                        <td className="px-6 py-4">{user.no_telp || '-'}</td>

                                        <td className="hidden max-w-[200px] truncate px-6 py-4 lg:table-cell" title={user.alamat}>
                                            {user.alamat || '-'}
                                        </td>

                                        <td className="hidden px-6 py-4 xl:table-cell">{user.kota || '-'}</td>
                                        <td className="hidden px-6 py-4 text-center 2xl:table-cell">{user.gol_darah || '-'}</td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(user)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700" title="Edit Detail">
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
                                    <td colSpan={10} className="py-12 text-center text-gray-400">
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

            {/* Pagination */}
            <div className="mt-8 flex justify-end gap-2">
                {users.links.map(
                    (link, i) =>
                        link.url && (
                            <button
                                key={i}
                                onClick={() => router.get(link.url as string, { search }, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${link.active ? 'bg-yellow-500 shadow-sm' : 'bg-yellow-400 hover:bg-yellow-500'}`}
                            />
                        ),
                )}
            </div>

            {/* === MODAL FORM (UPDATED) === */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Personal' : 'Tambah Personal'}>
                <form onSubmit={handleSubmit} className="space-y-5 font-poppins">
                    {/* Baris 1: Nama Lengkap & Nama Panggilan */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input type="text" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className={inputClass} placeholder="Nama lengkap sesuai KTP" required />
                            {errors.nama && <div className="mt-1 text-xs text-red-500">{errors.nama}</div>}
                        </div>
                        <div>
                            <label className={labelClass}>Nama Panggilan</label>
                            <input type="text" value={data.nama_panggilan} onChange={(e) => setData('nama_panggilan', e.target.value)} className={inputClass} placeholder="Nama panggilan" />
                        </div>
                    </div>

                    {/* Baris 2: Email & No Telp */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} placeholder="contoh@email.com" required />
                            {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                        </div>

                        <div>
                            <label className={labelClass}>No. Telepon</label>
                            <input type="text" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} className={inputClass} placeholder="08..." />
                        </div>
                    </div>

                    {/* Baris 3: Tanggal Lahir, Jenis Kelamin, Gol Darah */}
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

                    {/* Baris 4: Alamat (Full Width) */}
                    <div>
                        <label className={labelClass}>Alamat Lengkap</label>
                        <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Alamat domisili" />
                    </div>

                    {/* Baris 5: Kota & Negara */}
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

                    {/* Baris 6: Password (Full Width dengan Toggle) */}
                    <div>
                        <label className={labelClass}>{isEditMode ? 'Password (Isi jika ingin mengganti)' : 'Password'}</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={(e) => setData('password', e.target.value)} className={`${inputClass} pr-10`} placeholder={isEditMode ? 'Biarkan kosong jika tidak diganti' : 'Masukkan password'} required={!isEditMode} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                                {showPassword ? (
                                    // Ikon Mata Coret
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                        />
                                    </svg>
                                ) : (
                                    // Ikon Mata Biasa
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <div className="mt-1 text-xs text-red-500">{errors.password}</div>}
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex justify-end gap-3 border-t pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-100 px-6 py-2.5 font-bold text-gray-700 transition-colors hover:bg-gray-200">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="rounded-lg bg-yellow-400 px-6 py-2.5 font-bold text-gray-900 shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </PenggunaLayout>
    );
}
