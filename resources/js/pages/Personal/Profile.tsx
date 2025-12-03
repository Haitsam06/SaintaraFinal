import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { HiCamera, HiMail, HiIdentification, HiCalendar, HiLocationMarker } from 'react-icons/hi';

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
        _method: 'put',
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

            <div className="min-h-screen bg-gray-100 font-sans pb-20">
                
                {/* === HERO BANNER (HEADER) === */}
                <div className="relative bg-[#0F0F0F] pb-32 pt-12">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Dekorasi background halus */}
                        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-[#0F0F0F] to-[#0F0F0F] opacity-40"></div>
                    </div>
                    
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-3xl font-bold leading-7 text-white sm:truncate sm:text-4xl sm:tracking-tight">
                                    Pengaturan Profil
                                </h2>
                                <p className="mt-2 text-sm text-gray-400">
                                    Kelola informasi pribadi dan preferensi akun Anda di sini.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === MAIN CONTENT (OVERLAPPING) === */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                    
                    {/* Notifikasi Sukses */}
                    {success && (
                        <div className="mb-6 rounded-xl bg-green-50 border border-green-500 p-4 text-sm font-bold text-green-800 shadow-md flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* --- KOLOM KIRI: KARTU IDENTITAS --- */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* KARTU FOTO PROFIL */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden relative">
                                {/* Background Header Kuning */}
                                <div className="h-28 bg-yellow-400"></div>
                                
                                <div className="px-6 pb-8 relative text-center">
                                    {/* Avatar */}
                                    <div className="relative -mt-14 mb-4 inline-block">
                                        <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 shadow-md overflow-hidden">
                                            <img src={fotoPreview || '/memoji-placeholder.png'} alt="Foto Profil" className="h-full w-full object-cover" />
                                        </div>
                                        
                                        {/* Tombol Kamera */}
                                        <label htmlFor="foto-upload" className="absolute bottom-1 right-1 h-10 w-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-all shadow-md border-2 border-white" title="Ganti Foto">
                                            <HiCamera className="h-5 w-5" />
                                            <input id="foto-upload" type="file" className="hidden" accept="image/*" 
                                                onChange={(e) => {
                                                    const file = e.target.files ? e.target.files[0] : null;
                                                    setData('new_foto', file);
                                                    e.target.value = ''; 
                                                }} 
                                            />
                                        </label>
                                    </div>

                                    <h2 className="text-2xl font-extrabold text-black">{user.name}</h2>
                                    <div className="flex items-center justify-center gap-2 mt-1 text-black font-medium text-sm">
                                        <HiMail className="w-4 h-4 text-yellow-600" />
                                        {user.email}
                                    </div>
                                    
                                    <div className="mt-6">
                                        <span className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider border ${user.status_akun === 'aktif' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                            Status: {user.status_akun}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* KARTU INFO READ-ONLY */}
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
                                <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-2">
                                    Detail Akun
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-100 p-3 rounded-xl text-black border border-gray-200">
                                            <HiIdentification className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">ID Customer</p>
                                            <p className="text-sm font-bold text-black break-all">{user.id_customer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- KOLOM KANAN: FORM EDIT --- */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                                
                                <div className="px-8 py-6 border-b-2 border-gray-100 bg-gray-50">
                                    <h3 className="text-xl font-bold text-black">Ubah Biodata Diri</h3>
                                    <p className="text-sm text-gray-600 mt-1">Pastikan data yang Anda masukkan valid dan terbaru.</p>
                                </div>

                                <div className="p-8">
                                    <form onSubmit={submit}>
                                        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                                            
                                            {/* SECTION HEADER */}
                                            <div className="sm:col-span-2">
                                                <h4 className="text-sm font-extrabold text-yellow-600 uppercase tracking-wider border-l-4 border-yellow-400 pl-3">
                                                    Informasi Dasar
                                                </h4>
                                            </div>

                                            {/* INPUT: Nama Lengkap */}
                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Nama Lengkap</label>
                                                <input type="text" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors placeholder-gray-400"
                                                    placeholder="Masukkan nama lengkap"
                                                />
                                                {errors.nama_lengkap && <p className="mt-1 text-xs font-bold text-red-600">{errors.nama_lengkap}</p>}
                                            </div>

                                            {/* INPUT: Nama Panggilan */}
                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Nama Panggilan</label>
                                                <input type="text" value={data.nama_panggilan} onChange={(e) => setData('nama_panggilan', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors placeholder-gray-400"
                                                    placeholder="Nama panggilan"
                                                />
                                                {errors.nama_panggilan && <p className="mt-1 text-xs font-bold text-red-600">{errors.nama_panggilan}</p>}
                                            </div>

                                            {/* INPUT: Email (Disabled) */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-bold text-black mb-2">Email (Tidak dapat diubah)</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <HiMail className="text-gray-500" />
                                                    </div>
                                                    <input type="email" value={user.email} readOnly disabled
                                                        className="w-full pl-10 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-600 font-semibold cursor-not-allowed py-3"
                                                    />
                                                </div>
                                            </div>

                                            {/* SECTION HEADER */}
                                            <div className="sm:col-span-2 mt-2">
                                                <h4 className="text-sm font-extrabold text-yellow-600 uppercase tracking-wider border-l-4 border-yellow-400 pl-3">
                                                    Kontak & Data Pribadi
                                                </h4>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Nomor Telepon</label>
                                                <input type="text" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors"
                                                />
                                                {errors.no_telp && <p className="mt-1 text-xs font-bold text-red-600">{errors.no_telp}</p>}
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Tanggal Lahir</label>
                                                <input type="date" value={data.tgl_lahir} onChange={(e) => setData('tgl_lahir', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors"
                                                />
                                                {errors.tgl_lahir && <p className="mt-1 text-xs font-bold text-red-600">{errors.tgl_lahir}</p>}
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Jenis Kelamin</label>
                                                <select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors"
                                                >
                                                    <option value="">-- Pilih --</option>
                                                    <option value="Laki-laki">Laki-laki</option>
                                                    <option value="Perempuan">Perempuan</option>
                                                </select>
                                                {errors.jenis_kelamin && <p className="mt-1 text-xs font-bold text-red-600">{errors.jenis_kelamin}</p>}
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Golongan Darah</label>
                                                <select value={data.gol_darah} onChange={(e) => setData('gol_darah', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors"
                                                >
                                                    <option value="">-- Pilih --</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="AB">AB</option>
                                                    <option value="O">O</option>
                                                </select>
                                            </div>

                                            {/* SECTION HEADER */}
                                            <div className="sm:col-span-2 mt-2">
                                                <h4 className="text-sm font-extrabold text-yellow-600 uppercase tracking-wider border-l-4 border-yellow-400 pl-3">
                                                    Domisili
                                                </h4>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Negara</label>
                                                <input type="text" value={data.negara} onChange={(e) => setData('negara', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors"
                                                />
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label className="block text-sm font-bold text-black mb-2">Kota</label>
                                                <input type="text" value={data.kota} onChange={(e) => setData('kota', e.target.value)}
                                                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-bold text-black mb-2">Alamat Lengkap</label>
                                                <div className="relative">
                                                     <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                                        <HiLocationMarker className="text-gray-500 mt-0.5" />
                                                    </div>
                                                    <textarea rows={3} value={data.alamat} onChange={(e) => setData('alamat', e.target.value)}
                                                        className="w-full pl-10 rounded-lg border-2 border-gray-300 bg-white text-black font-medium focus:border-yellow-500 focus:ring-yellow-500 transition-colors py-3"
                                                        placeholder="Masukkan alamat lengkap Anda"
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        {/* ACTIONS */}
                                        <div className="mt-8 pt-6 border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
                                            <button type="button" onClick={() => window.location.reload()} 
                                                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 hover:text-black transition-colors"
                                            >
                                                Batal
                                            </button>
                                            <button type="submit" disabled={processing} 
                                                className="px-8 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                        Menyimpan...
                                                    </>
                                                ) : 'Simpan Perubahan'}
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