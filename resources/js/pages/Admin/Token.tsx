import AdminLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { HiCheck, HiChevronDown, HiFilter, HiPencil, HiPlus, HiSearch, HiTicket, HiTrash, HiUser, HiX } from 'react-icons/hi';

// --- TYPES ---
interface Paket {
    id_paket: string;
    nama_paket: string;
}

interface Customer {
    id: string;
    name: string;
}

interface Token {
    id_token: string;
    pembayaran_id: string;
    customer_id: string | null;
    customer?: Customer;
    status: 'digunakan' | 'belum digunakan' | 'kadaluarsa';
    tglBeli: string;
    tglPemakaian: string | null;
    paket_id?: string;
}

interface PaginatedData<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    tokens: PaginatedData<Token>;
    pakets: Paket[];
    customers: Customer[];
    filters: { search?: string; ownership?: string };
}

// --- KOMPONEN CUSTOM: SEARCHABLE SELECT (COMBOBOX) ---
const SearchableSelect = ({ options, value, onChange, placeholder = 'Pilih...', disabled = false }: { options: Customer[]; value: string | null; onChange: (val: string) => void; placeholder?: string; disabled?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    // Cari nama label berdasarkan ID yang terpilih
    const selectedLabel = options.find((o) => o.id === value)?.name || '';

    // Sinkronkan query dengan value saat komponen dimuat atau value berubah (misal saat Edit)
    useEffect(() => {
        if (value) {
            setQuery(selectedLabel);
        } else {
            setQuery('');
        }
    }, [value, selectedLabel]);

    // Filter opsi berdasarkan ketikan user
    const filteredOptions = query === '' || query === selectedLabel ? options : options.filter((person) => person.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')));

    return (
        <div className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    className={`w-full rounded-lg border-gray-300 py-2 pr-10 pl-3 text-sm leading-5 text-gray-900 focus:border-yellow-500 focus:ring-yellow-500 ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}`}
                    placeholder={placeholder}
                    value={isOpen ? query : selectedLabel || query} // Tampilkan query saat mengetik, label saat tidak fokus
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                        if (event.target.value === '') onChange(''); // Reset jika dihapus habis
                    }}
                    onFocus={() => {
                        if (!disabled) {
                            setIsOpen(true);
                            setQuery(''); // Kosongkan agar user bisa melihat semua list
                        }
                    }}
                    disabled={disabled}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <>
                    {/* Overlay transparan untuk menutup dropdown saat klik di luar */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                            setIsOpen(false);
                            setQuery(selectedLabel); // Reset ke label terpilih jika batal
                        }}
                    ></div>

                    <ul className="ring-opacity-5 absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
                        {/* Opsi Reset (Kosongkan) */}
                        <li
                            className="relative cursor-pointer py-2 pr-4 pl-10 text-gray-900 select-none hover:bg-yellow-100"
                            onClick={() => {
                                onChange('');
                                setQuery('');
                                setIsOpen(false);
                            }}
                        >
                            <span className="block truncate font-normal text-gray-500 italic">-- Kosongkan (Token Bebas) --</span>
                        </li>

                        {filteredOptions.length === 0 ? (
                            <li className="relative cursor-default px-4 py-2 text-gray-700 select-none">Tidak ada nama yang cocok.</li>
                        ) : (
                            filteredOptions.map((person) => (
                                <li
                                    key={person.id}
                                    className={`relative cursor-pointer py-2 pr-4 pl-10 select-none ${value === person.id ? 'bg-yellow-50 text-yellow-900' : 'text-gray-900 hover:bg-yellow-100'}`}
                                    onClick={() => {
                                        onChange(person.id);
                                        setQuery(person.name);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className={`block truncate ${value === person.id ? 'font-medium' : 'font-normal'}`}>{person.name}</span>
                                    {value === person.id ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-600">
                                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    ) : null}
                                </li>
                            ))
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

// --- KOMPONEN MODAL ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
                <div className="mb-5 flex items-center justify-between border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                        <HiX size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// --- HALAMAN UTAMA ---
export default function TokenPage({ tokens, pakets, customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [ownership, setOwnership] = useState(filters.ownership || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form Inertia
    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        id_token: '',
        paket_id: '',
        customer_id: '',
        status: 'belum digunakan',
    });

    // --- HANDLERS ---

    const handleSearchAndFilter = (newSearch: string, newOwnership: string) => {
        router.get('/admin/token', { search: newSearch, ownership: newOwnership }, { preserveState: true, preserveScroll: true });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearchAndFilter(e.target.value, ownership);
    };

    const handleOwnershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOwnership(e.target.value);
        handleSearchAndFilter(search, e.target.value);
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (token: Token) => {
        setIsEditMode(true);
        clearErrors();
        const derivedPaketId = token.id_token.split('-')[0]; // Ambil kode paket dari ID Token

        setData({
            id_token: token.id_token,
            paket_id: derivedPaketId,
            customer_id: token.customer_id || '',
            status: token.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(`/admin/token/${data.id_token}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/token', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus token ini?')) {
            router.delete(`/admin/token/${id}`, { preserveScroll: true });
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'belum digunakan': 'bg-green-100 text-green-700',
            digunakan: 'bg-red-100 text-red-700',
            kadaluarsa: 'bg-gray-100 text-gray-700',
        };
        return <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status] || 'bg-yellow-100'}`}>{status}</span>;
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Token" />

            <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Token</h1>

                <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                    {/* FILTER OWNERSHIP */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <HiFilter className="h-5 w-5" />
                        </div>
                        <select value={ownership} onChange={handleOwnershipChange} className="w-full appearance-none rounded-full border-none bg-white py-2 pr-8 pl-10 text-gray-600 shadow-sm focus:ring-2 focus:ring-yellow-400 md:w-48">
                            <option value="">Semua Token</option>
                            <option value="free">Belum Ada Pemilik</option>
                            <option value="owned">Sudah Ada Pemilik</option>
                        </select>
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="relative">
                        <input type="text" value={search} onChange={handleSearchChange} placeholder="Cari ID Token..." className="w-full rounded-full border-none bg-gray-100 py-2 pr-10 pl-4 text-gray-600 focus:ring-2 focus:ring-yellow-400 md:w-64" />
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                            <HiSearch className="h-5 w-5" />
                        </div>
                    </div>

                    {/* TOMBOL CREATE */}
                    <button onClick={openCreateModal} className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-2 font-bold text-gray-900 shadow-sm transition-all hover:scale-105 hover:bg-yellow-500">
                        <HiPlus className="h-5 w-5" />
                        Generate Token
                    </button>
                </div>
            </div>

            {/* TABEL */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-yellow-400 text-gray-900">
                            <tr>
                                <th className="px-6 py-4 font-bold">ID Token</th>
                                <th className="px-6 py-4 font-bold">Pemilik</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Tgl Dibuat</th>
                                <th className="px-6 py-4 text-center font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tokens.data.length > 0 ? (
                                tokens.data.map((token) => (
                                    <tr key={token.id_token} className="transition hover:bg-yellow-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-mono font-bold text-gray-800">
                                                <HiTicket className="text-yellow-500" />
                                                {token.id_token}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-400">{token.pembayaran_id === 'MANUAL-ADMIN' ? <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-600">Manual Generate</span> : `Ref: ${token.pembayaran_id}`}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {token.customer ? (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <HiUser className="text-gray-400" />
                                                    {token.customer.name}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Tanpa Pemilik (Bebas)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(token.status)}</td>
                                        <td className="px-6 py-4">{new Date(token.tglBeli).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(token)} className="rounded-lg bg-blue-50 p-2 text-blue-500 transition hover:text-blue-700" title="Edit">
                                                    <HiPencil className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDelete(token.id_token)} className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:text-red-700" title="Hapus">
                                                    <HiTrash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        Belum ada token.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}
            <div className="mt-6 flex justify-end gap-2">
                {tokens.links.map(
                    (link, i) =>
                        link.url && (
                            <button
                                key={i}
                                onClick={() => router.get(link.url!, { search, ownership }, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded px-3 py-1 text-sm font-bold ${link.active ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            />
                        ),
                )}
            </div>

            {/* MODAL FORM (CREATE & EDIT) */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Token' : 'Generate Token Manual'}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input Paket */}
                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            Pilih Paket <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.paket_id}
                            onChange={(e) => setData('paket_id', e.target.value)}
                            disabled={isEditMode} // Tidak boleh ganti paket saat edit
                            className={`h-9 w-full rounded-lg border-gray-300 text-slate-800 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${isEditMode ? 'cursor-not-allowed bg-gray-100' : ''}`}
                        >
                            <option value="">-- Pilih Paket --</option>
                            {pakets.map((p) => (
                                <option key={p.id_paket} value={p.id_paket}>
                                    {p.nama_paket}
                                </option>
                            ))}
                        </select>
                        {!isEditMode && <p className="mt-1 text-xs text-gray-500">Menentukan kode awal token.</p>}
                        {errors.paket_id && <p className="mt-1 text-xs text-red-500">{errors.paket_id}</p>}
                    </div>

                    {/* Input Customer (Searchable) */}
                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">Customer (Opsional)</label>

                        {/* Menggunakan Custom Searchable Select */}
                        <SearchableSelect options={customers} value={data.customer_id} onChange={(val) => setData('customer_id', val)} placeholder="Ketik nama customer..." />

                        <p className="mt-1 text-xs text-gray-500">Token akan langsung milik user ini.</p>
                        {errors.customer_id && <p className="mt-1 text-xs text-red-500">{errors.customer_id}</p>}
                    </div>

                    {/* Input Status (Hanya saat Edit) */}
                    {isEditMode && (
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">Status</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="h-9 w-full rounded-lg border-gray-300 text-slate-800 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
                                <option value="belum digunakan">Belum Digunakan</option>
                                <option value="digunakan">Digunakan</option>
                                <option value="kadaluarsa">Kadaluarsa</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" disabled={processing} className="w-full rounded-lg bg-yellow-400 py-3 font-bold text-gray-900 shadow-md transition hover:bg-yellow-500 disabled:opacity-50">
                        {processing ? 'Memproses...' : isEditMode ? 'Simpan Perubahan' : 'Simpan & Generate'}
                    </button>
                </form>
            </Modal>
        </AdminLayout>
    );
}
