import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// Tipe data props dari Laravel
interface PaymentProps {
    instansi: {
        nama_instansi: string;
        email: string;
        pic_name: string;
    };
    bill: {
        description: string;
        amount: number;
        formatted_amount: string;
    };
    snap_token?: string; // Opsional jika sudah ada token midtrans
}

// Logo Component
const Logo = () => (
    <div className="flex h-18 w-18 items-center justify-center rounded-full">
        {/* Pastikan path gambar logo benar */}
        <img src="/assets/logo/5.png" alt="Saintara Logo" className="h-16 w-16 object-contain" />
    </div>
);

export default function InstansiCheckout({ instansi, bill, snap_token }: PaymentProps) {
    // Form helper dari Inertia
    const { post, processing } = useForm({});

    const handlePayment = () => {
        // Logika pembayaran (Integrasi Midtrans)
        if (snap_token && typeof window.snap !== 'undefined') {
            window.snap.pay(snap_token, {
                // ============================================================
                // 1. PEMBAYARAN SUKSES -> LOGOUT & KE LOGIN
                // ============================================================
                onSuccess: function(result: any){
                    alert("Pembayaran Berhasil! Terima kasih.");
                    window.location.href = '/instansi/dashboardInstansi';
                },
                // ============================================================

                onPending: function(result: any){
                    alert("Menunggu Pembayaran...");
                },
                onError: function(result: any){
                    alert("Pembayaran Gagal.");
                    console.log(result);
                },
                onClose: function(){
                    alert('Anda menutup popup tanpa menyelesaikan pembayaran.');
                }
            });
        } else {
            console.log("Token pembayaran belum tersedia.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-yellow-400 p-6 font-sans">
            <Head title="Selesaikan Pembayaran" />

            <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl md:p-12">
                {/* Tombol Silang (Back/Logout) */}
                <Link 
                    href="/logout" 
                    method="post" 
                    as="button" 
                    className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-600"
                    title="Batalkan & Keluar"
                >
                    <span className="text-2xl">&times;</span>
                </Link>

                <div className="flex flex-col items-center">
                    <Logo />
                    <h2 className="mt-4 mb-2 text-center text-2xl font-bold text-gray-900">Tagihan Aktivasi</h2>
                    <p className="text-center text-gray-600 mb-8 text-sm">
                        Halo, <span className="font-bold text-yellow-600">{instansi.nama_instansi}</span>.<br/>
                        Selesaikan pembayaran untuk mengaktifkan akun.
                    </p>
                </div>

                {/* --- CARD RINGKASAN TAGIHAN --- */}
                <div className="mb-8 rounded-2xl bg-gray-50 p-6 border border-gray-100">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">Rincian</h3>
                    
                    <div className="flex justify-between py-2 text-gray-700">
                        <span className="font-medium text-sm">{bill.description}</span>
                        <span className="font-bold text-sm text-gray-900">{bill.formatted_amount}</span>
                    </div>

                    {/* Garis Putus-putus */}
                    <div className="my-4 border-t-2 border-dashed border-gray-200"></div>

                    <div className="flex justify-between items-center font-bold text-gray-900">
                        <span className="text-lg">Total</span>
                        <span className="text-2xl text-yellow-600">{bill.formatted_amount}</span>
                    </div>
                </div>

                {/* --- INFORMASI PENERIMA (Read Only) --- */}
                <div className="mb-8 space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-gray-400">Email Penanggung Jawab</label>
                        <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 shadow-sm text-sm">
                            {instansi.pic_name} ({instansi.email})
                        </div>
                    </div>
                </div>

                {/* --- TOMBOL AKSI --- */}
                <div className="pt-2">
                    <button 
                        onClick={handlePayment} 
                        disabled={processing} 
                        className="group flex w-full items-center justify-center gap-3 rounded-full bg-gray-900 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-yellow-400 hover:text-gray-900 disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : (
                            <>
                                <span>Bayar Sekarang</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-transform group-hover:translate-x-1">
                                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                                </svg>
                            </>
                        )}
                    </button>
                    
                    <p className="mt-5 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-500">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        Secure Payment by Midtrans
                    </p>
                </div>
            </div>
        </div>
    );
}