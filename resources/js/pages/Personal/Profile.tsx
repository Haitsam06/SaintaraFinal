import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { HiCamera } from 'react-icons/hi';

// --- Interface untuk tipe data user yang dikirim dari Backend ---
interface UserProps {
    id_customer: string;
    nama_lengkap: string;
    nama_panggilan: string;
    email: string;
    no_telp: string;
    alamat: string;
    negara: string;
    kota: string;
    jenis_kelamin: string;
    gol_darah: string;
    tgl_lahir: string; // YYYY-MM-DD format
    foto: string | null;
    status_akun: string;
    name: string; // Dari accessor di Model Customer.php
}

interface ProfileProps {
    auth: {
        user: UserProps;
    };
    success?: string; // Untuk flash message dari controller
    [key: string]: any; // Index signature untuk PageProps
}

export default function Profile() {
    // 1. Ambil data user dari Props Inertia
    const { auth, success } = usePage<ProfileProps>().props;
    const user = auth.user;

    // 2. Inisialisasi useForm dengan data user dari props
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // Spoofing method PUT untuk form
        new_foto: null as File | null,

        // Inisialisasi dengan NAMA KOLOM DATABASE
        nama_lengkap: user.nama_lengkap || '',
        nama_panggilan: user.nama_panggilan || '',
        no_telp: user.no_telp || '',
        alamat: user.alamat || '',
        negara: user.negara || '',
        kota: user.kota || '',
        jenis_kelamin: user.jenis_kelamin || '',
        gol_darah: user.gol_darah || '',
        tgl_lahir: user.tgl_lahir || '',
    });

    // 3. FUNGSI SUBMIT Form
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/personal/profile/update', {
            onSuccess: () => {
                setData('new_foto', null);
            },
            preserveScroll: true,
        });
    };

    const fotoPreview = data.new_foto ? URL.createObjectURL(data.new_foto) : user.foto;

    return (
        <DashboardLayout>
            <Head title="Profil Pribadi" />

            {/* Notifikasi Sukses */}
            {success && (
                <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 shadow-md" role="alert">
                    {success}
                </div>
            )}

            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Profil Pribadi</h1>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* --- Kolom Kiri: Profil Singkat & Detail --- */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Kartu 1: Foto dan Nama */}
                    <div className="overflow-hidden rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex flex-col items-center">
                            {/* Area Foto Profil */}
                            <div className="relative mb-4 h-32 w-32">
                                <img src={fotoPreview || '/memoji-placeholder.png'} alt="Foto Profil" className="h-full w-full rounded-full object-cover shadow-inner" />
                                {/* Tombol Upload Foto */}
                                <label htmlFor="foto-upload" className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-400 text-gray-900 shadow-md transition-colors hover:bg-yellow-500" title="Ubah Foto Profil">
                                    <HiCamera className="h-5 w-5" />
                                    <input
                                        id="foto-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            setData('new_foto', file);
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${user.status_akun === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Akun {user.status_akun.charAt(0).toUpperCase() + user.status_akun.slice(1)}</span>
                        </div>
                    </div>

                    {/* Kartu 2: Detail Akun Statis */}
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h4 className="mb-4 text-lg font-semibold text-gray-800">Detail Akun</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nama Panggilan</span>
                                <span className="font-semibold text-gray-800">{user.nama_panggilan || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tgl. Lahir</span>
                                {/* Format tanggal jika perlu, atau biarkan YYYY-MM-DD */}
                                <span className="font-semibold text-gray-800">{user.tgl_lahir || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gol. Darah</span>
                                <span className="font-semibold text-gray-800">{user.gol_darah || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Negara</span>
                                <span className="font-semibold text-gray-800">{user.negara || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Kolom Kanan: Form Update --- */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl bg-white p-8 shadow-lg">
                        <h3 className="mb-1 text-2xl font-bold text-gray-800">Edit Data Diri</h3>
                        <p className="mb-6 text-sm text-gray-500">Perbarui informasi profil Anda.</p>

                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Nama Lengkap */}
                                <div>
                                    <label htmlFor="nama_lengkap" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="nama_lengkap"
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.nama_lengkap}
                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                        required
                                    />
                                    {errors.nama_lengkap && <p className="mt-1 text-xs text-red-500">{errors.nama_lengkap}</p>}
                                </div>

                                {/* Nama Panggilan */}
                                <div>
                                    <label htmlFor="nama_panggilan" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nama Panggilan
                                    </label>
                                    <input
                                        id="nama_panggilan"
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.nama_panggilan}
                                        onChange={(e) => setData('nama_panggilan', e.target.value)}
                                    />
                                    {errors.nama_panggilan && <p className="mt-1 text-xs text-red-500">{errors.nama_panggilan}</p>}
                                </div>

                                {/* Tanggal Lahir */}
                                <div>
                                    <label htmlFor="tgl_lahir" className="mb-2 block text-sm font-medium text-gray-700">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        id="tgl_lahir"
                                        type="date"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.tgl_lahir}
                                        onChange={(e) => setData('tgl_lahir', e.target.value)}
                                    />
                                    {errors.tgl_lahir && <p className="mt-1 text-xs text-red-500">{errors.tgl_lahir}</p>}
                                </div>

                                {/* No. Telepon */}
                                <div>
                                    <label htmlFor="no_telp" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        id="no_telp"
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.no_telp}
                                        onChange={(e) => setData('no_telp', e.target.value)}
                                    />
                                    {errors.no_telp && <p className="mt-1 text-xs text-red-500">{errors.no_telp}</p>}
                                </div>

                                {/* Jenis Kelamin */}
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
                                    {errors.jenis_kelamin && <p className="mt-1 text-xs text-red-500">{errors.jenis_kelamin}</p>}
                                </div>

                                {/* Golongan Darah */}
                                <div>
                                    <label htmlFor="gol_darah" className="mb-2 block text-sm font-medium text-gray-700">
                                        Golongan Darah
                                    </label>
                                    <select
                                        id="gol_darah"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.gol_darah}
                                        onChange={(e) => setData('gol_darah', e.target.value)}
                                    >
                                        <option value="">Pilih Golongan Darah</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                    {errors.gol_darah && <p className="mt-1 text-xs text-red-500">{errors.gol_darah}</p>}
                                </div>

                                {/* Email (Readonly) */}
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input id="email" type="email" className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-slate-500" value={user.email} readOnly title="Email tidak dapat diubah" />
                                </div>

                                {/* Negara */}
                                <div>
                                    <label htmlFor="negara" className="mb-2 block text-sm font-medium text-gray-700">
                                        Negara
                                    </label>
                                    <input
                                        id="negara"
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.negara}
                                        onChange={(e) => setData('negara', e.target.value)}
                                    />
                                    {errors.negara && <p className="mt-1 text-xs text-red-500">{errors.negara}</p>}
                                </div>

                                {/* Kota */}
                                <div>
                                    <label htmlFor="kota" className="mb-2 block text-sm font-medium text-gray-700">
                                        Kota
                                    </label>
                                    <input
                                        id="kota"
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={data.kota}
                                        onChange={(e) => setData('kota', e.target.value)}
                                    />
                                    {errors.kota && <p className="mt-1 text-xs text-red-500">{errors.kota}</p>}
                                </div>
                                <div>
                                    <label htmlFor="alamat" className="mb-2 block text-sm font-medium text-gray-700">
                                        Alamat Lengkap
                                    </label>
                                    <input id="alamat" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                                    {errors.alamat && <p className="mt-1 text-xs text-red-500">{errors.alamat}</p>}
                                </div>
                            </div>

                            {/* Alamat Lengkap */}

                            {/* Tombol Simpan */}
                            <div className="flex justify-end pt-8">
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
