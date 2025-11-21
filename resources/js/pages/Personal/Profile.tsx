import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
      const [loading, setLoading] = useState(true);
       const [saving, setSaving] = useState(false);
   
       // State Form (Frontend)
       // Kita tetap gunakan nama variabel camelCase di React agar rapi
       // Nanti saat submit/load baru kita cocokkan dengan snake_case database
       const [formData, setFormData] = useState({
           id_customer: '', // Perlu ID untuk update data
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
                   id_customer: user.id_customer || '',
   
                   // 1. Nama Admin
                   fullName: user.nama_lengkap || user.name || '',
   
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
                   nickname: user.nama_panggilan || '',
                   city: user.kota || '',
                   gender: user.jenis_kelamin || '', // atau user.jenis_kelamin
                   bloodType: user.gol_darah || '',
                   country: user.negara || 'Indonesia',
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
                id_customer : formData.id_customer,
               nama_lengkap: formData.fullName, // Frontend: fullName -> DB: nama_admin
               no_telp: formData.phone, // Frontend: phone -> DB: no_telp
               // email biasanya tidak diubah di edit profile biasa, tapi jika perlu:
               // email: formData.email,
   
               // Field lain yang mungkin Anda butuh kirim walau tidak ada di tabel admins (opsional)
               nama_panggilan: formData.nickname,
               gol_darah: formData.bloodType,
               jenis_kelamin: formData.gender,
               kota: formData.city,
               negara: formData.country
           };
   
           console.log('Mengirim data ke Backend:', payloadDatabase);
   
           try {
               // Ganti URL dengan endpoint update profile Laravel Anda
               await axios.post('http://127.0.0.1:8000/personal/update-profile-personal', payloadDatabase, {
                   headers: { Authorization: `Bearer ${token}` }
               });
   
               // Simulasi Delay Request
               await new Promise((r) => setTimeout(r, 1000));
   
               // === PENTING: UPDATE LOCAL STORAGE AGAR DATA SINKRON ===
               // Kita ambil data lama, lalu timpa dengan data baru yang sesuai struktur DB
               const oldData = JSON.parse(localStorage.getItem('user_data') || '{}');
               const newData = {
                   ...oldData,
                    nama_lengkap: formData.fullName, // Frontend: fullName -> DB: nama_admin
                    no_telp: formData.phone,
                    nama_panggilan: formData.nickname,
                    gol_darah: formData.bloodType,
                    jenis_kelamin: formData.gender,
                    kota: formData.city,
                    negara: formData.country
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
            <div className="p-6">
                <h1 className="mb-8 text-2xl font-bold text-[#2A2A2A]">Profil Akun</h1>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* ============================ */}
                    {/* === KOLOM KIRI (KARTU) === */}
                    {/* ============================ */}
                    <div className="space-y-8 lg:col-span-1">
                        {/* --- Kartu Profil --- */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                            <div className="flex flex-col items-center">
                                <img
                                    src="/memoji-placeholder.png" // Pastikan file ada di folder public, atau ganti URL gambar lain
                                    alt="Foto Profil"
                                    className="mb-4 h-32 w-32 rounded-full border-4 border-yellow-50 object-cover shadow-lg"
                                />
                                <h5 className="mb-1 text-xl font-bold text-gray-900">{formData.fullName || 'Nama Pengguna'}</h5>
                                <span className="text-sm text-gray-500">{formData.email}</span>

                                <button type="button" className="mt-6 w-full rounded-lg bg-saintara-yellow py-2.5 text-sm font-bold text-saintara-black transition-colors hover:bg-yellow-400">
                                    Ubah Foto
                                </button>
                            </div>
                        </div>

                        {/* --- Kartu Status Akun --- */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h5 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">Status Akun</h5>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Tipe Akun :</span>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Personal Premium</span>
                            </div>
                        </div>
                    </div>

                    {/* ============================ */}
                    {/* === KOLOM KANAN (FORM) === */}
                    {/* ============================ */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                            <h5 className="mb-1 text-2xl font-bold text-gray-800">Edit Data Diri</h5>
                            <p className="mb-6 text-sm text-gray-500">Perbarui informasi profil Anda di sini.</p>

                            <hr className="mb-6 border-gray-100" />

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Baris 1: Nama Lengkap & Panggilan */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                                            Nama Lengkap
                                        </label>
                                        <input id="fullName" type="text" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-saintara-yellow focus:ring-saintara-yellow" value={formData.fullName} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label htmlFor="nickname" className="mb-2 block text-sm font-medium text-gray-700">
                                            Nama Panggilan
                                        </label>
                                        <input id="nickname" type="text" placeholder="Masukkan nama panggilan" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-saintara-yellow focus:ring-saintara-yellow" value={formData.nickname} onChange={handleChange} />
                                    </div>
                                </div>

                                {/* Baris 2: Jenis Kelamin & No Telepon */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">
                                            Jenis Kelamin
                                        </label>
                                        <select id="gender" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-saintara-yellow focus:ring-saintara-yellow" value={formData.gender} onChange={handleChange}>
                                            <option value="">Pilih Jenis Kelamin</option>
                                            <option value="pria">Pria</option>
                                            <option value="wanita">Wanita</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                                            No Telephone
                                        </label>
                                        <input id="phone" type="tel" placeholder="0812..." className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-saintara-yellow focus:ring-saintara-yellow" value={formData.phone} onChange={handleChange} />
                                    </div>
                                </div>

                                {/* Baris 3: Golongan Darah & Email */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="bloodType" className="mb-2 block text-sm font-medium text-gray-700">
                                            Golongan Darah
                                        </label>
                                        <select id="bloodType" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-saintara-yellow focus:ring-saintara-yellow" value={formData.bloodType} onChange={handleChange}>
                                            <option value="">Pilih Gol. Darah</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="AB">AB</option>
                                            <option value="O">O</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input id="email" type="email" className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-500" value={formData.email} onChange={handleChange} readOnly title="Email tidak dapat diubah" />
                                    </div>
                                </div>

                                {/* Baris 4: Negara & Kota */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-700">
                                            Negara
                                        </label>
                                        <input id="country" type="text" placeholder="Indonesia" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-saintara-yellow focus:ring-saintara-yellow" value={formData.country} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
                                            Kota
                                        </label>
                                        <input id="city" type="text" placeholder="Jakarta" className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-saintara-yellow focus:ring-saintara-yellow" value={formData.city} onChange={handleChange} />
                                    </div>
                                </div>

                                {/* Tombol Simpan */}
                                <div className="flex justify-end pt-6">
                                    <button type="submit" className="rounded-lg bg-saintara-black px-8 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 focus:outline-none">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
