import DashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { HiCamera, HiUser } from 'react-icons/hi';

// Interface Form sesuai data Admin
interface ProfileForm {
    nama_admin: string;
    no_telp: string;
    jenis_kelamin: string;
    email: string;
    foto: File | null;
    _method?: string;
}

export default function ProfileAdmin() {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;
    const success = flash?.success;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Setup Form
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<ProfileForm>({
        nama_admin: user.nama_admin || user.name || '',
        no_telp: user.no_telp || '',
        jenis_kelamin: user.jenis_kelamin || '',
        email: user.email || '',
        foto: null,
        _method: 'PATCH', // Wajib untuk upload file via method spoofing
    });

    // Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Handle Submit
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/admin/updateProfile', {
            preserveScroll: true,
            forceFormData: true, // Wajib true untuk upload file
            onSuccess: () => {
                setPreviewImage(null); // Reset preview setelah sukses
            },
        });
    };

    // Helper Display Image
    const getProfileImage = () => {
        if (previewImage) return previewImage;
        if (user.foto) return `/storage/${user.foto}`;
        return null;
    };

    return (
        <DashboardLayout>
            <Head title="Profile Admin" />

            <div className="space-y-6 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
                        <p className="text-sm text-gray-500">Kelola informasi akun administrator Anda.</p>
                    </div>
                </div>

                {/* Alert Success */}
                {(success || recentlySuccessful) && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 shadow-sm">✅ {success || 'Perubahan berhasil disimpan!'}</div>}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* --- KOLOM KIRI: KARTU PROFIL --- */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Card Foto */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="group relative mb-4">
                                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-yellow-50 bg-gray-100 shadow-md">
                                        {getProfileImage() ? <img src={getProfileImage()!} alt="Profile" className="h-full w-full object-cover" /> : <HiUser className="h-16 w-16 text-gray-300" />}
                                    </div>

                                    {/* Overlay Camera Icon */}
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute right-0 bottom-0 rounded-full bg-yellow-400 p-2.5 text-white shadow-md transition-transform hover:scale-110 hover:bg-yellow-500" title="Ganti Foto">
                                        <HiCamera className="h-5 w-5" />
                                    </button>
                                </div>

                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                {errors.foto && <div className="mt-1 text-xs text-red-500">{errors.foto}</div>}

                                <h5 className="text-xl font-bold text-gray-900">{data.nama_admin}</h5>
                                <span className="text-sm text-gray-500">{data.email}</span>
                                <span className="mt-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Administrator</span>
                            </div>
                        </div>

                        {/* Card Info Statis */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h4 className="mb-4 font-bold text-gray-800">Informasi Akun</h4>
                            <div className="space-y-4">
                                <InfoRow label="ID Admin" value={user.id_admin || `#${user.id}`} />
                                <InfoRow label="Status" value="Aktif" />
                                <InfoRow label="Bergabung" value={new Date(user.created_at).toLocaleDateString('id-ID')} />
                            </div>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: FORM EDIT --- */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-xl font-bold text-gray-800">Edit Data Diri</h3>
                                <p className="text-sm text-gray-500">Perbarui informasi pribadi Anda di sini.</p>
                            </div>

                            <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Nama Lengkap */}
                                <Input id="nama_admin" label="Nama Lengkap" value={data.nama_admin} onChange={(e) => setData('nama_admin', e.target.value)} error={errors.nama_admin} placeholder="Masukkan nama lengkap" />

                                {/* No Telepon */}
                                <Input id="no_telp" label="Nomor Telepon" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} error={errors.no_telp} placeholder="08..." />

                                {/* Jenis Kelamin */}
                                <Select id="jenis_kelamin" label="Jenis Kelamin" value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} options={['Pria', 'Wanita']} error={errors.jenis_kelamin} />

                                {/* Email (Read Only) */}
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Email</label>
                                    <input type="email" className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-500 focus:outline-none" value={data.email} readOnly />
                                    <p className="mt-1 text-[10px] text-gray-400">*Email tidak dapat diubah sembarangan.</p>
                                </div>

                                {/* Tombol Simpan */}
                                <div className="col-span-1 flex items-center justify-end pt-4 md:col-span-2">
                                    <button type="submit" disabled={processing} className="rounded-xl bg-yellow-400 px-8 py-3 font-bold text-gray-900 shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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

// --- REUSABLE COMPONENTS (Agar Kode Lebih Bersih) ---

function Input({ label, id, type = 'text', value, onChange, error, placeholder }: { label: string; id: string; type?: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; placeholder?: string }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-bold text-gray-700">
                {label}
            </label>
            <input
                id={id}
                type={type}
                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function Select({ label, id, value, onChange, options, error }: { label: string; id: string; value: any; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; error?: string }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-bold text-gray-700">
                {label}
            </label>
            <div className="relative">
                <select id={id} className={`w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`} value={value} onChange={onChange}>
                    <option value="">Pilih {label}</option>
                    {options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-gray-50 pb-2 text-sm last:border-0 last:pb-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800">{value || '-'}</span>
        </div>
    );
}
