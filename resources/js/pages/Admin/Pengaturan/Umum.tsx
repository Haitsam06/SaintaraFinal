import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { HiArrowLeft, HiEye, HiEyeOff } from 'react-icons/hi'; // Tambah HiArrowLeft

// Interface Form Data
interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function PengaturanUmum() {
    const { data, setData, put, processing, errors, reset } = useForm<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put('/admin/pengaturan/umum', {
            onSuccess: () => reset(),
        });
    };

    // Helper untuk toggle visibility password
    const PasswordInput = ({ label, value, onChange, error, show, onToggle }: { label: string; value: string; onChange: (val: string) => void; error?: string; show: boolean; onToggle: () => void }) => (
        <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
            <div className="relative">
                <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border-gray-300 p-3 pr-10 focus:border-yellow-400 focus:ring-yellow-400" placeholder={`Masukkan ${label.toLowerCase()}`} />
                <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                    {show ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
            </div>
            {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
        </div>
    );

    return (
        <AdminDashboardLayout>
            <Head title="Ganti Password" />
            <div className="max-w-8xl font-poppins">
                {/* --- HEADER DENGAN TOMBOL KEMBALI --- */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-900">Ganti Password</h2>
                </div>
                <div className="mb-4">
                    <Link href="/admin/pengaturan" className="flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-900">
                        <HiArrowLeft className="h-4 w-4" />
                        Kembali ke Menu Pengaturan
                    </Link>
                </div>
                {/* ------------------------------------ */}

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                    <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                        <p>
                            <strong>Catatan:</strong> Pastikan password baru Anda kuat (minimal 8 karakter, kombinasi huruf dan angka).
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <PasswordInput label="Password Saat Ini" value={data.current_password} onChange={(val) => setData('current_password', val)} error={errors.current_password} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />

                        <hr className="border-gray-100" />

                        <PasswordInput label="Password Baru" value={data.password} onChange={(val) => setData('password', val)} error={errors.password} show={showNew} onToggle={() => setShowNew(!showNew)} />

                        <PasswordInput label="Konfirmasi Password Baru" value={data.password_confirmation} onChange={(val) => setData('password_confirmation', val)} error={errors.password_confirmation} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />

                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="rounded-full bg-yellow-400 px-8 py-3 font-bold text-gray-900 shadow-md transition-all hover:bg-yellow-500 disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan Password Baru'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
