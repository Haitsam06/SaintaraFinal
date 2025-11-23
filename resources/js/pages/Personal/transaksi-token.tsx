import React, { useState } from 'react';
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

    const getPaketColor = (nama: string) => {
        const n = nama.toLowerCase();
        if (n.includes('dasar')) return 'bg-gray-100 text-gray-700 border-gray-200';
        if (n.includes('standar')) return 'bg-blue-50 text-blue-700 border-blue-200';
        if (n.includes('premium')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        return 'bg-gray-50 text-gray-600 border-gray-200';
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
            <Head title="Transaksi dan Token" />

            <div className="p-6 relative min-h-screen bg-gray-50/50">

                {/* NOTIFIKASI SUKSES */}
                {flash?.success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-sm flex justify-between items-center" role="alert">
                        <div>
                            <strong className="font-bold">Berhasil! </strong>
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                        <button 
                            className="text-green-700 font-bold"
                            onClick={(e) => e.currentTarget.parentElement!.style.display = 'none'}
                        >
                            &times;
                        </button>
                    </div>
                )}
                
                {/* === HEADER === */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2A2A2A]">Transaksi & Token</h1>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-600 text-[#2A2A2A] font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-yellow-200 transition-all flex items-center gap-2 hover:translate-y-[-2px]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Beli Token Baru
                    </button>
                </div>

                {/* === MAIN GRID LAYOUT === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* === [KIRI] KOTAK STATUS TOKEN === */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-[#2A2A2A] mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                Dompet Token
                            </h2>
                            
                            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                                {/* 1. Total Besar */}
                                <div className="w-full md:w-1/3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 text-center flex flex-col justify-center items-center shadow-inner min-h-[180px]">
                                    <p className="text-green-800 text-sm font-semibold uppercase tracking-wide">Total Token</p>
                                    <p className="text-6xl font-extrabold text-green-600 mt-2 leading-none">
                                        {saldo_token}
                                    </p>
                                    <span className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full mt-3">Aktif</span>
                                </div>

                                {/* 2. Rincian Kartu */}
                                <div className="flex-1 flex flex-col">
                                    <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Rincian Paket</p>
                                    <div className="flex-1">
                                        {rincian_token.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full content-start">
                                                {rincian_token.map((item, idx) => (
                                                    <div key={idx} className={`flex justify-between items-center p-4 rounded-xl border transition-all hover:shadow-sm ${getPaketColor(item.nama_paket)}`}>
                                                        <div>
                                                            <p className="text-xs opacity-70 mb-0.5">Paket</p>
                                                            <p className="font-bold text-base">{item.nama_paket}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-2xl font-bold leading-none">{item.total}</span>
                                                            <span className="text-[10px] uppercase font-bold opacity-60">Tiket</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                                <p>Belum ada rincian token.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-start gap-2">
                                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-xs text-gray-500 italic">Token akan otomatis berkurang setelah Anda menyelesaikan satu sesi tes kepribadian.</p>
                            </div>
                        </div>
                    </div>

                    {/* === [KANAN] KOTAK RIWAYAT === */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full max-h-[600px] flex flex-col">
                            <h2 className="text-lg font-bold text-[#2A2A2A] mb-4 flex items-center gap-2 sticky top-0 bg-white z-10">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Riwayat Pembelian
                            </h2>
                            <div className="overflow-y-auto flex-1 pr-1 space-y-4 custom-scrollbar">
                                {riwayat.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 text-sm">Belum ada riwayat.</p>
                                    </div>
                                ) : (
                                    riwayat.map((trx, index) => (
                                        <div key={index} className="group relative pl-4 border-l-2 border-gray-200 hover:border-yellow-400 transition-colors pb-4 last:pb-0">
                                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-gray-300 group-hover:border-yellow-500"></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-[#2A2A2A] text-sm line-clamp-1 group-hover:text-yellow-600 transition-colors">{trx.nama_paket}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{trx.tanggal}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${trx.status === 'berhasil' ? 'bg-green-100 text-green-700' : trx.status === 'menunggu' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                        {trx.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-gray-700 mt-1">{formatRupiah(trx.jumlah_bayar)}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === MODAL CHECKOUT (FIXED LAYOUT) === */}
            {isModalOpen && (
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-xs transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                    {/* Wrapper Flexbox untuk Centering */}
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            
                            {/* Panel Modal dengan Flex-Col dan Max-Height */}
                            <div className="relative flex flex-col w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all border border-gray-200 max-h-[90vh]">
                                
                                {/* 1. HEADER (FIXED) - Shrink-0 agar tidak mengecil */}
                                <div className="flex-shrink-0 bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Beli Token Baru</h3>
                                        <p className="text-sm text-gray-500">Pilih paket yang sesuai dengan kebutuhan Anda.</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        <span className="text-2xl leading-none">&times;</span>
                                    </button>
                                </div>

                                {/* 2. BODY (SCROLLABLE) - Overflow-y-auto */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/50">
                                    
                                    {/* Grid Pilihan Paket */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                        {daftar_paket.map((paket) => (
                                            <div 
                                                key={paket.id_paket}
                                                onClick={() => handleSelectPaket(paket)}
                                                className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between min-h-[180px]
                                                    ${selectedPaket?.id_paket === paket.id_paket 
                                                        ? 'border-yellow-500 bg-white ring-2 ring-yellow-200 ring-offset-2' 
                                                        : 'border-gray-200 bg-white hover:border-yellow-300'}`}
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-lg text-gray-800">{paket.nama_paket}</h4>
                                                        {selectedPaket?.id_paket === paket.id_paket && (
                                                            <span className="bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">DIPILIH</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{paket.deskripsi}</p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <p className="text-blue-600 font-extrabold text-lg">{formatRupiah(paket.harga)}</p>
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Per Token</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Area Detail Pembayaran */}
                                    {selectedPaket && (
                                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-[fadeIn_0.3s_ease-in-out]">
                                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Ringkasan Pesanan
                                            </h4>
                                            
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Paket Dipilih</span>
                                                    <span className="font-semibold text-gray-900">{selectedPaket.nama_paket}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Harga Satuan</span>
                                                    <span className="font-semibold text-gray-900">{formatRupiah(selectedPaket.harga)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm text-gray-600 font-medium">Jumlah Token</span>
                                                    <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                                                        <button onClick={handleDecrement} disabled={quantity <= 0} className="px-4 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                            <span className="font-bold text-lg leading-none">-</span>
                                                        </button>
                                                        <div className="w-12 text-center border-x border-gray-200 bg-white py-1.5 font-bold text-gray-800">{quantity}</div>
                                                        <button onClick={handleIncrement} className="px-4 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors">
                                                            <span className="font-bold text-lg leading-none">+</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <hr className="border-dashed border-gray-200 my-2" />
                                                <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                                    <span className="text-base font-bold text-gray-800">Total Pembayaran</span>
                                                    <span className="text-2xl font-bold text-yellow-600">{formatRupiah(selectedPaket.harga * quantity)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 3. FOOTER (FIXED) - Shrink-0 */}
                                <div className="flex-shrink-0 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-100 z-10">
                                    <button 
                                        type="button" 
                                        onClick={handleCheckout}
                                        disabled={isLoading || !selectedPaket || quantity <= 0}
                                        className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl border border-transparent shadow-lg shadow-gray-300 px-8 py-3 bg-black text-base font-bold text-white hover:bg-gray-800 focus:outline-none disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Memproses...
                                            </>
                                        ) : 'Lanjut Pembayaran'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-all"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}