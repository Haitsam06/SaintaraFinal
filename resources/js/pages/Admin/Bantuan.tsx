import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head } from '@inertiajs/react';
import { HiAnnotation, HiCheckCircle, HiClock, HiDotsHorizontal, HiSearch } from 'react-icons/hi';

// --- TYPES ---
interface Customer {
    id_customer: string;
    name: string;
    email: string;
}

interface Ticket {
    id: number;
    customer_id: string | null;
    subject: string;
    category: string | null;
    description: string;
    status: 'pending' | 'diproses' | 'selesai';
    created_at: string;
    updated_at: string;
    customer: Customer | null;
}

interface Stats {
    baru: number;
    diproses: number;
    selesai: number;
}

interface SupportProps {
    stats: Stats;
    tickets: Ticket[];
}

export default function Support({ stats, tickets }: SupportProps) {
    // Format ID Tiket
    const formatTicketId = (id: number) => `#T-${String(id).padStart(5, '0')}`;

    // Helper Warna Status
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'diproses':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'selesai':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AdminDashboardLayout>
            <Head title="Bantuan & Layanan" />

            <div className="space-y-6 font-sans">
                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Pusat Bantuan</h1>
                        <p className="text-sm text-gray-500">Kelola tiket komplain dan pertanyaan dari pengguna.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <input type="text" placeholder="Cari ID Tiket atau User..." className="w-full rounded-xl border-none bg-white py-2.5 pr-10 pl-4 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400" />
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                            <HiSearch className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Tiket Baru */}
                    <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-orange-600 uppercase">Pending</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-gray-900">{stats.baru}</h3>
                            </div>
                            <div className="rounded-full bg-orange-50 p-3 text-orange-500">
                                <HiAnnotation className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    {/* Diproses */}
                    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">Sedang Diproses</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-gray-900">{stats.diproses}</h3>
                            </div>
                            <div className="rounded-full bg-blue-50 p-3 text-blue-500">
                                <HiClock className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    {/* Selesai */}
                    <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-green-600 uppercase">Selesai</p>
                                <h3 className="mt-2 text-3xl font-extrabold text-gray-900">{stats.selesai}</h3>
                            </div>
                            <div className="rounded-full bg-green-50 p-3 text-green-500">
                                <HiCheckCircle className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABLE LIST */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-yellow-400 text-gray-900">
                                <tr>
                                    <th className="px-6 py-4 font-bold">ID Tiket</th>
                                    <th className="px-6 py-4 font-bold">Pelapor</th>
                                    <th className="px-6 py-4 font-bold">Subjek</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {tickets.length > 0 ? (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-800">{formatTicketId(ticket.id)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{ticket.customer ? ticket.customer.name : 'User Tidak Dikenal'}</span>
                                                    <span className="text-xs text-gray-400">{ticket.customer ? ticket.customer.email : '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="block font-medium text-gray-900">{ticket.subject}</span>
                                                <span className="block max-w-[200px] truncate text-xs text-gray-500">{ticket.description}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${getStatusBadge(ticket.status)}`}>{ticket.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                                    <HiDotsHorizontal className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <HiAnnotation className="h-10 w-10 opacity-20" />
                                                <p>Belum ada tiket bantuan masuk.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
