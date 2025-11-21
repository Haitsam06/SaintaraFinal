import DashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head } from '@inertiajs/react';
// Tambahkan impor untuk tipe event yang digunakan
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State Form (Frontend)
    // Kita tetap gunakan nama variabel camelCase di React agar rapi
    // Nanti saat submit/load baru kita cocokkan dengan snake_case database
    const [formData, setFormData] = useState({
        id_admin: '', // Perlu ID untuk update data
        fullName: '', // Map ke: nama_admin
        nickname: '', // DB: Tidak ada (Nanti bisa ditambah di DB jika perlu)
        gender: '', // DB: Tidak ada
        phone: '', // Map ke: no_telp
        bloodType: '', // DB: Tidak ada
        email: '', // Map ke: email
        country: 'Indonesia', // DB: Tidak ada (Default)
        city: '', // DB: Tidak ada
        foto: '', // Map ke: foto
        status_akun: '', // Map ke: status_akun
    });

    // === 1. AMBIL DATA DARI LOCAL STORAGE (MAPPING DB -> FORM) ===
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userDataString = localStorage.getItem('user_data');

        if (!token || !userDataString) {
            console.warn('Belum login. Silakan login terlebih dahulu.');
            setLoading(false);
            return;
        }

        try {
            const user = JSON.parse(userDataString);
            console.log('Data Database:', user);

            // MAPPING DATA DARI DATABASE 'admins' KE FORM REACT
            setFormData((prev) => ({
                ...prev,
                id_admin: user.id_admin || '',

                // 1. Nama Admin
                fullName: user.nama_admin || user.name || '',

                // 2. Email
                email: user.email || '',

                // 3. No Telp
                phone: user.no_telp || user.phone || '',

                // 4. Foto (Jika null di DB, string kosong)
                foto: user.foto || '',

                // 5. Status Akun
                status_akun: user.status_akun || 'aktif',

                // --- Field di bawah ini TIDAK ADA di tabel 'admins' Anda ---
                // Jika nanti Anda menambahkan kolom di DB, sesuaikan di sini
                nickname: user.nickname || '',
                city: user.city || '',
                gender: user.gender || '', // atau user.jenis_kelamin
                bloodType: user.blood_type || '',
                country: user.country || 'Indonesia',
            }));
        } catch (error) {
            console.error('Gagal memparsing data user', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // === 2. SIMPAN KE DATABASE (MAPPING FORM -> DB) ===
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const token = localStorage.getItem('token');

        // Siapkan payload data sesuai nama kolom di database 'admins'
        const payloadDatabase = {
            nama_admin: formData.fullName, // Frontend: fullName -> DB: nama_admin
            no_telp: formData.phone, // Frontend: phone -> DB: no_telp
            // email biasanya tidak diubah di edit profile biasa, tapi jika perlu:
            // email: formData.email,

            // Field lain yang mungkin Anda butuh kirim walau tidak ada di tabel admins (opsional)
            // nickname: formData.nickname,
            // gender: formData.gender,
        };

        console.log('Mengirim data ke Backend:', payloadDatabase);

        try {
            // Ganti URL dengan endpoint update profile Laravel Anda
            // await axios.post('http://127.0.0.1:8000/api/update-profile', payloadDatabase, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });

            // Simulasi Delay Request
            await new Promise((r) => setTimeout(r, 1000));

            // === PENTING: UPDATE LOCAL STORAGE AGAR DATA SINKRON ===
            // Kita ambil data lama, lalu timpa dengan data baru yang sesuai struktur DB
            const oldData = JSON.parse(localStorage.getItem('user_data') || '{}');
            const newData = {
                ...oldData,
                nama_admin: formData.fullName, // Update nama_admin
                no_telp: formData.phone, // Update no_telp
                // Update field UI lainnya agar tidak hilang saat refresh (hanya di local, sampai DB diupdate)
                nickname: formData.nickname,
                gender: formData.gender,
                city: formData.city,
                blood_type: formData.bloodType,
            };

            localStorage.setItem('user_data', JSON.stringify(newData));

            alert('Berhasil! Data profil telah diperbarui.');
        } catch (error: any) {
            console.error('Error saving profile:', error);
            alert('Gagal menyimpan perubahan.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-slate-500">Loading data profile...</div>;
    }

    return (
        <DashboardLayout>
            <Head title="Edit Profil" />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900">Pengguna</h1>
                <div className="text-sm text-slate-500">
                    Logged in as: <span className="font-bold text-slate-800">{formData.email}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 font-sans lg:grid-cols-3">
                {/* --- KOLOM KIRI (KARTU) --- */}
                <div className="space-y-8 lg:col-span-1">
                    {/* Kartu Profil */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                        <div className="flex flex-col items-center">
                            <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-yellow-50 bg-slate-100 shadow-lg">
                                <span className="text-4xl">👤</span>
                            </div>
                            <h5 className="mb-1 text-xl font-bold text-gray-900">{formData.fullName || 'Nama Pengguna'}</h5>
                            <span className="text-sm text-gray-500">{formData.email}</span>

                            <button type="button" className="mt-6 w-full rounded-lg bg-yellow-400 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-yellow-500">
                                Ubah Foto
                            </button>
                        </div>
                    </div>

                    {/* Kartu Status Akun */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h5 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">Status Akun</h5>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Tipe Akun :</span>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Personal Premium</span>
                        </div>
                    </div>
                </div>

                {/* --- KOLOM KANAN (FORM) --- */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                        <h5 className="mb-1 text-2xl font-bold text-gray-800">Edit Data Diri</h5>
                        <p className="mb-6 text-sm text-gray-500">Perbarui informasi profil Anda di sini.</p>

                        <hr className="mb-6 border-gray-100" />

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Nama Lengkap & Panggilan */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nama Lengkap
                                    </label>
                                    <input id="fullName" type="text" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none" value={formData.fullName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">
                                        Jenis Kelamin
                                    </label>
                                    <select id="gender" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none" value={formData.gender} onChange={handleChange}>
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                            </div>

                            {/* Jenis Kelamin & No Telepon */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                                        No Telephone
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="0812..."
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input id="email" type="email" className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-slate-500" value={formData.email} readOnly title="Email tidak dapat diubah" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button type="submit" disabled={saving} className="rounded-lg bg-saintara-yellow px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition-all hover:bg-yellow-500 focus:ring-4 focus:ring-slate-300 focus:outline-none disabled:opacity-70">
                                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
