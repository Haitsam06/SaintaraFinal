import DashboardLayout from '@/layouts/dashboardLayoutAdmin'; // Sesuaikan path ini jika beda folder
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';
import Swal from 'sweetalert2'; // Optional: Jika tidak punya, ganti alert biasa

// Tipe Data
interface Review {
    id: number;
    author: string;
    content: string;
    image: string;
    date: string;
}

interface PageProps {
    reviews: {
        data: Review[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function ReviewIndex() {
    const { reviews, flash } = usePage<any>().props as PageProps;

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Form Handling (Inertia useForm)
    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        content: '',
    });

    // Buka Modal Tambah
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Buka Modal Edit
    const openEditModal = (review: Review) => {
        setIsEditMode(true);
        setEditId(review.id);
        setData({ content: review.content });
        clearErrors();
        setIsModalOpen(true);
    };

    // Submit Form
    // Submit Form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitOptions = {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                Swal.fire('Berhasil', 'Data berhasil disimpan', 'success');
            },
            onError: (err: any) => {
                console.error(err);
                Swal.fire('Gagal', 'Gagal menyimpan data. Cek inputan.', 'error');
            },
        };

        if (isEditMode && editId) {
            // GANTI route() DENGAN URL MANUAL
            // Menggunakan backtick (`) untuk memasukkan variabel editId
            put(`/admin/reviews/${editId}`, submitOptions);
        } else {
            // GANTI route() DENGAN URL MANUAL
            post('/admin/reviews', submitOptions);
        }
    };

    // Handle Delete
    // Handle Delete
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Yakin hapus?',
            text: 'Data review akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                // GANTI route() DENGAN URL MANUAL
                router.delete(`/admin/reviews/${id}`, {
                    onSuccess: () => Swal.fire('Terhapus!', 'Review telah dihapus.', 'success'),
                });
            }
        });
    };
    
    return (
        <DashboardLayout>
            <Head title="Manajemen Review" />

            {/* Header Page */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Review</h1>
                    <p className="text-sm text-gray-500">Kelola testimoni dan ulasan pengguna.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-transform hover:scale-105 hover:bg-yellow-500">
                    <HiPlus className="h-5 w-5" />
                    Tambah Review
                </button>
            </div>

            {/* Content Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Isi Review</th>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.data.length > 0 ? (
                                reviews.data.map((review) => (
                                    <tr key={review.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img className="h-10 w-10 rounded-full border border-gray-200 object-cover" src={review.image} alt={review.author} />
                                                <span className="font-semibold text-gray-900">{review.author}</span>
                                            </div>
                                        </td>
                                        <td className="max-w-md truncate px-6 py-4">"{review.content}"</td>
                                        <td className="px-6 py-4">{review.date}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(review)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100" title="Edit">
                                                    <HiPencil className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDelete(review.id)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100" title="Hapus">
                                                    <HiTrash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        Tidak ada data review ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                    <div className="text-xs text-gray-500">
                        Halaman {reviews.current_page} dari {reviews.last_page}
                    </div>
                    <div className="flex gap-1">{reviews.links.map((link, key) => (link.url ? <Link key={key} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`rounded px-3 py-1 text-xs font-medium transition ${link.active ? 'bg-yellow-400 font-bold text-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} /> : <span key={key} dangerouslySetInnerHTML={{ __html: link.label }} className="rounded px-3 py-1 text-xs text-gray-400" />))}</div>
                </div>
            </div>

            {/* === MODAL CREATE / EDIT === */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-bold text-gray-900">{isEditMode ? 'Edit Review' : 'Tambah Review Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Isi Review</label>
                                <textarea value={data.content} onChange={(e) => setData('content', e.target.value)} rows={4} className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-slate-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none" placeholder="Tulis pendapat pengguna disini..."></textarea>
                                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
