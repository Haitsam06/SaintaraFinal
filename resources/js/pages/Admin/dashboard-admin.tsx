import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head } from '@inertiajs/react';
import { HiArrowSmRight, HiChatAlt2, HiCurrencyDollar, HiTrendingUp, HiUserGroup, HiUsers } from 'react-icons/hi';

// Definisikan tipe Props
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

            <div className="space-y-8 font-sans">
                {/* ======================= */}
                {/* BAGIAN 1: STATS CARDS */}
                {/* ======================= */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Total Pendapatan */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Total Pendapatan</p>
                                <h3 className="mt-2 text-2xl font-bold text-gray-900">{formatRupiah(stats.total_pendapatan)}</h3>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                                <HiCurrencyDollar className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Customer Aktif */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <HiUsers className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400">Customer Personal</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.customer_aktif}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Instansi Aktif */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                                <HiUserGroup className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400">Instansi Terdaftar</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.instansi_aktif}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Agenda Count */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                                <HiChatAlt2 className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400">Agenda Mendatang</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.agenda.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======================= */}
                {/* BAGIAN 2: CHARTS & LIST */}
                {/* ======================= */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* KOLOM KIRI: Distribusi Tes (Donut Chart) */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
                        <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Distribusi Pembelian Token</h3>
                            <button className="text-sm font-medium text-gray-400 hover:text-yellow-600">Lihat Detail</button>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-12 md:flex-row">
                            {/* Visualisasi Donut Chart CSS */}
                            <div
                                className="relative h-56 w-56 rounded-full shadow-inner"
                                style={{
                                    background: `conic-gradient(
                                        #FCD34D 0% ${stats.distribusi.personal}%, 
                                        #d97706 ${stats.distribusi.personal}% ${stats.distribusi.personal + stats.distribusi.institution}%, 
                                        #fef08a ${stats.distribusi.personal + stats.distribusi.institution}% 100%
                                    )`,
                                }}
                            >
                                {/* Inner Circle untuk efek Donut */}
                                <div className="absolute inset-0 m-auto flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                                    <span className="text-xs text-gray-400">Total</span>
                                    <span className="text-xl font-bold text-gray-800">100%</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-yellow-400"></span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Personal ({stats.distribusi.personal}%)</p>
                                        <p className="text-xs text-gray-400">Pembelian perorangan</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-amber-600"></span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Institution ({stats.distribusi.institution}%)</p>
                                        <p className="text-xs text-gray-400">Pembelian instansi/perusahaan</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-yellow-200"></span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Gift ({stats.distribusi.gift}%)</p>
                                        <p className="text-xs text-gray-400">Token hadiah donasi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Agenda Mendatang */}
                    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-1">
                        <h3 className="mb-6 text-lg font-bold text-gray-800">Agenda Mendatang</h3>

                        {stats.agenda.length > 0 ? (
                            <div className="relative flex-1 space-y-8 pl-4">
                                {/* Garis Vertikal Timeline */}
                                <div className="absolute top-2 left-0 h-full w-0.5 bg-gray-100"></div>

                                {stats.agenda.map((item, index) => (
                                    <div key={item.id} className="relative pl-6">
                                        {/* Dot Indicator */}
                                        <span className={`absolute top-1.5 -left-[5px] h-3 w-3 rounded-full border-2 border-white shadow-sm ${item.type === 'red' ? 'bg-red-500' : item.type === 'green' ? 'bg-green-500' : 'bg-blue-500'} `}></span>

                                        <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                            <span className="font-medium">{item.date}</span>
                                            <span>•</span>
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-1 items-center justify-center text-center">
                                <p className="text-sm text-gray-400">Tidak ada agenda dalam waktu dekat.</p>
                            </div>
                        )}

                        <a href="/admin/agendaAdmin" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-yellow-50 hover:text-yellow-700">
                            Lihat Semua Agenda <HiArrowSmRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
