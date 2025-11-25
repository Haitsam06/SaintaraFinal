import React from 'react';
import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

type TestPackage = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    token_cost: number;
};

type ParticipantInput = {
    full_name: string;
    nickname: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    gender: string;
    blood_type: string;
};

type PageProps = {
    test_package: TestPackage;
    errors: Record<string, string>;
    wa_url?: string; // URL WA dari backend (optional)
    flash?: {
        success?: string;
    };
};

export default function FormTesInstansi() {
    const { props } = usePage<PageProps>();
    const { test_package, errors, wa_url } = props;

    // begitu wa_url berubah & ada nilainya → buka WhatsApp
    React.useEffect(() => {
        if (wa_url) {
            window.open(wa_url, '_blank');
        }
    }, [wa_url]);

    const { data, setData, post, processing } = useForm<{
        test_package_id: string;
        nama_golongan: string;
        file: File | null;
        participants: ParticipantInput[];
    }>({
        test_package_id: test_package.id,
        nama_golongan: '',
        file: null,
        participants: [
            {
                full_name: '',
                nickname: '',
                email: '',
                phone: '',
                country: '',
                city: '',
                gender: '',
                blood_type: '',
            },
        ],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('file', file);
    };

    const handleParticipantChange = (
        index: number,
        field: keyof ParticipantInput,
        value: string
    ) => {
        const copy = [...data.participants];
        copy[index] = { ...copy[index], [field]: value };
        setData('participants', copy);
    };

    const addParticipantRow = () => {
        setData('participants', [
            ...data.participants,
            {
                full_name: '',
                nickname: '',
                email: '',
                phone: '',
                country: '',
                city: '',
                gender: '',
                blood_type: '',
            },
        ]);
    };

    const removeParticipantRow = (index: number) => {
        if (data.participants.length === 1) return;
        const copy = [...data.participants];
        copy.splice(index, 1);
        setData('participants', copy);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/instansi/uploadExcel', {
            forceFormData: true, // penting untuk file upload
            preserveScroll: true,
        });
    };

    const participantsError = errors['participants'] ?? '';

    return (
        <InstansiLayout>
            <Head title="Input Peserta Tes Instansi" />

            <div className="space-y-8 font-poppins text-black">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Input Peserta Tes – {test_package.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Anda dapat mengupload file Excel dan/atau mengisi data peserta
                            secara manual. Sistem akan menggabungkan semuanya.
                        </p>
                    </div>
                    <Link
                        href="/instansi/tesInstansi"
                        className="text-sm text-saintara-yellow hover:underline"
                    >
                        &larr; Kembali ke Daftar Paket
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100">
                    {/* Info Paket */}
                    <div className="mb-6 rounded-2xl bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Paket Tes
                            </p>
                            <h3 className="text-lg font-bold text-gray-900">
                                {test_package.title}
                            </h3>
                            {test_package.description && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {test_package.description}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Biaya per peserta</p>
                            <p className="text-xl font-extrabold text-gray-900">
                                {test_package.token_cost} Token
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="space-y-8"
                    >
                        {/* Nama Golongan / Batch */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Golongan / Batch
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                placeholder="Contoh: Batch Training November 2025"
                                value={data.nama_golongan}
                                onChange={(e) => setData('nama_golongan', e.target.value)}
                                required
                            />
                            {errors.nama_golongan && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.nama_golongan}
                                </p>
                            )}
                        </div>

                        {/* Bagian 1: Upload Excel */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-800">
                                1. Upload File Excel (Opsional)
                            </h4>
                            <p className="text-xs text-gray-500">
                                Anda dapat mengunduh template, mengisi data peserta di Excel,
                                lalu upload kembali. Jika tidak ingin menggunakan Excel, lewati
                                bagian ini dan isi peserta secara manual di bawah.
                            </p>

                            <div className="flex flex-col md:flex-row gap-3">
                                <a
                                    href="/templates/peserta_instansi.xlsx"
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    📥 Download Template Excel
                                </a>

                                <label className="flex-1 inline-flex items-center gap-3 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-xs md:text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                                    <span>📂 Pilih File Excel</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                    />
                                    {data.file && (
                                        <span className="text-[11px] text-gray-700 truncate max-w-[160px]">
                                            {data.file.name}
                                        </span>
                                    )}
                                </label>
                            </div>

                            {errors.file && (
                                <p className="mt-1 text-xs text-red-500">{errors.file}</p>
                            )}
                        </div>

                        {/* Bagian 2: Peserta Manual */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-800">
                                2. Tambah Peserta Manual (Opsional)
                            </h4>
                            <p className="text-xs text-gray-500">
                                Isi data peserta di bawah ini. Anda dapat menambahkan beberapa
                                peserta sekaligus. Minimal harus ada salah satu: file Excel
                                atau minimal satu peserta manual.
                            </p>

                            {participantsError && (
                                <p className="mt-1 text-xs text-red-500">
                                    {participantsError}
                                </p>
                            )}

                            <div className="space-y-4">
                                {data.participants.map((p, idx) => {
                                    const prefix = `participants.${idx}`;
                                    return (
                                        <div
                                            key={idx}
                                            className="rounded-2xl border border-gray-200 p-4 bg-gray-50/60"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-xs font-semibold text-gray-600">
                                                    Peserta #{idx + 1}
                                                </p>
                                                {data.participants.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeParticipantRow(idx)}
                                                        className="text-[11px] text-red-500 hover:underline"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Nama Lengkap */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Nama Lengkap
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.full_name}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'full_name',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {errors[`${prefix}.full_name`] && (
                                                        <p className="mt-1 text-[11px] text-red-500">
                                                            {errors[`${prefix}.full_name`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Nama Panggilan */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Nama Panggilan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.nickname}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'nickname',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.email}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'email',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {errors[`${prefix}.email`] && (
                                                        <p className="mt-1 text-[11px] text-red-500">
                                                            {errors[`${prefix}.email`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* No. Telepon */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        No. Telepon
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.phone}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'phone',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Negara */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Negara
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.country}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'country',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Kota / Divisi */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Kota / Divisi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.city}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'city',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {/* Jenis Kelamin */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Jenis Kelamin
                                                    </label>
                                                    <select
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.gender}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'gender',
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">Pilih</option>
                                                        <option value="L">Laki-laki</option>
                                                        <option value="P">Perempuan</option>
                                                    </select>
                                                </div>

                                                {/* Golongan Darah */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Golongan Darah
                                                    </label>
                                                    <select
                                                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-black focus:border-saintara-yellow focus:ring-saintara-yellow"
                                                        value={p.blood_type}
                                                        onChange={(e) =>
                                                            handleParticipantChange(
                                                                idx,
                                                                'blood_type',
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">Pilih</option>
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="AB">AB</option>
                                                        <option value="O">O</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={addParticipantRow}
                                className="mt-2 inline-flex items-center rounded-full border border-dashed border-gray-400 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                                + Tambah Peserta
                            </button>
                        </div>

                        {/* Tombol Submit */}
                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full bg-saintara-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {processing
                                    ? 'Memproses Peserta...'
                                    : 'Simpan Peserta & Kirim ke WhatsApp Admin'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </InstansiLayout>
    );
}
