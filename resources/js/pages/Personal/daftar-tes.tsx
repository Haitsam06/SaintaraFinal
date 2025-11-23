import React from 'react';
import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, Link } from '@inertiajs/react';

// Definisi Tipe Data dari Controller
interface PaketItem {
  id_paket: string;
  nama_paket: string;
  harga: number;
  deskripsi: string;
  jumlah_karakter: number;
  has_token: boolean; // Status: Punya token atau tidak?
}

interface DaftarTesProps {
  daftar_paket: PaketItem[];
}

export default function DaftarTesKarakter({ daftar_paket = [] }: DaftarTesProps) {
  
  // Helper format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <Head title="Daftar Tes Karakter" />

      <div className="p-6 min-h-screen bg-gray-50/30">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-2xl font-bold text-[#2A2A2A]">
                Daftar Tes Karakter
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Pilih paket tes yang sesuai dengan kebutuhan analisis karakter Anda.
                </p>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          
          {/* Cek jika paket kosong */}
          {daftar_paket.length === 0 ? (
             <div className="text-center py-10 text-gray-500">
                <p>Tidak ada paket tes tersedia saat ini.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {daftar_paket.map((paket) => (
                <div 
                    key={paket.id_paket}
                    className="group flex flex-col justify-between bg-yellow-400 p-6 rounded-xl shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                    <div>
                        <h2 className="text-xl font-bold mb-2 text-[#2A2A2A]">{paket.nama_paket}</h2>
                        <p className="text-[#2A2A2A] mb-4 text-sm min-h-[40px] line-clamp-2">
                            {paket.deskripsi}
                        </p>
                        <p className="text-2xl font-bold text-[#2A2A2A] mb-6">
                            {formatRupiah(paket.harga)}
                        </p>
                        
                        {/* List Fitur Dinamis */}
                        <div className="text-left text-[#2A2A2A] space-y-2 mb-8 bg-yellow-300/50 p-4 rounded-lg text-sm">
                            <p className="flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                Laporan {paket.jumlah_karakter} Karakter
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                Analisis Karakter Alami
                            </p>
                            {/* Fitur Tambahan Khusus Premium */}
                            {paket.nama_paket.toLowerCase().includes('premium') && (
                                <p className="flex items-center gap-2 font-semibold">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                    Konsultasi Ahli
                                </p>
                            )}
                        </div>
                    </div>

                    {/* === LOGIKA KUNCI: TOMBOL BERUBAH SESUAI HAS_TOKEN === */}
                    {paket.has_token ? (
                        // KONDISI 1: Punya Token -> Link ke Form Tes
                        <Link href={`/personal/formTes?paket_id=${paket.id_paket}`}> 
                            <button className="w-full bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                Mulai Tes
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </Link>
                    ) : (
                        // KONDISI 2: Tidak Punya Token -> Link ke Halaman Beli Token
                        <Link href="/personal/transaksiTokenPersonal"> 
                            <button className="w-full bg-white/80 text-yellow-900 border-2 border-yellow-900/10 px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Beli Token
                            </button>
                        </Link>
                    )}
                </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}