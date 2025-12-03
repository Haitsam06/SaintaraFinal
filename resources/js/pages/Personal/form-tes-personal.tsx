import React from "react";
import { useForm, usePage } from "@inertiajs/react";

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
    // 1. Ambil data user dari Props Inertia (Database)
    const { auth } = usePage<ProfileProps>().props;
    const user = auth.user;

    const searchParams = new URLSearchParams(window.location.search);
    const paketId = searchParams.get('paket_id');

    // Helper sederhana untuk mengubah Kode Paket jadi Nama
    const getNamaPaket = (id: string | null) => {
        if (id === 'DSR') return 'Paket Dasar';
        if (id === 'STD') return 'Paket Standar';
        if (id === 'PRM') return 'Paket Premium';
        return 'Belum Memilih Paket';
    };

    const namaPaket = getNamaPaket(paketId);

    // 2. Inisialisasi useForm dengan data user dari props
    const { data, setData, put, processing, errors } = useForm({
        // Mapping data dari database ke state form
        nama_lengkap: user.nama_lengkap || '',
        nama_panggilan: user.nama_panggilan || '',
        email: user.email || '',
        no_telp: user.no_telp || '',
        gol_darah: user.gol_darah || '',
        negara: user.negara || '',
        kota: user.kota || '',
        jenis_kelamin: user.jenis_kelamin || '',
        tgl_lahir: user.tgl_lahir || '',
    });

    const isFormValid = 
        data.nama_lengkap && 
        data.nama_panggilan && 
        user.email && 
        data.no_telp && 
        data.gol_darah && 
        data.negara && 
        data.kota && 
        data.jenis_kelamin &&
        data.tgl_lahir;

    // Mengirim ke WhatsApp
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // A. Kirim ke Database (Laravel)
        put('/personal/profile/update', { // Pastikan route ini benar
            preserveScroll: true,
            onSuccess: () => {
                // B. JIKA SUKSES DISIMPAN, Jalankan logika WhatsApp
                
                const nomorAdmin = "6281285723834"; // Ganti nomor admin disini

                const pesan = `
*FORMULIR DATA DIRI SAINTARA*
----------------------------------
Halo Admin, saya ingin melanjutkan tes kepribadian dengan *Paket Pilihan:* ${namaPaket}

Berikut data diri saya:
*Nama Lengkap:* ${data.nama_lengkap}
*Nama Panggilan:* ${data.nama_panggilan}
*Email:* ${user.email}
*Tanggal Lahir:* ${data.tgl_lahir}
*No. Telepon:* ${data.no_telp}
*Golongan Darah:* ${data.gol_darah}
*Negara:* ${data.negara}
*Kota:* ${data.kota}
*Jenis Kelamin:* ${data.jenis_kelamin}

Mohon arahannya untuk langkah selanjutnya. Terima kasih!
                `.trim();

                const urlWA = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
                
                // Buka WA di tab baru
                window.open(urlWA, '_blank');
            },
            onError: () => {
                alert("Terjadi kesalahan saat menyimpan data. Mohon periksa input Anda.");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border text-black">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-yellow-600">Saintara</h1>
                    <h2 className="mt-2 text-xl font-semibold">Formulir Tes Kepribadian</h2>
                    <p className="mt-1 text-sm text-gray-600">Silakan isi data diri Anda sebelum memulai tes.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <label htmlFor="nama_panggilan" className="block text-sm font-medium mb-2">Nama Panggilan</label>
                        <input
                            id="nama_panggilan"
                            type="text"
                            className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:ring focus:ring-yellow-300 focus:outline-none border-gray-300"
                            placeholder="Nama Panggilan"
                            value={data.nama_panggilan}
                            onChange={(e) => setData('nama_panggilan', e.target.value)}
                        />
                    </div>

                    {/* E-mail */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:ring focus:ring-yellow-300 focus:outline-none border-gray-300"
                            placeholder="email@example.com"
                            value={user.email}
                            onChange={(e) => setData('email', e.target.value)}
                            readOnly // Opsional: Tambahkan jika email tidak boleh diedit
                        />
                    </div>

                    {/* Tanggal Lahir */}
                    <div>
                        <label htmlFor="tgl_lahir" className="block text-sm font-medium mb-1">Tanggal Lahir</label>
                        <input
                            id="tgl_lahir"
                            type="date"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                            value={data.tgl_lahir}
                            onChange={(e) => setData('tgl_lahir', e.target.value)}
                        />
                        {errors.tgl_lahir && <p className="mt-1 text-xs text-red-500">{errors.tgl_lahir}</p>}
                    </div>

                    {/* Nomor Telepon */}
                    <div>
                        <label htmlFor="no_telp" className="block text-sm font-medium mb-1">Nomor Telepon</label>
                        <input
                            id="no_telp"
                            type="text"
                            className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:ring focus:ring-yellow-300 focus:outline-none border-gray-300"
                            placeholder="08xxxxxxxxxx"
                            value={data.no_telp}
                            onChange={(e) => setData('no_telp', e.target.value)}
                        />
                        {errors.tgl_lahir && <p className="mt-1 text-xs text-red-500">{errors.tgl_lahir}</p>}
                    </div>

                    {/* Golongan Darah */}
                    <div>
                        <label htmlFor="gol_darah" className="block text-sm font-medium mb-1">Golongan Darah</label>
                        <select
                            id="gol_darah"
                            className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:ring focus:ring-yellow-300 focus:outline-none border-gray-300"
                            value={data.gol_darah}
                            onChange={(e) => setData('gol_darah', e.target.value)}
                        >
                            <option value="">Pilih Golongan Darah</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                        </select>
                    </div>

                    {/* Negara */}
                    <div>
                        <label htmlFor="negara" className="block text-sm font-medium mb-1">Negara</label>
                        <input
                            id="negara"
                            type="text"
                            className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:ring focus:ring-yellow-300 focus:outline-none border-gray-300"
                            placeholder="Negara"
                            value={data.negara}
                            onChange={(e) => setData('negara', e.target.value)}
                        />
                    </div>

                    {/* Kota */}
                    <div>
                        <label htmlFor="kota" className="block text-sm font-medium mb-1">Kota</label>
                        <input
                            id="kota"
                            type="text"
                            className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:ring focus:ring-yellow-300 focus:outline-none border-gray-300"
                            placeholder="Kota"
                            value={data.kota}
                            onChange={(e) => setData('kota', e.target.value)}
                        />
                    </div>

                    {/* Jenis Kelamin (Radio Buttons) */}
                    <div className="col-span-2">
                        <label className="mb-1 block text-sm font-medium">Jenis Kelamin</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender" // Name harus sama untuk grouping
                                    className="accent-yellow-500 h-4 w-4"
                                    value="Laki-laki"
                                    checked={data.jenis_kelamin === 'Laki-laki'}
                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                />
                                Laki-laki
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    className="accent-yellow-500 h-4 w-4"
                                    value="Perempuan"
                                    checked={data.jenis_kelamin === 'Perempuan'}
                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                />
                                Perempuan
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 col-span-2">
                        <button
                            type="submit"
                            // Tombol mati jika: sedang proses loading ATAU form belum valid
                            disabled={processing || !isFormValid}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-lg shadow-md transition-all 
                                       disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    {/* Sedikit animasi loading sederhana jika mau */}
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan Data...
                                </span>
                            ) : (
                                "Simpan dan Lanjutkan"
                            )}
                        </button>
                        {/* Pesan kecil di bawah tombol */}
                        {!isFormValid && (
                            <p className="text-center text-xs text-red-500 mt-2">
                                *Mohon lengkapi semua data di atas untuk melanjutkan.
                            </p>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}
