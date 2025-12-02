import React from 'react';
import DashboardLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, Link } from '@inertiajs/react';

// Definisi Tipe Data
interface PaketItem {
  id_paket: string;
  nama_paket: string;
  harga: number;
  deskripsi: string;
  jumlah_karakter: number;
  has_token: boolean;
}

interface DaftarTesProps {
  daftar_paket: PaketItem[];
}

export default function DaftarTesInstansi({ daftar_paket = [] }: DaftarTesProps) {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <Head title="Daftar Tes Karakter Instansi" />

      <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#2A2A2A]">
        {/* === HERO SECTION === */}
        <div className="relative bg-black text-white pt-12 pb-24 px-6 rounded-b-[3rem] mb-10 shadow-lg overflow-hidden">
          {/* Dekorasi Background Abstrak */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full opacity-10 blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500 rounded-full opacity-10 blur-3xl -ml-16 -mb-16"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Tes Karakter untuk Instansi Anda
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Pilih paket analisis karakter untuk karyawan atau peserta di instansi Anda.
              Dapatkan insight mendalam untuk pengembangan tim yang lebih efektif.
            </p>
          </div>
        </div>

        {/* === CONTENT GRID === */}
        <div className="max-w-6xl mx-auto px-6 -mt-16 pb-12 relative z-20">
          {daftar_paket.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Belum Ada Paket Instansi</h3>
              <p className="text-gray-500 mt-2">
                Paket tes karakter untuk instansi belum tersedia saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {daftar_paket.map((paket) => {
                const isPremium = paket.nama_paket.toLowerCase().includes('premium');

                return (
                  <div
                    key={paket.id_paket}
                    className={`group relative flex flex-col h-full bg-white rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                      ${
                        isPremium
                          ? 'border-2 border-yellow-400 shadow-yellow-100 ring-4 ring-yellow-50'
                          : 'border border-gray-100 shadow-md'
                      }
                    `}
                  >
                    {/* Badge Status Token */}
                    {paket.has_token && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl shadow-sm z-10 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        TOKEN TERSEDIA
                      </div>
                    )}

                    {/* Badge Rekomendasi (Premium) */}
                    {isPremium && !paket.has_token && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-yellow-400 text-xs font-bold px-4 py-1 rounded-full shadow-lg tracking-wide">
                        REKOMENDASI
                      </div>
                    )}

                    <div className="p-8 flex-1 flex flex-col">
                      {/* Header Paket */}
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {paket.nama_paket}
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 h-10">
                          {paket.deskripsi}
                        </p>
                      </div>

                      {/* Harga */}
                      <div className="mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-extrabold text-black">
                            {formatRupiah(paket.harga)}
                          </span>
                          <span className="text-gray-400 ml-2 font-medium">/ peserta</span>
                        </div>
                      </div>

                      {/* Fitur List */}
                      <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                            <svg
                              className="w-3 h-3 text-yellow-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-600">
                            Laporan Lengkap{' '}
                            <strong className="text-gray-900">
                              {paket.jumlah_karakter} Karakter
                            </strong>{' '}
                            per peserta
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                            <svg
                              className="w-3 h-3 text-yellow-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-600">Analisis Karakter Alami</span>
                        </li>
                        {isPremium && (
                          <li className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                              <svg
                                className="w-3 h-3 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600">
                              Dukungan analisis khusus tim instansi
                            </span>
                          </li>
                        )}
                      </ul>

                      {/* Tombol Aksi */}
                      <div className="mt-auto">
                        {paket.has_token ? (
                          <Link
                            href={`/instansi/formTesInstansi?paket_id=${paket.id_paket}`}
                            className="block w-full"
                          >
                            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                              Mulai Tes Sekarang
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </button>
                          </Link>
                        ) : (
                          <Link
                            href="/instansi/transaksiInstansi"
                            className="block w-full"
                          >
                            <button
                              className={`w-full py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 
                                ${
                                  isPremium
                                    ? 'bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500'
                                    : 'bg-white border-gray-200 text-gray-900 hover:border-black hover:text-black'
                                }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                              </svg>
                              Beli Token Instansi
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
