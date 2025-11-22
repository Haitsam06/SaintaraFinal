import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { HiCamera } from 'react-icons/hi';

// --- Interface user dari Inertia ---
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

// --- Props dari Inertia ---
type ProfileProps = {
    name: string;
    age: number;
    [key: string]: any;
};

export default function Profile() {
    const { auth, success } = usePage<ProfileProps>().props;
    const user = auth.user;

    // --- Form state ---
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        _method: 'put',
        new_foto: null as File | null,

        nama_lengkap: user.nama_lengkap,
        nama_panggilan: user.nama_panggilan,
        no_telp: user.no_telp,
        alamat: user.alamat,
        negara: user.negara,
        kota: user.kota,
        jenis_kelamin: user.jenis_kelamin,
        gol_darah: user.gol_darah,
        tgl_lahir: user.tgl_lahir,
    });

    // --- Submit handler ---
    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('personal.profile.update'), {
            preserveScroll: true,
            onSuccess: () => setData('new_foto', null),
        });
    };

    const fotoPreview = data.new_foto ? URL.createObjectURL(data.new_foto) : user.foto;

    return (
        <DashboardLayout>
            <Head title="Profil Pribadi" />

            {/* Flash success */}
            {success || recentlySuccessful ? <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700">Perubahan berhasil disimpan!</div> : null}

            <h1 className="mb-8 text-3xl font-bold text-gray-800">Profil Pribadi</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* ------------------ KIRI ------------------ */}
                <div className="space-y-6">
                    {/* Foto & Nama */}
                    <div className="rounded-xl bg-white p-6 text-center shadow-lg">
                        <div className="relative mx-auto mb-4 h-32 w-32">
                            <img src={fotoPreview || '/memoji-placeholder.png'} className="h-full w-full rounded-full object-cover shadow" />

                            <label htmlFor="foto-upload" className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-yellow-400 p-2 shadow">
                                <HiCamera />
                                <input
                                    id="foto-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const f = e.target.files?.[0] ?? null;
                                        setData('new_foto', f);
                                    }}
                                />
                            </label>
                        </div>

                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    {/* Detail akun */}
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h4 className="mb-4 font-bold">Detail Akun</h4>

                        <InfoRow label="Nama Panggilan" value={user.nama_panggilan} />
                        <InfoRow label="Tanggal Lahir" value={user.tgl_lahir} />
                        <InfoRow label="Golongan Darah" value={user.gol_darah} />
                        <InfoRow label="Negara" value={user.negara} />
                    </div>
                </div>

                {/* ------------------ KANAN: FORM ------------------ */}
                <div className="rounded-xl bg-white p-8 shadow-lg lg:col-span-2">
                    <h3 className="mb-6 text-2xl font-bold">Edit Data Diri</h3>

                    <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input label="Nama Lengkap" id="nama_lengkap" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} error={errors.nama_lengkap} />

                        <Input label="Nama Panggilan" id="nama_panggilan" value={data.nama_panggilan} onChange={(e) => setData('nama_panggilan', e.target.value)} error={errors.nama_panggilan} />

                        <Input label="Tanggal Lahir" id="tgl_lahir" type="date" value={data.tgl_lahir} onChange={(e) => setData('tgl_lahir', e.target.value)} error={errors.tgl_lahir} />

                        <Input label="Nomor Telepon" id="no_telp" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} error={errors.no_telp} />

                        <Select label="Jenis Kelamin" id="jenis_kelamin" value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} options={['Laki-laki', 'Perempuan']} error={errors.jenis_kelamin} />

                        <Select label="Golongan Darah" id="gol_darah" value={data.gol_darah} onChange={(e) => setData('gol_darah', e.target.value)} options={['A', 'B', 'AB', 'O']} error={errors.gol_darah} />

                        <Input label="Negara" id="negara" value={data.negara} onChange={(e) => setData('negara', e.target.value)} error={errors.negara} />

                        <Input label="Kota" id="kota" value={data.kota} onChange={(e) => setData('kota', e.target.value)} error={errors.kota} />

                        {/* Email readonly */}
                        <div>
                            <label>Email</label>
                            <input type="email" className="w-full rounded-lg border bg-gray-200 p-2.5 text-gray-500" value={user.email} readOnly />
                        </div>

                        <div className="col-span-2 flex justify-end">
                            <button type="submit" disabled={processing} className="rounded-lg bg-yellow-400 px-8 py-3 font-bold text-slate-900 hover:bg-yellow-500">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ---------- COMPONENT KECIL (Bersih & rapi) ----------

function Input({ label, id, type = 'text', value, onChange, error }: { label: string; id: string; type?: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <input id={id} type={type} className="w-full rounded-lg border bg-gray-50 p-2.5" value={value} onChange={onChange} />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function Select({ label, id, value, onChange, options, error }: { label: string; id: string; value: any; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; error?: string }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <select id={id} className="w-full rounded-lg border bg-gray-50 p-2.5" value={value} onChange={onChange}>
                <option value="">Pilih {label}</option>
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-sm">
            <span>{label}</span>
            <span className="font-semibold">{value || '-'}</span>
        </div>
    );
}
