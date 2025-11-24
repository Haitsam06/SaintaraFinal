import DashboardLayout from '@/layouts/dashboard-layout-personal';
import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Settings({ customer }: any) {

    // FORM PASSWORD
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset
    } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // SUBMIT PASSWORD
    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();

        put("/personal/settingPersonal/password", {
            preserveScroll: true,
            onSuccess: () => {
                alert("Password berhasil diubah.");
                reset();
            }
        });
    };

    // DELETE ACCOUNT FORM
    const { delete: destroy } = useForm();

    const handleDeleteAccount = () => {
        if (!confirm("Apakah Anda yakin ingin menghapus akun? Ini permanen.")) return;

        destroy("/personal/settingPersonal", {
            onSuccess: () => window.location.href = "/"
        });
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
                                    <input
                                        type="email"
                                        disabled
                                        value={customer?.email}
                                        className="w-full rounded-lg border bg-gray-100 px-4 py-2 text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === Ganti Password === */}
                    <div id="password-section" className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-bold">Ganti Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">

                            <div>
                                <label className="mb-1 block text-sm font-medium">Password Sekarang</label>
                                <input
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                                    required
                                />
                                {errors.current_password && (
                                    <p className="text-sm text-red-500">{errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Password Baru</label>
                                <input
                                    type="password"
                                    value={data.new_password}
                                    onChange={(e) => setData('new_password', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                                    required
                                />
                                {errors.new_password && (
                                    <p className="text-sm text-red-500">{errors.new_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    value={data.new_password_confirmation}
                                    onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                                    required
                                />
                                {errors.new_password_confirmation && (
                                    <p className="text-sm text-red-500">{errors.new_password_confirmation}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-yellow-400 px-6 py-2 text-white hover:bg-yellow-500 disabled:opacity-50"
                            >
                                {processing ? 'Mengubah...' : 'Ubah Password'}
                            </button>
                        </form>
                    </div>

                    {/* === Zona Berbahaya === */}
                    <div className="rounded-xl border border-red-300 bg-red-100 p-6 shadow">
                        <h2 className="mb-2 text-lg font-bold text-red-700">Zona Berbahaya</h2>
                        <p className="mb-4 text-sm text-red-600">
                            Menghapus akun Anda bersifat permanen dan tidak dapat dibatalkan. Semua data dan riwayat Anda akan hilang selamanya.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="rounded-lg bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-600"
                        >
                            Hapus Akun Saya
                        </button>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}