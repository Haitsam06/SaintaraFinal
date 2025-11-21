import DashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// 1. TAMBAHKAN INTERFACE INI (Agar TypeScript tidak bingung)
interface ProfileForm {
    nama_admin: string;
    no_telp: string;
    jenis_kelamin: string;
    email: string;
}

export default function Profile() {
    // 1. AMBIL DATA USER DARI SERVER (INERTIA)
    const { auth } = usePage().props as any;
    const user = auth.user;

    // 2. SETUP FORM MENGGUNAKAN INERTIA useForm
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<ProfileForm>({
        nama_admin: user.name || user.nama_admin || '',
        no_telp: user.no_telp || '',
        jenis_kelamin: user.jenis_kelamin || '',
        email: user.email || '',
    });

    // 3. HANDLE SUBMIT
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Kirim data ke route update
        post('/admin/updateProfile', {
            preserveScroll: true, // Agar halaman tidak scroll ke atas setelah simpan
            onSuccess: () => {
                // Opsional: Reset form atau logika lain
                // Alert bawaan browser (bisa diganti Toast/Notifikasi cantik nanti)
                // alert('Berhasil disimpan!');
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="Edit Profil" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900">Pengguna</h1>
                <div className="text-sm text-slate-500">
                    ID: <span className="font-mono font-bold text-slate-800">{user.id_admin || user.id}</span>
                </div>
            </div>

            {/* NOTIFIKASI SUKSES SEDERHANA */}
            {recentlySuccessful && <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 transition-all">✅ Perubahan berhasil disimpan!</div>}

            <div className="grid grid-cols-1 gap-8 font-sans lg:grid-cols-3">
                {/* --- KARTU PROFIL (KIRI) --- */}
                <div className="space-y-8 lg:col-span-1">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                        <div className="flex flex-col items-center">
                            <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-yellow-50 bg-slate-100 shadow-lg">
                                {user.foto ? <img src={user.foto} alt="Profile" className="h-full w-full object-cover" /> : <span className="text-4xl">👤</span>}
                            </div>
                            {/* Nama diambil dari state 'data' agar realtime berubah saat diketik */}
                            <h5 className="mb-1 text-xl font-bold text-gray-900">{data.nama_admin || 'Nama Admin'}</h5>
                            <span className="text-sm text-gray-500">{data.email}</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h5 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">Detail Akun</h5>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Status</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${user.status_akun === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status_akun || 'Aktif'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Gender</span>
                                <span className="text-sm font-bold text-gray-800">{data.jenis_kelamin || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FORM EDIT (KANAN) --- */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                        <h5 className="mb-1 text-2xl font-bold text-gray-800">Edit Data Diri</h5>
                        <p className="mb-6 text-sm text-gray-500">Perbarui informasi profil administrator Anda.</p>

                        <hr className="mb-6 border-gray-100" />

                        <form className="space-y-6" onSubmit={submit}>
                            {/* Nama Admin & Jenis Kelamin */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="nama_admin" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="nama_admin"
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.nama_admin}
                                        onChange={(e) => setData('nama_admin', e.target.value)}
                                        required
                                    />
                                    {errors.nama_admin && <div className="mt-1 text-xs text-red-500">{errors.nama_admin}</div>}
                                </div>
                                <div>
                                    <label htmlFor="jenis_kelamin" className="mb-2 block text-sm font-medium text-gray-700">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        id="jenis_kelamin"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.jenis_kelamin}
                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {errors.jenis_kelamin && <div className="mt-1 text-xs text-red-500">{errors.jenis_kelamin}</div>}
                                </div>
                            </div>

                            {/* No Telp & Email */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="no_telp" className="mb-2 block text-sm font-medium text-gray-700">
                                        No Telephone
                                    </label>
                                    <input
                                        id="no_telp"
                                        type="text"
                                        placeholder="08..."
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.no_telp}
                                        onChange={(e) => setData('no_telp', e.target.value)}
                                    />
                                    {errors.no_telp && <div className="mt-1 text-xs text-red-500">{errors.no_telp}</div>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input id="email" type="email" className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-slate-500" value={data.email} readOnly title="Email tidak dapat diubah" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button type="submit" disabled={processing} className="rounded-lg bg-yellow-400 px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition-all hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-200 disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
