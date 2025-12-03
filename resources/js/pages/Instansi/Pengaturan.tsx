import InstansiLayout from "@/layouts/dashboardLayoutInstansi";
import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { HiLockClosed } from 'react-icons/hi';

interface InstansiData {
    id_instansi: string;
    nama_instansi: string;
    email: string;
    alamat: string | null;
    no_telepon?: string | null;
    foto?: string | null;
}

export default function Pengaturan({ instansi }: { instansi: InstansiData }) {

    // FORM PASSWORD 
    const {
        data: dataPass,
        setData: setDataPass,
        put: putPass,
        processing: processingPass,
        errors: errorsPass,
        reset: resetPass
    } = useForm({
        current_password: '', // Tetap ada di state sesuai kode asli
        new_password: '',
        new_password_confirmation: '',
    });

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        putPass(route('password.update'), { // Pastikan route sesuai dengan backend Anda
            onSuccess: () => resetPass(),
        });
    };

    // --- INPUT COMPONENT HELPER (Restyled) ---
    const InputGroup = ({ label, error, children }: any) => (
        <div className="group">
            <label className="mb-2 block text-sm font-semibold text-gray-700 group-focus-within:text-yellow-600 transition-colors">
                {label}
            </label>
            {children}
            {error && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block h-1 w-1 rounded-full bg-red-500"/> {error}
            </p>}
        </div>
    );

    return (
        <InstansiLayout>
            <Head title="Pengaturan Instansi" />
            
            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                
                {/* Header Section - Lebih Clean */}
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pengaturan Akun</h1>
                    <p className="mt-2 text-base text-gray-500">
                        Kelola informasi keamanan dan preferensi akun instansi Anda di sini.
                    </p>
                </div>

                {/* Card Password - Desain Terpusat & Modern */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* Card Header */}
                    <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-start sm:items-center gap-4">
                        <div className="flex-shrink-0 rounded-xl bg-yellow-100 p-3 text-yellow-600">
                            <HiLockClosed className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Ubah Kata Sandi</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Pastikan menggunakan kata sandi yang kuat dan aman.
                            </p>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={submitPassword} className="space-y-6">
                            
                            <InputGroup label="Password Baru" error={errorsPass.new_password}>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={dataPass.new_password}
                                    onChange={(e) => setDataPass('new_password', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                                />
                            </InputGroup>

                            <InputGroup label="Konfirmasi Password" error={errorsPass.new_password_confirmation}>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={dataPass.new_password_confirmation}
                                    onChange={(e) => setDataPass('new_password_confirmation', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                                />
                            </InputGroup>

                            <div className="pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="submit"
                                    disabled={processingPass}
                                    className="w-full sm:w-auto flex justify-center items-center rounded-xl bg-yellow-400 px-8 py-3 text-sm font-bold text-gray-900 shadow-sm hover:bg-yellow-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ml-auto"
                                >
                                    {processingPass ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </span>
                                    ) : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </InstansiLayout>
    );
}