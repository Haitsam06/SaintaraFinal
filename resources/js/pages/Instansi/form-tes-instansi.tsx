import React from 'react';
import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, useForm, usePage } from '@inertiajs/react';

type ParticipantForm = {
    full_name: string;
    nickname: string;
    email: string;
    phone: string;
    blood_type: string;
    country: string;
    city: string;
    gender: string; // "L" atau "P"
};

type FormData = {
    test_package_id: string;
    nama_golongan: string;
    file: File | null;
    participants: ParticipantForm[];
};

const makeEmptyParticipant = (): ParticipantForm => ({
    full_name: '',
    nickname: '',
    email: '',
    phone: '',
    blood_type: '',
    country: '',
    city: '',
    gender: '',
});

export default function FormInstansi() {
    const { url, props } = usePage<any>();

    // Ambil test_package_id dari query string: /instansi/formTesInstansi?test_package_id=1
    const searchParams = new URLSearchParams(url.split('?')[1] ?? '');
    const testPackageIdParam = searchParams.get('test_package_id') ?? '';

    const { data, setData, post, processing, errors } = useForm<FormData>({
        test_package_id: testPackageIdParam,
        nama_golongan: '',
        file: null,
        participants: [makeEmptyParticipant()],
    });

    const participants = data.participants;

    const addParticipant = () => {
        setData('participants', [...participants, makeEmptyParticipant()]);
    };

    const removeParticipant = (index: number) => {
        if (participants.length > 1) {
            setData(
                'participants',
                participants.filter((_, i) => i !== index),
            );
        }
    };

    const updateField = (
        index: number,
        field: keyof ParticipantForm,
        value: string,
    ) => {
        const updated = [...participants];
        updated[index] = { ...updated[index], [field]: value };
        setData('participants', updated);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('file', file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // URL sesuai dengan routes/web.php
        post('/instansi/tesInstansi/upload-excel', {
            forceFormData: true,
        });
    };

    const flash = (props as any).flash ?? {};

    return (
        <InstansiLayout>
            <Head title="Tes Kepribadian Instansi" />

            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 px-6 py-10 text-black"
            >
                <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-lg">
                    <h1 className="text-center text-2xl font-bold text-yellow-600">
                        Tes Kepribadian Instansi
                    </h1>
                    <p className="mb-6 text-center text-gray-600">
                        Tambahkan peserta secara manual, unggah Excel, atau
                        keduanya.
                    </p>

                    {/* FLASH MESSAGE */}
                    {flash.success && (
                        <div className="mb-4 rounded-lg border border-green-400 bg-green-100 p-3 text-sm font-semibold text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* INFO PAKET & GOLONGAN */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                ID Paket Tes (test_package_id)
                            </label>
                            <input
                                type="text"
                                value={data.test_package_id}
                                onChange={(e) =>
                                    setData('test_package_id', e.target.value)
                                }
                                readOnly={!!testPackageIdParam}
                                className="w-full rounded-md border p-2 text-sm"
                            />
                            {errors.test_package_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.test_package_id}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Nilai ini otomatis terisi saat Anda klik
                                &quot;Gunakan Paket&quot; dari halaman Daftar
                                Tes.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                Nama Golongan / Batch
                            </label>
                            <input
                                type="text"
                                value={data.nama_golongan}
                                onChange={(e) =>
                                    setData('nama_golongan', e.target.value)
                                }
                                placeholder="Contoh: Batch Marketing Desember"
                                className="w-full rounded-md border p-2 text-sm"
                            />
                            {errors.nama_golongan && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.nama_golongan}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* UPLOAD EXCEL */}
                    <div className="mb-8">
                        <label className="mb-2 block font-semibold">
                            Upload Excel (.xlsx){' '}
                            <span className="text-xs text-gray-500">
                                (opsional)
                            </span>
                        </label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="w-full rounded-md border p-2 text-sm"
                        />
                        {errors.file && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.file}
                            </p>
                        )}

                        {data.file && (
                            <div className="mt-4 rounded-lg border border-green-400 bg-green-100 p-4 text-sm">
                                📄 File terpilih:{' '}
                                <b>{(data.file as File).name}</b>
                            </div>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                            Kolom yang diharapkan:
                            <br />
                            A: Nama Lengkap, B: Nama Panggilan, C: Email, D:
                            No. Telp, E: Negara, F: Kota, G: Jenis Kelamin, H:
                            Golongan Darah, I: Tanggal Lahir.
                        </p>
                    </div>

                    {/* FORM PESERTA DINAMIS (INPUT MANUAL) */}
                    <h2 className="mb-3 text-lg font-bold">
                        Daftar Peserta (Input Manual)
                    </h2>

                    {errors.participants && (
                        <p className="mb-2 text-xs text-red-600">
                            {errors.participants as string}
                        </p>
                    )}

                    {participants.map((p, index) => (
                        <div
                            key={index}
                            className="mb-4 rounded-xl border bg-gray-50 p-4"
                        >
                            <div className="mb-2 flex justify-between">
                                <h3 className="font-semibold">
                                    Peserta #{index + 1}
                                </h3>

                                {participants.length > 1 && (
                                    <button
                                        type="button"
                                        className="text-sm text-red-600 underline"
                                        onClick={() => removeParticipant(index)}
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <input
                                    placeholder="Nama Lengkap"
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.full_name}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'full_name',
                                            e.target.value,
                                        )
                                    }
                                />
                                <input
                                    placeholder="Nama Panggilan"
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.nickname}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'nickname',
                                            e.target.value,
                                        )
                                    }
                                />
                                <input
                                    placeholder="E-mail"
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.email}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                />
                                <input
                                    placeholder="Nomor Telepon"
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.phone}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'phone',
                                            e.target.value,
                                        )
                                    }
                                />

                                <select
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.blood_type}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'blood_type',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">Golongan Darah</option>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>AB</option>
                                    <option>O</option>
                                </select>

                                <input
                                    placeholder="Negara"
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.country}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'country',
                                            e.target.value,
                                        )
                                    }
                                />
                                <input
                                    placeholder="Kota"
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.city}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'city',
                                            e.target.value,
                                        )
                                    }
                                />

                                <select
                                    className="input w-full rounded-md border p-2 text-sm"
                                    value={p.gender}
                                    onChange={(e) =>
                                        updateField(
                                            index,
                                            'gender',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">Jenis Kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addParticipant}
                        className="mb-6 w-full rounded-lg bg-yellow-500 py-2 font-semibold transition hover:bg-yellow-600"
                    >
                        + Tambah Peserta
                    </button>

                    {/* TOMBOL SUBMIT */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing
                            ? 'Memproses...'
                            : 'Simpan dan Lanjutkan Tes'}
                    </button>

                    {/* PREVIEW TABEL (INPUT MANUAL) */}
                    <h2 className="mt-10 mb-3 text-lg font-bold">
                        Preview Data (Input Manual)
                    </h2>
                    <table className="w-full text-sm border">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="border p-2">Nama</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Kota</th>
                                <th className="border p-2">Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((p, i) => (
                                <tr key={i}>
                                    <td className="border p-2">
                                        {p.full_name}
                                    </td>
                                    <td className="border p-2">{p.email}</td>
                                    <td className="border p-2">{p.city}</td>
                                    <td className="border p-2">
                                        {p.gender === 'L'
                                            ? 'Laki-laki'
                                            : p.gender === 'P'
                                            ? 'Perempuan'
                                            : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
        </InstansiLayout>
    );
}
