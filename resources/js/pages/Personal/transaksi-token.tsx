import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, router } from '@inertiajs/react';

// === 1. DEFINISI TIPE DATA ===
interface Paket {
    id_paket: string;
    nama_paket: string;
    harga: number;
    deskripsi: string;
    jumlah_karakter: number;
}

interface RincianTokenItem {
    id_paket: string;
    nama_paket: string;
    total: number;
}

interface RiwayatItem {
    id: string;
    nama_paket: string;
    tanggal: string;
    jumlah_bayar: number;
    status: 'berhasil' | 'menunggu' | 'gagal' | 'kadaluarsa';
}

interface TransaksiPageProps {
    saldo_token: number;
    rincian_token: RincianTokenItem[];
    riwayat: RiwayatItem[];
    daftar_paket: Paket[];
    flash: {
        success?: string;
        error?: string;
    };
}

export default function TransaksiDanToken({ 
    saldo_token = 0, 
    rincian_token = [], 
    riwayat = [], 
    daftar_paket = [], 
    flash 
}: TransaksiPageProps) {
    
    // === STATE MANAGEMENT ===
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPaket, setSelectedPaket] = useState<Paket | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // === HELPER FUNCTIONS ===
    const formatRupiah = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'berhasil': return 'bg-green-100 text-green-700 border-green-200';
            case 'menunggu': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'gagal': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    // Logic Quantity
    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

    // Logic Pilih Paket
    const handleSelectPaket = (paket: Paket) => {
        setSelectedPaket(paket);
        setQuantity(1);
    };

    // Logic Checkout
    const handleCheckout = () => {
        if (!selectedPaket) return alert("Silakan pilih paket terlebih dahulu!");
        if (quantity <= 0) return alert("Jumlah token minimal 1");

        setIsLoading(true);

        router.post('/personal/transaksi/checkout', {
            paket_id: selectedPaket.id_paket,
            quantity: quantity,
            total_harga: selectedPaket.harga * quantity
        }, {
            onSuccess: () => {
                setIsLoading(false);
                setIsModalOpen(false);
                setQuantity(0);
                setSelectedPaket(null);
            },
            onError: () => {
                setIsLoading(false);
                alert("Terjadi kesalahan saat memproses transaksi.");
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title="Dompet & Transaksi" />

            <div className="p-6 min-h-screen bg-[#FAFAFA] font-sans text-[#2A2A2A]">

                {/* === NOTIFIKASI === */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r shadow-sm flex justify-between items-center animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{flash.success}</p>
                            </div>
                        </div>
                        <button onClick={(e) => e.currentTarget.parentElement!.style.display = 'none'} className="text-green-500 hover:text-green-700">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                )}
                
                {/* === HEADER SECTION === */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dompet & Transaksi</h1>
                        <p className="text-gray-500 mt-1">Kelola token dan pantau riwayat pembelian Anda.</p>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span className="mr-2 text-yellow-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Top Up Token
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* === LEFT COLUMN (TOKEN STATUS) === */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* 1. HERO CARD: Total Saldo */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-8 text-white shadow-xl">
                            {/* Dekorasi Background */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-black opacity-10 blur-3xl"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-yellow-100 font-medium text-sm uppercase tracking-wider mb-1">Total Saldo Aktif</p>
                                    <h2 className="text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                        {saldo_token} <span className="text-2xl font-medium opacity-80">Token</span>
                                    </h2>
                                    <p className="mt-2 text-sm text-white opacity-90">Token ini dapat digunakan untuk semua jenis tes.</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 2. GRID RINCIAN PAKET */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-black rounded-full"></span>
                                Rincian Paket Anda
                            </h3>
                            
                            {rincian_token.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {rincian_token.map((item, idx) => (
                                        <div key={idx} className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-yellow-300 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                            
                                            <div className="relative z-10">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Paket</p>
                                                <h4 className="font-bold text-lg text-gray-800 mb-3">{item.nama_paket}</h4>
                                                
                                                <div className="flex items-end gap-1">
                                                    <span className="text-4xl font-bold text-black">{item.total}</span>
                                                    <span className="text-sm font-medium text-gray-500 mb-1.5">Tiket</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-200 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">Belum ada paket token yang tersedia.</p>
                                    <button onClick={() => setIsModalOpen(true)} className="text-yellow-600 font-bold text-sm mt-2 hover:underline">Beli Paket Sekarang</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === RIGHT COLUMN (HISTORY) === */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[600px]">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Riwayat Transaksi
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                {riwayat.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm py-10">
                                        <svg className="w-10 h-10 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        <p>Belum ada riwayat pembelian.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {riwayat.map((trx, index) => (
                                            <div key={index} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-1">
                                                {/* Dot Indicator */}
                                                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${trx.status === 'berhasil' ? 'bg-green-500' : trx.status === 'menunggu' ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
                                                
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between items-start">
                                                        <h5 className="font-bold text-gray-800 text-sm">{trx.nama_paket}</h5>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getStatusBadge(trx.status)}`}>
                                                            {trx.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{trx.tanggal}</p>
                                                    <p className="text-sm font-bold text-black mt-1">{formatRupiah(trx.jumlah_bayar)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Footer Decoration */}
                            <div className="p-4 bg-gray-50 rounded-b-3xl text-center">
                                <p className="text-[10px] text-gray-400">Menampilkan riwayat terbaru Anda</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === MODAL CHECKOUT (PERBAIKAN TAMPILAN) === */}
            {isModalOpen && createPortal(
                // Ubah z-50 menjadi z-[999] agar berada di atas Sidebar dan Header
                <div className="relative z-[999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    
                    {/* Backdrop Gelap - Pastikan z-index tinggi */}
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in z-[999]" onClick={() => setIsModalOpen(false)}></div>

                    {/* Container Modal */}
                    <div className="fixed inset-0 z-[1000] overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            
                            {/* Card Modal Utama */}
                            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-5xl border border-gray-200">
                                
                                {/* Header Modal */}
                                <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-20">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Beli Token Baru</h3>
                                        <p className="text-sm text-gray-500">Pilih paket yang sesuai dengan kebutuhan Anda.</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <div className="flex flex-col lg:flex-row h-full max-h-[80vh] lg:max-h-[70vh]">
                                    
                                    {/* KOLOM KIRI: Pilihan Paket */}
                                    {/* Ubah Background jadi putih bersih agar kontras */}
                                    <div className="flex-1 overflow-y-auto p-6 bg-white">
                                        {/* PERBAIKAN GRID: Ubah sm:grid-cols-3 jadi sm:grid-cols-2 agar kartu lebih lebar */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {daftar_paket.map((paket) => (
                                                <div 
                                                    key={paket.id_paket}
                                                    onClick={() => handleSelectPaket(paket)}
                                                    className={`relative cursor-pointer rounded-xl p-5 transition-all duration-200 flex flex-col justify-between min-h-[180px] border-2
                                                        ${selectedPaket?.id_paket === paket.id_paket 
                                                            ? 'border-yellow-500 bg-yellow-50/30 shadow-lg ring-1 ring-yellow-500' 
                                                            : 'border-gray-200 bg-white shadow-sm hover:border-yellow-400 hover:shadow-md'}`}
                                                >
                                                    {selectedPaket?.id_paket === paket.id_paket && (
                                                        <div className="absolute -top-3 -right-3 bg-yellow-500 text-white rounded-full p-1 shadow-md z-10">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    )}
                                                    
                                                    <div>
                                                        <h4 className="font-bold text-lg text-gray-800 mb-2">{paket.nama_paket}</h4>
                                                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{paket.deskripsi}</p>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-100/50">
                                                        <p className="text-black font-extrabold text-xl">{formatRupiah(paket.harga)}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">/ Token</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* KOLOM KANAN: Checkout Summary */}
                                    <div className="w-full lg:w-96 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col shadow-[rgba(0,0,0,0.05)_0px_0px_15px_-3px_inset]">
                                        <div className="p-6 flex-1">
                                            <h4 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wide flex items-center gap-2">
                                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Ringkasan Pesanan
                                            </h4>
                                            
                                            {selectedPaket ? (
                                                <div className="space-y-6 animate-fade-in">
                                                    <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm">
                                                        <p className="text-xs text-gray-500 mb-1">Paket Terpilih</p>
                                                        <p className="font-bold text-lg text-gray-900">{selectedPaket.nama_paket}</p>
                                                        <p className="text-yellow-700 font-bold mt-1">{formatRupiah(selectedPaket.harga)}</p>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 mb-2 block">JUMLAH TOKEN</label>
                                                        <div className="flex items-center bg-white rounded-lg p-1.5 border border-gray-300 shadow-sm">
                                                            <button onClick={handleDecrement} disabled={quantity <= 0} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-all font-bold text-lg">-</button>
                                                            <input 
                                                                type="number" 
                                                                value={quantity}
                                                                readOnly
                                                                className="flex-1 bg-transparent text-center font-bold text-xl text-gray-900 focus:outline-none"
                                                            />
                                                            <button onClick={handleIncrement} className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-md hover:bg-gray-800 transition-all font-bold text-lg shadow-md">+</button>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t border-dashed border-gray-300">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm text-gray-600">Total Tagihan</span>
                                                            <span className="text-2xl font-extrabold text-black">{formatRupiah(selectedPaket.harga * quantity)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
                                                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                    <p className="font-medium">Pilih paket di sebelah kiri<br/>untuk melihat rincian.</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="p-6 bg-white border-t border-gray-200 sticky bottom-0">
                                            <button 
                                                onClick={handleCheckout}
                                                disabled={isLoading || !selectedPaket || quantity <= 0}
                                                className="w-full rounded-xl bg-black py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 flex justify-center items-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                        Memproses...
                                                    </>
                                                ) : (
                                                    <>
                                                        Bayar Sekarang
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DashboardLayout>
    );
}