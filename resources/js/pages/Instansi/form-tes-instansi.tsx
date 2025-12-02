import React, { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dashboardLayoutInstansi";

type TestPackage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  token_cost: number;
};

type Participant = {
  full_name: string;
  nickname: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  gender: string;
  blood_type: string;
};

interface PageProps {
  test_package: TestPackage;
  saldo_token: number;
  wa_url?: string | null;
  success?: string | null;
  errors: Record<string, string>;
}

export default function FormTesInstansi() {
  const { test_package, saldo_token, wa_url, success, errors } =
    usePage<PageProps>().props;

  // form state dengan Inertia
  const { data, setData, post, processing } = useForm<{
    test_package_id: string;
    nama_golongan: string;
    file: File | null;
    participants: Participant[];
  }>({
    test_package_id: test_package?.id ?? "",
    nama_golongan: "",
    file: null,
    participants: [
      {
        full_name: "",
        nickname: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        gender: "",
        blood_type: "",
      },
    ],
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handleAddParticipant = () => {
    setData("participants", [
      ...data.participants,
      {
        full_name: "",
        nickname: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        gender: "",
        blood_type: "",
      },
    ]);
  };

  const handleRemoveParticipant = (index: number) => {
    if (data.participants.length === 1) return;
    const copy = [...data.participants];
    copy.splice(index, 1);
    setData("participants", copy);
  };

  const handleChangeParticipant = (
    index: number,
    field: keyof Participant,
    value: string
  ) => {
    const copy = [...data.participants];
    copy[index] = { ...copy[index], [field]: value };
    setData("participants", copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // hitung peserta manual saja (Excel akan dicek totalnya di backend)
    const manualCount = data.participants.filter(
      (p) => p.full_name || p.email
    ).length;

    if (!data.file && manualCount === 0) {
      setLocalError(
        "Isi minimal satu peserta manual atau upload file Excel."
      );
      return;
    }

    // cek kasar token terhadap peserta manual (validasi penuh tetap di backend)
    if (manualCount >= saldo_token) {
      setLocalError(
        `Token anda tidak mencukupi untuk peserta manual (${manualCount}) dengan saldo token ${saldo_token}.`
      );
      // tetap boleh submit kalau mau, karena Excel + total final dicek backend
      // return;  // kalau ingin benar-benar blokir di frontend, buka komentar ini
    }

    post("/instansi/uploadPeserta", {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <DashboardLayout>
      <Head title="Input Peserta Tes Instansi" />

      <div className="min-h-screen bg-[#F5F7FB] px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Paket */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">PAKET TES</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {test_package.title}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {test_package.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Biaya per peserta</p>
              <p className="text-xl font-extrabold text-yellow-500">
                {formatRupiah(test_package.token_cost)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Saldo token instansi:{" "}
                <span className="font-semibold">{saldo_token}</span> token
              </p>
            </div>
          </div>

          {/* Notifikasi sukses & WA */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <span>{success}</span>
              {wa_url && (
                <a
                  href={wa_url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-4 inline-flex items-center px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                >
                  Kirim ke WhatsApp Admin
                </a>
              )}
            </div>
          )}

          {/* Error Lokal */}
          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3">
              {localError}
            </div>
          )}

          {/* Error dari backend */}
          {errors.participants && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3">
              {errors.participants}
            </div>
          )}
          {errors.file && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3">
              {errors.file}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm p-6 space-y-8"
          >
            {/* Nama Golongan / Batch */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Nama Golongan / Batch
              </label>
              <input
                type="text"
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Contoh: Batch Training November 2025"
                value={data.nama_golongan}
                onChange={(e) => setData("nama_golongan", e.target.value)}
                required
              />
            </div>

            {/* Upload Excel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    1. Upload File Excel (Opsional)
                  </p>
                  <p className="text-xs text-gray-500">
                    Anda dapat mengunduh template, mengisi data peserta di
                    Excel, lalu upload kembali.
                  </p>
                </div>

                {/* PENTING: gunakan <a> biasa untuk download file */}
                <a
                  href="/instansi/downloadFormTemplate"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Unduh Template Excel
                </a>
              </div>

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) =>
                  setData("file", e.target.files ? e.target.files[0] : null)
                }
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              <p className="text-[11px] text-gray-400">
                Maksimal 5 MB, format .xlsx atau .xls
              </p>
            </div>

            {/* Peserta Manual */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  2. Tambah Peserta Manual (Opsional)
                </p>
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="text-xs font-semibold text-yellow-600 hover:text-yellow-700"
                >
                  + Tambah Peserta
                </button>
              </div>

              <div className="space-y-4">
                {data.participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-700">
                        Peserta #{idx + 1}
                      </p>
                      {data.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(idx)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-600">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.full_name}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "full_name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600">
                          Nama Panggilan
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.nickname}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "nickname",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.email}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "email",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600">
                          No. Telepon
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.phone}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "phone",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600">
                          Negara
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.country}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "country",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600">
                          Kota / Divisi
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.city}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "city",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600">
                          Jenis Kelamin
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.gender}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "gender",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600">
                          Golongan Darah
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          value={p.blood_type}
                          onChange={(e) =>
                            handleChangeParticipant(
                              idx,
                              "blood_type",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                Minimal salah satu: upload file Excel atau isi minimal satu
                peserta manual.
              </p>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold shadow-md disabled:opacity-60"
              >
                {processing ? "Memproses..." : "Kirim Data Peserta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
