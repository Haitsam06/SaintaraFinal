import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, router, useForm } from '@inertiajs/react'; // Tambahkan router
import { useState } from 'react';
import { HiAnnotation, HiCheckCircle, HiClock, HiPencil, HiPlus, HiSearch, HiTrash, HiX } from 'react-icons/hi';
import Swal from 'sweetalert2'; // Optional: Untuk konfirmasi delete yang cantik

// --- TYPES ---
interface Customer {
    id_customer: string;
    name: string;
    email: string;
}

interface Ticket {
    id: number;
    customer_id: string | null;
    instansi_id: string | null;
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
    tickets: {
        data: Ticket[];
        links: any[]; // Pagination links
    };
    filters: {
        search: string;
    };
}

export default function Support({ stats, tickets, filters }: SupportProps) {
    // --- STATE MANAGEMENT ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // State untuk Dropdown Menu Aksi
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    // --- FORM HANDLING (Inertia useForm) ---
    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        id: '', // Disimpan untuk update
        subject: '',
        category: 'Umum',
        description: '',
        status: 'pending',
    });

    // --- HELPER FUNCTIONS ---
    const formatTicketId = (id: number) => `#T-${String(id).padStart(5, '0')}`;

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

    // --- HANDLERS ---

    // 1. Search Logic
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get('/admin/supportAdmin', { search: searchQuery }, { preserveState: true });
        }
    };

    // 2. Open Modal Create
    const openCreateModal = () => {
        setModalMode('create');
        reset(); // Bersihkan form
        clearErrors();
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    // 3. Open Modal Edit
    const openEditModal = (ticket: Ticket) => {
        setModalMode('edit');
        clearErrors();
        setData({
            id: ticket.id.toString(), // casting ke string agar aman di form
            subject: ticket.subject,
            category: ticket.category || 'Umum',
            description: ticket.description,
            status: ticket.status,
        });
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    // 4. Submit Form (Create / Update)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modalMode === 'create') {
            // URL Hardcoded untuk Create
            post('/admin/supportAdmin', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    Swal.fire('Berhasil', 'Tiket berhasil dibuat', 'success');
                },
            });
        } else {
            // URL Hardcoded untuk Update (PUT /admin/supportAdmin/{id})
            put(`/admin/supportAdmin/${data.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    Swal.fire('Berhasil', 'Tiket berhasil diperbarui', 'success');
                },
            });
        }
    };

    // 5. Delete Logic
    const handleDelete = (id: number) => {
        setActiveDropdown(null);
        Swal.fire({
            title: 'Hapus Tiket?',
            text: 'Data yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // URL Hardcoded untuk Delete
                router.delete(`/admin/supportAdmin/${id}`, {
                    onSuccess: () => Swal.fire('Terhapus!', 'Tiket telah dihapus.', 'success'),
                });
            }
        });
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

                    <div className="flex flex-col gap-3 md:flex-row">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <input type="text" placeholder="Cari ID, Subjek, atau User..." className="w-full rounded-xl border-none bg-white py-2.5 pr-10 pl-4 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} />
                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                                <HiSearch className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Tombol Tambah Tiket Manual */}
                        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-colors hover:bg-yellow-500">
                            <HiPlus className="h-5 w-5" />
                            Buat Bantuan
                        </button>
                    </div>
                </div>

                {/* STATS CARDS (Sama seperti sebelumnya) */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                <div className="overflow-visible rounded-2xl border border-gray-100 bg-white pb-10 shadow-sm">
                    {' '}
                    {/* overflow-visible penting untuk dropdown */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-yellow-400 text-gray-900">
                                <tr>
                                    <th className="rounded-tl-2xl px-6 py-4 font-bold">ID Bantuan</th>
                                    <th className="px-6 py-4 font-bold">Pelapor</th>
                                    <th className="px-6 py-4 font-bold">Subjek</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="rounded-tr-2xl px-6 py-4 text-center font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                {tickets.data.length > 0 ? (
                                    tickets.data.map((ticket) => (
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
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openEditModal(ticket)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700" title="Edit">
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(ticket.id)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700" title="Hapus">
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
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

                {/* MODAL FORM */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">{modalMode === 'create' ? 'Buat Tiket Baru' : 'Edit Tiket'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                                    <HiX className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Subject */}
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Subjek</label>
                                    <input type="text" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400" value={data.subject} onChange={(e) => setData('subject', e.target.value)} placeholder="Contoh: Kendala Pembayaran..." />
                                    {errors.subject && <div className="mt-1 text-xs text-red-500">{errors.subject}</div>}
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Kategori</label>
                                    <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                                        <option value="Umum">Umum</option>
                                        <option value="Teknis">Teknis</option>
                                        <option value="Pembayaran">Pembayaran</option>
                                        <option value="Akun">Akun</option>
                                    </select>
                                    {errors.category && <div className="mt-1 text-xs text-red-500">{errors.category}</div>}
                                </div>

                                {/* Status (Hanya Muncul saat Edit atau jika Admin ingin set status awal) */}
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Status</label>
                                    <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400" value={data.status} onChange={(e) => setData('status', e.target.value as any)}>
                                        <option value="pending">Pending</option>
                                        <option value="diproses">Sedang Diproses</option>
                                        <option value="selesai">Selesai</option>
                                    </select>
                                    {errors.status && <div className="mt-1 text-xs text-red-500">{errors.status}</div>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Deskripsi Masalah</label>
                                    <textarea rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Jelaskan detail masalah..."></textarea>
                                    {errors.description && <div className="mt-1 text-xs text-red-500">{errors.description}</div>}
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="rounded-lg bg-yellow-400 px-6 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-yellow-500 disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}
