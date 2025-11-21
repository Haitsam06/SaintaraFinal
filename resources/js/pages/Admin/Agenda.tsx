import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiMicrophone, HiPlus, HiUserGroup, HiVideoCamera, HiX } from 'react-icons/hi';

// Tipe data dari Backend
interface AgendaProps {
    currentDate: string;
    monthName: string;
    events: { date: number; type: string }[];
    upcoming: { id: number; title: string; date_string: string; time: string; type: string }[];
}

export default function Agenda({ currentDate, monthName, events, upcoming }: AgendaProps) {
    const [calendarGrid, setCalendarGrid] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Form Inertia
    // Tambahkan 'transform' di sini untuk memanipulasi data sebelum kirim
    const { data, setData, post, processing, reset, errors, transform } = useForm({
        nama_agenda: '',
        tanggal: '',
        waktu_mulai: '', // Input jam mulai
        waktu_selesai: '', // Input jam selesai
        waktu: '', // Field gabungan untuk dikirim ke DB
        tipe: 'blue',
        deskripsi: '',
    });

    // === LOGIKA GENERATE KALENDER ===
    useEffect(() => {
        const date = new Date(currentDate);
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const daysArray = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push({ day: '', type: 'prev' });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const event = events.find((e) => e.date === i);
            daysArray.push({
                day: i,
                type: 'curr',
                active: new Date().getDate() === i && new Date().getMonth() === month,
                dot: event ? event.type : null,
            });
        }
        setCalendarGrid(daysArray);
    }, [currentDate, events]);

    // === NAVIGASI BULAN ===
    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        router.get('/admin/agendaAdmin', { date: newDate.toISOString().split('T')[0] }, { preserveState: true, preserveScroll: true });
    };

    // === SUBMIT FORM (FIXED) ===
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // 1. Transformasi Data: Gabungkan Waktu
        transform((data) => ({
            ...data,
            waktu: `${data.waktu_mulai} - ${data.waktu_selesai}`,
        }));

        // 2. Kirim Data (Tanpa properti 'data' di options, jadi TS tidak error)
        post('/admin/agendaAdmin', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const getIcon = (type: string) => {
        if (type === 'green') return <HiVideoCamera className="h-6 w-6 text-green-600" />;
        if (type === 'red') return <HiUserGroup className="h-6 w-6 text-red-600" />;
        return <HiMicrophone className="h-6 w-6 text-blue-600" />;
    };

    const getBgColor = (type: string) => {
        if (type === 'green') return 'bg-green-100 hover:bg-green-200';
        if (type === 'red') return 'bg-red-100 hover:bg-red-200';
        return 'bg-blue-100 hover:bg-blue-200';
    };

    return (
        <AdminDashboardLayout>
            <Head title="Agenda Admin" />

            <div className="relative space-y-6">
                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h1 className="text-3xl font-bold text-blue-900">Kalender</h1>
                    <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-3 font-bold text-blue-900 shadow-md transition-all hover:bg-yellow-500">
                        <HiPlus className="h-5 w-5" /> Tambah Agenda
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* === KALENDER UTAMA === */}
                    <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:col-span-2">
                        <div className="mb-8 flex items-center justify-between px-4">
                            <button onClick={() => changeMonth(-1)} className="rounded-full p-2 transition hover:bg-gray-100">
                                <HiChevronLeft className="h-6 w-6 text-gray-600" />
                            </button>
                            <h2 className="text-2xl font-bold text-blue-900 capitalize">{monthName}</h2>
                            <button onClick={() => changeMonth(1)} className="rounded-full p-2 transition hover:bg-gray-100">
                                <HiChevronRight className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="w-full">
                            <div className="mb-4 grid grid-cols-7">
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                                    <div key={day} className="text-center text-sm font-medium text-gray-400">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-x-2 gap-y-6">
                                {calendarGrid.map((item, index) => (
                                    <div key={index} className="relative flex h-10 flex-col items-center justify-center">
                                        {item.day && (
                                            <>
                                                <div className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl text-sm font-semibold transition-all md:h-10 md:w-14 ${item.active ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'}`}>{item.day}</div>
                                                {item.dot && <span className={`absolute -bottom-2 h-1.5 w-1.5 rounded-full ${item.dot === 'blue' ? 'bg-blue-500' : item.dot === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></span>}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* === LIST AGENDA TERDEKAT === */}
                    <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:col-span-1">
                        <h3 className="mb-6 text-xl font-bold text-blue-900">Agenda Terdekat</h3>
                        <div className="space-y-4">
                            {upcoming.length > 0 ? (
                                upcoming.map((item) => (
                                    <div key={item.id} className="group flex cursor-pointer items-start gap-4 rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition ${getBgColor(item.type)}`}>{getIcon(item.type)}</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-900">{item.title}</h4>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.date_string}, {item.time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">Belum ada agenda mendatang.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* === MODAL TAMBAH AGENDA === */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
                        <div className="w-full max-w-md scale-100 transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
                            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                                <h3 className="text-xl font-bold text-gray-900">Tambah Agenda Baru</h3>
                                <button onClick={() => setShowModal(false)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                    <HiX className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Judul Agenda</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.nama_agenda}
                                        onChange={(e) => setData('nama_agenda', e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                        placeholder="Contoh: Meeting Tim"
                                    />
                                    {errors.nama_agenda && <p className="mt-1 text-xs text-red-500">{errors.nama_agenda}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tanggal</label>
                                        <input
                                            type="date"
                                            required
                                            value={data.tanggal}
                                            onChange={(e) => setData('tanggal', e.target.value)}
                                            className="w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                            style={{ colorScheme: 'light' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Waktu</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                required
                                                value={data.waktu_mulai}
                                                onChange={(e) => setData('waktu_mulai', e.target.value)}
                                                className="w-full cursor-pointer rounded-xl border border-gray-300 px-3 py-2.5 text-center text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                            />
                                            <span className="font-bold text-gray-400">-</span>
                                            <input
                                                type="time"
                                                required
                                                value={data.waktu_selesai}
                                                onChange={(e) => setData('waktu_selesai', e.target.value)}
                                                className="w-full cursor-pointer rounded-xl border border-gray-300 px-3 py-2.5 text-center text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Kategori (Warna)</label>
                                    <div className="flex gap-4">
                                        {['blue', 'green', 'red'].map((color) => (
                                            <label key={color} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-all ${data.tipe === color ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input type="radio" name="tipe" value={color} checked={data.tipe === color} onChange={(e) => setData('tipe', e.target.value)} className="text-yellow-400 focus:ring-yellow-400" />
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-3 w-3 rounded-full ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-sm font-medium text-gray-700 capitalize">{color === 'blue' ? 'Umum' : color === 'green' ? 'Online' : 'Penting'}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" disabled={processing} className="w-full rounded-xl bg-yellow-400 py-3 font-bold text-blue-900 shadow-lg shadow-yellow-100 transition-all hover:bg-yellow-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70">
                                        {processing ? 'Menyimpan...' : 'Simpan Agenda'}
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
