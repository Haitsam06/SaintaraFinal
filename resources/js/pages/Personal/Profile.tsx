import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { HiCamera, HiIdentification, HiLocationMarker, HiMail } from 'react-icons/hi';

// --- Interface ---
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
    tgl_lahir: string;
    foto: string | null;
    status_akun: string;
    name: string;
}

interface ProfileProps {
    auth: {
        user: UserProps;
    };
    success?: string;
    [key: string]: any;
}

export default function Profile() {
    const { auth, success } = usePage<ProfileProps>().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        // _method: 'put',
        new_foto: null as File | null,
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/personal/profile', {
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

            <div className="min-h-screen bg-gray-100 pb-20 font-sans">
                {/* === HERO BANNER (HEADER) === */}
                <div className="relative bg-[#0F0F0F] pt-12 pb-32">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Dekorasi background halus */}
                        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-[#0F0F0F] to-[#0F0F0F] opacity-40"></div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="min-w-0 flex-1">
                                <h2 className="pb-4 text-3xl leading-7 font-bold text-white sm:truncate sm:text-4xl sm:tracking-tight">Pengaturan Profil</h2>
                                <p className="mt-2 text-sm text-gray-400">Kelola informasi pribadi dan preferensi akun Anda di sini.</p>
                            </div>

                            <h2 className="text-xl font-bold text-gray-200">{user.name}</h2>
                        </div>
                    </div>
                </div>

                {/* === MAIN CONTENT (OVERLAPPING) === */}
                <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Notifikasi Sukses */}
                    {success && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500 bg-green-50 p-4 text-sm font-bold text-green-800 shadow-md">
                            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* --- KOLOM KIRI: KARTU IDENTITAS --- */}
                        <div className="space-y-6 lg:col-span-4">
                            {/* KARTU FOTO PROFIL */}
                            <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
                                {/* Background Header Kuning */}
                                <div className="h-28 bg-yellow-400"></div>

                                <div className="relative px-6 pb-8 text-center">
                                    {/* Avatar */}
                                    <div className="relative -mt-14 mb-4 inline-block">
                                        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-md">
                                            <img src={fotoPreview || '/memoji-placeholder.png'} alt="Foto Profil" className="h-full w-full object-cover" />
                                        </div>

                                        {/* Tombol Kamera */}
                                        <label htmlFor="foto-upload" className="absolute right-1 bottom-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-md transition-all hover:bg-gray-800" title="Ganti Foto">
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

                                    <h2 className="text-2xl font-extrabold text-black">{user.name}</h2>
                                    <div className="mt-1 flex items-center justify-center gap-2 text-sm font-medium text-black">
                                        <HiMail className="h-4 w-4 text-yellow-600" />
                                        {user.email}
                                    </div>

                                    <div className="mt-6">
                                        <span className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-bold tracking-wider uppercase ${user.status_akun === 'aktif' ? 'border-green-300 bg-green-100 text-green-800' : 'border-red-300 bg-red-100 text-red-800'}`}>
                                            Status: {user.status_akun}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* KARTU INFO READ-ONLY */}
                            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg">
                                <h3 className="mb-4 border-b-2 border-gray-100 pb-2 text-sm font-bold tracking-wider text-black uppercase">Detail Akun</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-black">
                                            <HiIdentification className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">ID Customer</p>
                                            <p className="text-sm font-bold break-all text-black">{user.id_customer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- KOLOM KANAN: FORM EDIT --- */}
                        <div className="lg:col-span-8">
                            <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
                                <div className="border-b-2 border-gray-100 bg-gray-50 px-8 py-6">
                                    <h3 className="text-xl font-bold text-black">Ubah Biodata Diri</h3>
                                    <p className="mt-1 text-sm text-gray-600">Pastikan data yang Anda masukkan valid dan terbaru.</p>
                                </div>

                                <div className="p-8">
                                    <form onSubmit={submit}>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                            {/* SECTION HEADER */}
                                            <div className="sm:col-span-2">
                                                <h4 className="border-l-4 border-yellow-400 pl-3 text-sm font-extrabold tracking-wider text-yellow-600 uppercase">Informasi Dasar</h4>
                                            </div>

                                            {/* INPUT: Nama Lengkap */}
                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Nama Lengkap</label>
                                                <input
                                                    type="text"
                                                    value={data.nama_lengkap}
                                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black placeholder-gray-400 transition-colors focus:border-yellow-500 focus:ring-yellow-500"
                                                    placeholder="Masukkan nama lengkap"
                                                />
                                                {errors.nama_lengkap && <p className="mt-1 text-xs font-bold text-red-600">{errors.nama_lengkap}</p>}
                                            </div>

                                            {/* INPUT: Nama Panggilan */}
                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Nama Panggilan</label>
                                                <input
                                                    type="text"
                                                    value={data.nama_panggilan}
                                                    onChange={(e) => setData('nama_panggilan', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black placeholder-gray-400 transition-colors focus:border-yellow-500 focus:ring-yellow-500"
                                                    placeholder="Nama panggilan"
                                                />
                                                {errors.nama_panggilan && <p className="mt-1 text-xs font-bold text-red-600">{errors.nama_panggilan}</p>}
                                            </div>

                                            {/* INPUT: Email (Disabled) */}
                                            <div className="sm:col-span-2">
                                                <label className="mb-2 block text-sm font-bold text-black">Email (Tidak dapat diubah)</label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <HiMail className="text-gray-500" />
                                                    </div>
                                                    <input type="email" value={user.email} readOnly disabled className="w-full cursor-not-allowed rounded-lg border-2 border-gray-200 bg-gray-100 py-3 pl-10 font-semibold text-gray-600" />
                                                </div>
                                            </div>

                                            {/* SECTION HEADER */}
                                            <div className="mt-2 sm:col-span-2">
                                                <h4 className="border-l-4 border-yellow-400 pl-3 text-sm font-extrabold tracking-wider text-yellow-600 uppercase">Kontak & Data Pribadi</h4>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Nomor Telepon</label>
                                                <input
                                                    type="text"
                                                    value={data.no_telp}
                                                    onChange={(e) => setData('no_telp', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black transition-colors focus:border-yellow-500 focus:ring-yellow-500"
                                                />
                                                {errors.no_telp && <p className="mt-1 text-xs font-bold text-red-600">{errors.no_telp}</p>}
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Tanggal Lahir</label>
                                                <input
                                                    type="date"
                                                    value={data.tgl_lahir}
                                                    onChange={(e) => setData('tgl_lahir', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black transition-colors focus:border-yellow-500 focus:ring-yellow-500"
                                                />
                                                {errors.tgl_lahir && <p className="mt-1 text-xs font-bold text-red-600">{errors.tgl_lahir}</p>}
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Jenis Kelamin</label>
                                                <select
                                                    value={data.jenis_kelamin}
                                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black transition-colors focus:border-yellow-500 focus:ring-yellow-500"
                                                >
                                                    <option value="">-- Pilih --</option>
                                                    <option value="Laki-laki">Laki-laki</option>
                                                    <option value="Perempuan">Perempuan</option>
                                                </select>
                                                {errors.jenis_kelamin && <p className="mt-1 text-xs font-bold text-red-600">{errors.jenis_kelamin}</p>}
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Golongan Darah</label>
                                                <select value={data.gol_darah} onChange={(e) => setData('gol_darah', e.target.value)} className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black transition-colors focus:border-yellow-500 focus:ring-yellow-500">
                                                    <option value="">-- Pilih --</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="AB">AB</option>
                                                    <option value="O">O</option>
                                                </select>
                                            </div>

                                            {/* SECTION HEADER */}
                                            <div className="mt-2 sm:col-span-2">
                                                <h4 className="border-l-4 border-yellow-400 pl-3 text-sm font-extrabold tracking-wider text-yellow-600 uppercase">Domisili</h4>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Negara</label>
                                                <input
                                                    type="text"
                                                    value={data.negara}
                                                    onChange={(e) => setData('negara', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black transition-colors focus:border-yellow-500 focus:ring-yellow-500"
                                                />
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="mb-2 block text-sm font-bold text-black">Kota</label>
                                                <input type="text" value={data.kota} onChange={(e) => setData('kota', e.target.value)} className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-black transition-colors focus:border-yellow-500 focus:ring-yellow-500" />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="mb-2 block text-sm font-bold text-black">Alamat Lengkap</label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute top-3 left-3 flex items-start">
                                                        <HiLocationMarker className="mt-0.5 text-gray-500" />
                                                    </div>
                                                    <textarea
                                                        rows={3}
                                                        value={data.alamat}
                                                        onChange={(e) => setData('alamat', e.target.value)}
                                                        className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 pl-10 font-medium text-black transition-colors focus:border-yellow-500 focus:ring-yellow-500"
                                                        placeholder="Masukkan alamat lengkap Anda"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="mt-8 flex flex-col justify-end gap-4 border-t-2 border-gray-100 pt-6 sm:flex-row">
                                            <button type="button" onClick={() => window.location.reload()} className="rounded-xl border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-black">
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg disabled:transform-none disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    'Simpan Perubahan'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
