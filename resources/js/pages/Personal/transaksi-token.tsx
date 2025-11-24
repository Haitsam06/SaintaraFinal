import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head, router } from '@inertiajs/react';
import axios from 'axios'; // <--- TAMBAHKAN INI (Pastikan sudah install: npm install axios)
import { useState } from 'react';
import { createPortal } from 'react-dom';

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

export default function TransaksiDanToken({ saldo_token = 0, rincian_token = [], riwayat = [], daftar_paket = [], flash }: TransaksiPageProps) {
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
            case 'berhasil':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'menunggu':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'gagal':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
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
    // Logic Checkout
    const handleCheckout = async () => {
        if (!selectedPaket) return alert('Silakan pilih paket terlebih dahulu!');
        if (quantity <= 0) return alert('Jumlah token minimal 1');

        setIsLoading(true);

        try {
            // 1. Request Snap Token ke Backend menggunakan AXIOS (Bukan router.post)
            // URL sesuaikan dengan route web.php: /personal/checkout
            const response = await axios.post('/personal/checkout', {
                paket_id: selectedPaket.id_paket,
                quantity: quantity,
            });

            // 2. Ambil Snap Token dari response JSON
            const snapToken = response.data.snap_token;

            if (snapToken) {
                // 3. Buka Popup Midtrans
                // @ts-ignore
                window.snap.pay(snapToken, {
                    onSuccess: function (result: any) {
                        alert('Pembayaran Berhasil!');
                        setIsModalOpen(false);
                        setQuantity(0);
                        setSelectedPaket(null);
                        // Reload data halaman untuk update saldo/riwayat
                        router.visit('/personal/transaksi-token');
                    },
                    onPending: function (result: any) {
                        alert('Menunggu Pembayaran...');
                        setIsModalOpen(false);
                        router.visit('/personal/transaksi-token');
                    },
                    onError: function (result: any) {
                        alert('Pembayaran Gagal!');
                        setIsLoading(false);
                    },
                    onClose: function () {
                        alert('Anda menutup popup tanpa menyelesaikan pembayaran');
                        setIsLoading(false);
                    },
                });
            } else {
                alert('Gagal mendapatkan Token Pembayaran');
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Terjadi kesalahan saat memproses transaksi.');
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <Head title="Dompet & Transaksi" />

            <div className="min-h-screen bg-[#FAFAFA] p-6 font-sans text-[#2A2A2A]">
                {/* === NOTIFIKASI === */}
                {flash?.success && (
                    <div className="animate-fade-in-down mb-6 flex items-center justify-between rounded-r border-l-4 border-green-500 bg-green-50 p-4 shadow-sm">
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
                        <button onClick={(e) => (e.currentTarget.parentElement!.style.display = 'none')} className="text-green-500 hover:text-green-700">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* === HEADER SECTION === */}
                <div className="mb-10 flex flex-col items-end justify-between gap-4 md:flex-row">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dompet & Transaksi</h1>
                        <p className="mt-1 text-gray-500">Kelola token dan pantau riwayat pembelian Anda.</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none"
                    >
                        <span className="mr-2 text-yellow-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Top Up Token
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* === LEFT COLUMN (TOKEN STATUS) === */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* 1. HERO CARD: Total Saldo */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-8 text-white shadow-xl">
                            {/* Dekorasi Background */}
                            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-black opacity-10 blur-3xl"></div>

                            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                                <div>
                                    <p className="mb-1 text-sm font-medium tracking-wider text-yellow-100 uppercase">Total Saldo Aktif</p>
                                    <h2 className="text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                        {saldo_token} <span className="text-2xl font-medium opacity-80">Token</span>
                                    </h2>
                                    <p className="mt-2 text-sm text-white opacity-90">Token ini dapat digunakan untuk semua jenis tes.</p>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 2. GRID RINCIAN PAKET */}
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
                                <span className="h-6 w-1.5 rounded-full bg-black"></span>
                                Rincian Paket Anda
                            </h3>

                            {rincian_token.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {rincian_token.map((item, idx) => (
                                        <div key={idx} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-yellow-300 hover:shadow-md">
                                            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-16 w-16 rounded-bl-full bg-yellow-50 transition-transform group-hover:scale-110"></div>

                                            <div className="relative z-10">
                                                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Paket</p>
                                                <h4 className="mb-3 text-lg font-bold text-gray-800">{item.nama_paket}</h4>

                                                <div className="flex items-end gap-1">
                                                    <span className="text-4xl font-bold text-black">{item.total}</span>
                                                    <span className="mb-1.5 text-sm font-medium text-gray-500">Tiket</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-gray-500">Belum ada paket token yang tersedia.</p>
                                    <button onClick={() => setIsModalOpen(true)} className="mt-2 text-sm font-bold text-yellow-600 hover:underline">
                                        Beli Paket Sekarang
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === RIGHT COLUMN (HISTORY) === */}
                    <div className="lg:col-span-4">
                        <div className="flex h-full max-h-[600px] flex-col rounded-3xl border border-gray-100 bg-white shadow-sm">
                            <div className="rounded-t-3xl border-b border-gray-100 bg-gray-50/50 p-6">
                                <h3 className="flex items-center gap-2 font-bold text-gray-800">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Riwayat Transaksi
                                </h3>
                            </div>

                            <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
                                {riwayat.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center py-10 text-sm text-gray-400">
                                        <svg className="mb-3 h-10 w-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <p>Belum ada riwayat pembelian.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {riwayat.map((trx, index) => (
                                            <div key={index} className="relative border-l-2 border-gray-100 pb-1 pl-6 last:border-0">
                                                {/* Dot Indicator */}
                                                <div className={`absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full ring-4 ring-white ${trx.status === 'berhasil' ? 'bg-green-500' : trx.status === 'menunggu' ? 'bg-yellow-400' : 'bg-red-500'}`}></div>

                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-start justify-between">
                                                        <h5 className="text-sm font-bold text-gray-800">{trx.nama_paket}</h5>
                                                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(trx.status)}`}>{trx.status}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{trx.tanggal}</p>
                                                    <p className="mt-1 text-sm font-bold text-black">{formatRupiah(trx.jumlah_bayar)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer Decoration */}
                            <div className="rounded-b-3xl bg-gray-50 p-4 text-center">
                                <p className="text-[10px] text-gray-400">Menampilkan riwayat terbaru Anda</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === MODAL CHECKOUT (PERBAIKAN TAMPILAN) === */}
            {isModalOpen &&
                createPortal(
                    // Ubah z-50 menjadi z-[999] agar berada di atas Sidebar dan Header
                    <div className="relative z-[999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        {/* Backdrop Gelap - Pastikan z-index tinggi */}
                        <div className="animate-fade-in fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                        {/* Container Modal */}
                        <div className="fixed inset-0 z-[1000] overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                {/* Card Modal Utama */}
                                <div className="relative transform overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
                                    {/* Header Modal */}
                                    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Beli Token Baru</h3>
                                            <p className="text-sm text-gray-500">Pilih paket yang sesuai dengan kebutuhan Anda.</p>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-gray-100 p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex h-full max-h-[80vh] flex-col lg:max-h-[70vh] lg:flex-row">
                                        {/* KOLOM KIRI: Pilihan Paket */}
                                        {/* Ubah Background jadi putih bersih agar kontras */}
                                        <div className="flex-1 overflow-y-auto bg-white p-6">
                                            {/* PERBAIKAN GRID: Ubah sm:grid-cols-3 jadi sm:grid-cols-2 agar kartu lebih lebar */}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {daftar_paket.map((paket) => (
                                                    <div
                                                        key={paket.id_paket}
                                                        onClick={() => handleSelectPaket(paket)}
                                                        className={`relative flex min-h-[180px] cursor-pointer flex-col justify-between rounded-xl border-2 p-5 transition-all duration-200 ${
                                                            selectedPaket?.id_paket === paket.id_paket ? 'border-yellow-500 bg-yellow-50/30 shadow-lg ring-1 ring-yellow-500' : 'border-gray-200 bg-white shadow-sm hover:border-yellow-400 hover:shadow-md'
                                                        }`}
                                                    >
                                                        {selectedPaket?.id_paket === paket.id_paket && (
                                                            <div className="absolute -top-3 -right-3 z-10 rounded-full bg-yellow-500 p-1 text-white shadow-md">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <h4 className="mb-2 text-lg font-bold text-gray-800">{paket.nama_paket}</h4>
                                                            <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">{paket.deskripsi}</p>
                                                        </div>
                                                        <div className="mt-4 border-t border-gray-100/50 pt-4">
                                                            <p className="text-xl font-extrabold text-black">{formatRupiah(paket.harga)}</p>
                                                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">/ Token</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* KOLOM KANAN: Checkout Summary */}
                                        <div className="flex w-full flex-col border-t border-gray-200 bg-gray-50 shadow-[rgba(0,0,0,0.05)_0px_0px_15px_-3px_inset] lg:w-96 lg:border-t-0 lg:border-l">
                                            <div className="flex-1 p-6">
                                                <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wide text-gray-800 uppercase">
                                                    <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Ringkasan Pesanan
                                                </h4>

                                                {selectedPaket ? (
                                                    <div className="animate-fade-in space-y-6">
                                                        <div className="rounded-xl border border-yellow-200 bg-white p-4 shadow-sm">
                                                            <p className="mb-1 text-xs text-gray-500">Paket Terpilih</p>
                                                            <p className="text-lg font-bold text-gray-900">{selectedPaket.nama_paket}</p>
                                                            <p className="mt-1 font-bold text-yellow-700">{formatRupiah(selectedPaket.harga)}</p>
                                                        </div>

                                                        <div>
                                                            <label className="mb-2 block text-xs font-bold text-gray-500">JUMLAH TOKEN</label>
                                                            <div className="flex items-center rounded-lg border border-gray-300 bg-white p-1.5 shadow-sm">
                                                                <button onClick={handleDecrement} disabled={quantity <= 0} className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-lg font-bold text-gray-600 transition-all hover:bg-gray-200 disabled:opacity-50">
                                                                    -
                                                                </button>
                                                                <input type="number" value={quantity} readOnly className="flex-1 bg-transparent text-center text-xl font-bold text-gray-900 focus:outline-none" />
                                                                <button onClick={handleIncrement} className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-lg font-bold text-white shadow-md transition-all hover:bg-gray-800">
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="border-t border-dashed border-gray-300 pt-4">
                                                            <div className="mb-1 flex items-center justify-between">
                                                                <span className="text-sm text-gray-600">Total Tagihan</span>
                                                                <span className="text-2xl font-extrabold text-black">{formatRupiah(selectedPaket.harga * quantity)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white/50 text-center text-sm text-gray-400">
                                                        <svg className="mb-3 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                        <p className="font-medium">
                                                            Pilih paket di sebelah kiri
                                                            <br />
                                                            untuk melihat rincian.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6">
                                                <button
                                                    onClick={handleCheckout}
                                                    disabled={isLoading || !selectedPaket || quantity <= 0}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Memproses...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Bayar Sekarang
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                            </svg>
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
                    document.body,
                )}
        </DashboardLayout>
    );
}
