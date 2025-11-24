import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, Link } from '@inertiajs/react';
import { HiArrowSmRight, HiChatAlt2, HiCurrencyDollar, HiDesktopComputer, HiUserGroup, HiUsers } from 'react-icons/hi';
import { HiWrench } from 'react-icons/hi2';

// Definisikan tipe Props (Jika pakai TypeScript)
interface DashboardProps {
    stats: {
        total_pendapatan: number;
        customer_aktif: number;
        instansi_aktif: number;
        agenda: Array<{
            id: number;
            title: string;
            date: string;
            time: string;
            type: string;
        }>;
        distribusi: {
            personal: number;
            institution: number;
            gift: number;
        };
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    // Helper untuk format Rupiah
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AdminDashboardLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                {/* ======================= */}
                {/* BAGIAN 1: KARTU ATAS (4 KOLOM) */}
                {/* ======================= */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Total Transaksi Tahun Ini */}
                    <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm">
                        <div>
                            <p className="mb-1 text-xs text-gray-400">Total Transaksi Tahun Ini</p>
                            <h3 className="text-xl font-bold text-gray-800">{formatRupiah(stats.total_pendapatan)}</h3>
                        </div>
                        {/* Visual Icon/Chart Sederhana */}
                        <div className="flex h-10 items-end gap-1">
                            <div className="h-4 w-1.5 rounded-full bg-green-100"></div>
                            <div className="h-6 w-1.5 rounded-full bg-green-200"></div>
                            <div className="h-10 w-1.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    {/* Card 2: Customer Aktif */}
                    <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <HiUsers className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Customer Aktif</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.customer_aktif}</h3>
                        </div>
                    </div>

                    {/* Card 3: Instansi Aktif */}
                    <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                            <HiUserGroup className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Instansi Aktif</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.instansi_aktif}</h3>
                        </div>
                    </div>

                    {/* Card 4: Agenda Mendatang (Summary Count) */}
                    <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                            <HiChatAlt2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Agenda Mendatang</p>
                            <h3 className="text-xl font-bold text-gray-800">{stats.agenda.length} Agenda</h3>
                        </div>
                    </div>
                </div>

                {/* ======================= */}
                {/* BAGIAN 2: TENGAH (CHART & LIST) */}
                {/* ======================= */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* KOLOM KIRI: Distribusi Tes (Donut Chart) */}
                    <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
                        <h3 className="mb-6 text-xl font-bold text-gray-800">Distribusi Tes</h3>
                        <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
                            {/* Legend */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="h-4 w-4 rounded-full bg-[#FCD34D]"></span>
                                    <span className="text-sm font-medium text-gray-600">Personal ({stats.distribusi.personal}%)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="h-4 w-4 rounded-full bg-[#A16207]"></span>
                                    <span className="text-sm font-medium text-gray-600">Institution ({stats.distribusi.institution}%)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="h-4 w-4 rounded-full bg-[#FFFF00]"></span>
                                    <span className="text-sm font-medium text-gray-600">Gift ({stats.distribusi.gift}%)</span>
                                </div>
                            </div>

                            {/* CSS Donut Chart (Dynamic Conic Gradient) */}
                            {/* Rumus sederhana untuk persentase visualisasi */}
                            <div
                                className="relative h-48 w-48 rounded-full"
                                style={{
                                    background: `conic-gradient(
                                        #FCD34D 0% ${stats.distribusi.personal}%, 
                                        #A16207 ${stats.distribusi.personal}% ${stats.distribusi.personal + stats.distribusi.institution}%, 
                                        #FFFF00 ${stats.distribusi.personal + stats.distribusi.institution}% 100%
                                    )`,
                                }}
                            >
                                <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Agenda Mendatang (List) */}
                    <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm lg:col-span-1">
                        <div>
                            <h3 className="mb-6 text-lg font-bold text-gray-800">Agenda Mendatang</h3>

                            {stats.agenda.length > 0 ? (
                                <div className="relative ml-2 space-y-6 border-l-2 border-gray-100 pl-6">
                                    {stats.agenda.map((item, index) => (
                                        <div key={item.id} className="relative">
                                            <span className={`absolute top-1 -left-[31px] h-3 w-3 rounded-full ${item.type === 'red' ? 'bg-red-400' : item.type === 'green' ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {item.date} at {item.time}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Tidak ada agenda mendatang.</p>
                            )}
                        </div>
                        <Link href="/admin/agendaAdmin" className="mt-4 flex items-center justify-end text-sm font-bold text-yellow-500 hover:underline">
                            View all <HiArrowSmRight className="ml-1 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
