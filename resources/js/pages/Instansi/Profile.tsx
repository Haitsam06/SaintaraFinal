import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';

// Interface sesuai Model Instansi
interface InstansiUser {
    id_instansi: string;
    nama_instansi: string;
    email: string;
    no_telp: string | null;
    pic_name: string | null;
    bidang: string | null;
    alamat: string | null;
    foto: string | null;
}

interface PageProps {
    auth: {
        user: InstansiUser;
    };
    status?: string;
    [key: string]: any;
}

export default function Profile() {
    const { auth, status } = usePage<PageProps>().props;
    const user = auth.user; 

    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',

        nama_instansi: user.nama_instansi || '',
        email: user.email || '',
        no_telp: user.no_telp || '',
        pic_name: user.pic_name || '',
        bidang: user.bidang || '',
        alamat: user.alamat || '',
        foto: null as File | null,
    });

    const fotoPreview = data.foto 
        ? URL.createObjectURL(data.foto) 
        : user.foto 
            ? `/storage/${user.foto}` 
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nama_instansi)}&background=FACC15&color=000&size=128`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/instansi/profilInstansi', {
            forceFormData: true,
            onSuccess: () => {
                setData('foto', null);
            },
        });
    };

    // --- CLASS AGAR INPUT TERLIHAT JELAS ---
    // text-gray-900: Tulisan jadi hitam pekat
    // border: Menambahkan garis pinggir
    // bg-white: Background putih
    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none";

    return (
        <InstansiLayout>
            <Head title="Profil Organisasi" />

            <div className="max-w-7xl mx-auto">
                <h2 className="mb-8 text-3xl font-bold text-gray-900">
                    Profil Organisasi
                </h2>

                {status && (
                    <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700 shadow-sm border-l-4 border-green-500">
                        <span className="font-bold">Berhasil!</span> {status}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        
                        {/* === KOLOM KIRI (FOTO) === */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 rounded-[2.5rem] bg-white p-8 text-center shadow-sm border border-gray-200">
                                <img
                                    src={fotoPreview}
                                    alt="Foto Profil"
                                    className="mx-auto mb-6 h-32 w-32 rounded-full border-4 border-yellow-400 object-cover shadow-md"
                                />
                                <h3 className="text-xl font-bold text-gray-900 break-words">
                                    {user.nama_instansi}
                                </h3>
                                <p className="mb-6 text-sm text-gray-500 break-all">
                                    {user.email}
                                </p>

                                <input
                                    type="file"
                                    id="fotoUpload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => setData('foto', e.target.files ? e.target.files[0] : null)}
                                />
                                <label
                                    htmlFor="fotoUpload"
                                    className="block w-full cursor-pointer rounded-full bg-gray-100 px-4 py-3 font-bold text-gray-800 transition-colors hover:bg-gray-200"
                                >
                                    Ubah Logo
                                </label>
                                {errors.foto && <p className="mt-2 text-xs text-red-500">{errors.foto}</p>}
                                <p className="mt-2 text-xs text-gray-400">
                                    Format JPG/PNG. Maks 2MB.
                                </p>
                            </div>
                        </div>

                        {/* === KOLOM KANAN (INPUT DATA) === */}
                        <div className="lg:col-span-2">
                            <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-200">
                                <h3 className="mb-6 border-b border-gray-200 pb-4 text-xl font-bold text-gray-900">
                                    Detail Instansi
                                </h3>

                                <div className="space-y-6">
                                    {/* Nama Instansi */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700">Nama Instansi</label>
                                        <input
                                            type="text"
                                            value={data.nama_instansi}
                                            onChange={(e) => setData('nama_instansi', e.target.value)}
                                            className={inputClass} // Menggunakan class yg sudah diperbaiki
                                            placeholder="Nama Organisasi Anda"
                                        />
                                        {errors.nama_instansi && <p className="mt-1 text-xs text-red-500">{errors.nama_instansi}</p>}
                                    </div>

                                    {/* Email & Telepon */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">Email Kontak</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={inputClass}
                                                placeholder="email@instansi.com"
                                            />
                                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">No. Telepon</label>
                                            <input
                                                type="text"
                                                value={data.no_telp}
                                                onChange={(e) => setData('no_telp', e.target.value)}
                                                className={inputClass}
                                                placeholder="0812..."
                                            />
                                            {errors.no_telp && <p className="mt-1 text-xs text-red-500">{errors.no_telp}</p>}
                                        </div>
                                    </div>

                                    {/* pic_name dan bidang */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">Penanggung Jawab</label>
                                            <input
                                                type="text"
                                                value={data.pic_name}
                                                onChange={(e) => setData('pic_name', e.target.value)}
                                                className={inputClass}
                                                placeholder="Penanggung Jawab"
                                            />
                                            {errors.pic_name && <p className="mt-1 text-xs text-red-500">{errors.pic_name}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700">Bidang</label>
                                            <input
                                                type="text"
                                                value={data.bidang}
                                                onChange={(e) => setData('bidang', e.target.value)}
                                                className={inputClass}
                                                placeholder="Bidang"
                                            />
                                            {errors.bidang && <p className="mt-1 text-xs text-red-500">{errors.bidang}</p>}
                                        </div>
                                    </div>

                                    {/* Alamat */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700">Alamat Lengkap</label>
                                        <textarea
                                            rows={3}
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            className={inputClass}
                                            placeholder="Alamat lengkap organisasi..."
                                        />
                                        {errors.alamat && <p className="mt-1 text-xs text-red-500">{errors.alamat}</p>}
                                    </div>
                                </div>

                                {/* Tombol Simpan */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-yellow-400 px-8 py-3 font-bold text-gray-900 shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </InstansiLayout>
    );
}