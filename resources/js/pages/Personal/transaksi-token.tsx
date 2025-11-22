import React, { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout-personal';
import { Head } from '@inertiajs/react';

// 1. Definisi Tipe Data (Interface)
// Ini memberi tahu TypeScript bentuk data transaksi itu seperti apa
interface TransactionItem {
  nama: string;
  tanggal: string;
  jumlah: string;
  status: 'Selesai' | 'Pending' | 'Gagal'; // Kita kunci statusnya agar tidak typo
}

export default function TransaksiDanToken() {
  // === STATE MANAGEMENT DENGAN TYPE ===
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Data statis dengan tipe number
  const tokenTersedia: number = 5;
  const pricePerToken: number = 350000;

  // Data riwayat dengan tipe Array of TransactionItem
  const riwayatTransaksi: TransactionItem[] = [
    { 
      nama: 'Beli Paket 5 Token', 
      tanggal: '1 Okt 2025', 
      jumlah: 'Rp 200.000', 
      status: 'Selesai' 
    },
    { 
      nama: 'Beli Paket 1 Token', 
      tanggal: '18 Okt 2025', 
      jumlah: 'Rp 50.000', 
      status: 'Pending' 
    },
  ];

  // === HELPER FUNCTIONS ===
  
  // Perbaikan Error: Menambahkan tipe ': number' pada parameter
  const formatRupiah = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleIncrement = (): void => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (): void => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleCheckout = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`Redirecting to payment gateway for total: ${formatRupiah(quantity * pricePerToken)}`);
      setIsLoading(false);
      setIsModalOpen(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <Head title="Transaksi dan Token" />

      <div className="p-6 relative">
        {/* === HEADER SECTION === */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#2A2A2A]">
            Transaksi & Token
          </h1>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-600 text-[#2A2A2A] font-bold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Beli Token
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === Status Token === */}
          <div className="bg-white rounded-2xl shadow-md p-6 col-span-2">
            <h2 className="text-lg font-semibold mb-3 text-[#2A2A2A]">
              Status Token Anda
            </h2>
            <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
              <p className="text-[#2A2A2A]">Token Aktif Tersedia:</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {tokenTersedia} Token
              </p>
            </div>
          </div>

          {/* === Riwayat Transaksi === */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 text-[#2A2A2A]">
              Riwayat Transaksi
            </h2>
            <div className="space-y-4">
              {/* TypeScript sekarang tahu 'trx' itu tipe datanya TransactionItem */}
              {riwayatTransaksi.map((trx, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <p className="font-medium text-[#2A2A2A]">{trx.nama}</p>
                    <p className="text-sm text-gray-500">{trx.tanggal}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2A2A2A]">{trx.jumlah}</p>
                    <p className={`text-sm ${trx.status === 'Selesai' ? 'text-green-600' : 'text-yellow-500'}`}>
                      {trx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* === MODAL CHECKOUT (FIXED VERSION) === */}
      {isModalOpen && (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          
          {/* 1. BACKDROP (Layar Gelap) */}
          {/* fixed inset-0 memastikan dia memenuhi satu layar penuh */}
          <div 
            className="fixed inset-0 bg-opacity-50 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* 2. WRAPPER UNTUK POSISI DI TENGAH */}
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              
              {/* 3. MODAL PANEL (KONTEN PUTIH) */}
              {/* relative transform overflow-hidden memastikan dia di atas backdrop */}
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                
                {/* Header Modal */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-a">
                  <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                    Checkout Token
                  </h3>
                  {/* <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button> */}
                </div>

                {/* Body Modal */}
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mt-2 space-y-4">
                    
                    {/* Info Produk */}
                    <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="bg-yellow-200 p-3 rounded-md">
                         <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2A2A2A]">Token Saintara Premium</h4>
                        <p className="text-sm text-gray-600">Akses tes premium. Valid selamanya.</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">{formatRupiah(pricePerToken)} / token</p>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex justify-between items-center mt-4 border-t border-b py-4 border-gray-100">
                      <span className="font-medium text-gray-700">Jumlah Token</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={handleDecrement}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          readOnly 
                          value={quantity} 
                          className="w-12 text-center text-gray-800 font-semibold focus:outline-none border-x border-gray-300 py-1"
                        />
                        <button 
                          onClick={handleIncrement}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-gray-700">Total Bayar</span>
                      <span className="text-2xl font-bold text-[#2A2A2A]">{formatRupiah(quantity * pricePerToken)}</span>
                    </div>

                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button 
                    type="button" 
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Memproses...' : 'Lanjut Pembayaran'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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