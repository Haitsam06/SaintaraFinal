import DashboardLayout from '@/layouts/dashboard-layout-personal';
import React, { useState } from 'react';

export default function Settings() {
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [language, setLanguage] = useState('id');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [notifications, setNotifications] = useState({
        articles: true,
        promos: false,
    });

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            alert('Password baru tidak cocok!');
            return;
        }

        if (passwordData.new_password.length < 6) {
            alert('Password minimal 6 karakter.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            alert('Password berhasil diubah (dummy).');
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
            setLoading(false);
        }, 1000);
    };

    // Data user dummy
    const user = {
        email: 'budi@example.com',
        role: 'personal',
        created_at: '2024-05-10T00:00:00Z',
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 text-black">
                <h1 className="mb-8 text-2xl font-bold text-[#2A2A2A]">Pengaturan Akun</h1>
                <div className="max-w-7xl space-y-6">
                    {/* === Pengaturan Akun === */}
                    <div className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-bold">Pengaturan Akun</h2>
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Email saat ini</label>
                                <div className="flex items-center space-x-2">
                                    <input type="email" disabled value={user.email} className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-gray-700" />
                                    <button className="rounded-lg bg-yellow-400 px-4 py-2 font-medium text-white hover:bg-yellow-500">Ubah Email</button>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Kata Sandi</label>
                                <button onClick={() => document.getElementById('password-section')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-lg bg-yellow-400 px-4 py-2 font-medium text-white hover:bg-yellow-500">
                                    Ubah Kata Sandi
                                </button>
                                <p className="mt-1 text-sm text-gray-500">Anda akan diminta memasukkan kata sandi saat ini.</p>
                            </div>
                        </div>
                    </div>

                    {/* === Ganti Password === */}
                    <div id="password-section" className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-bold">Ganti Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Password Sekarang</label>
                                <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black" required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Password Baru</label>
                                <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black" required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Konfirmasi Password Baru</label>
                                <input type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black" required />
                            </div>

                            <button type="submit" disabled={loading} className="rounded-lg bg-yellow-400 px-6 py-2 text-white hover:bg-yellow-500 disabled:opacity-50">
                                {loading ? 'Mengubah...' : 'Ubah Password'}
                            </button>
                        </form>
                    </div>

                    {/* === Zona Berbahaya === */}
                    <div className="rounded-xl border border-red-300 bg-red-100 p-6 shadow">
                        <h2 className="mb-2 text-lg font-bold text-red-700">Zona Berbahaya</h2>
                        <p className="mb-4 text-sm text-red-600">Menghapus akun Anda bersifat permanen dan tidak dapat dibatalkan. Semua data dan riwayat Anda akan hilang selamanya.</p>
                        <button className="rounded-lg bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-600">Hapus Akun Saya</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
