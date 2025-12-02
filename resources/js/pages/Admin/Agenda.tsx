import AdminDashboardLayout from '@/layouts/dashboardLayoutAdmin';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { HiCalendar, HiChevronLeft, HiChevronRight, HiClock, HiMicrophone, HiPlus, HiUserGroup, HiVideoCamera, HiX } from 'react-icons/hi';

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
    const { data, setData, post, processing, reset, errors, transform } = useForm({
        nama_agenda: '',
        tanggal: '',
        waktu_mulai: '',
        waktu_selesai: '',
        waktu: '',
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

    // === SUBMIT FORM ===
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            waktu: `${data.waktu_mulai} - ${data.waktu_selesai}`,
        }));

        post('/admin/agendaAdmin', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const getIcon = (type: string) => {
        if (type === 'green') return <HiVideoCamera className="h-5 w-5 text-green-600" />;
        if (type === 'red') return <HiUserGroup className="h-5 w-5 text-red-600" />;
        return <HiMicrophone className="h-5 w-5 text-blue-600" />;
    };

    const getBgColor = (type: string) => {
        if (type === 'green') return 'bg-green-50';
        if (type === 'red') return 'bg-red-50';
        return 'bg-blue-50';
    };

    return (
        <AdminDashboardLayout>
            <Head title="Agenda Admin" />

            <div className="space-y-6 font-sans">
                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Agenda & Kalender</h1>
                        <p className="text-sm text-gray-500">Kelola jadwal kegiatan dan pertemuan tim.</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-yellow-500 hover:shadow-md">
                        <HiPlus className="h-5 w-5" /> Tambah Agenda
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* === KALENDER UTAMA (KIRI - 2 KOLOM) === */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
                        {/* Header Kalender */}
                        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                                    <HiCalendar className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 capitalize">{monthName}</h2>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => changeMonth(-1)} className="rounded-full bg-gray-50 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                                    <HiChevronLeft className="h-5 w-5" />
                                </button>
                                <button onClick={() => changeMonth(1)} className="rounded-full bg-gray-50 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                                    <HiChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Grid Kalender */}
                        <div className="w-full">
                            <div className="mb-6 grid grid-cols-7 text-center">
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                                    <div key={day} className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-y-6">
                                {calendarGrid.map((item, index) => (
                                    <div key={index} className="relative flex flex-col items-center">
                                        {item.day && (
                                            <div
                                                className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${item.active ? 'scale-110 bg-yellow-400 font-bold text-gray-900 shadow-md' : 'text-gray-700 hover:bg-gray-50'} `}
                                            >
                                                {item.day}
                                                {/* Dot Indicator */}
                                                {item.dot && <span className={`absolute -bottom-1 h-1.5 w-1.5 rounded-full border border-white ${item.dot === 'blue' ? 'bg-blue-500' : item.dot === 'green' ? 'bg-green-500' : 'bg-red-500'} `}></span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend Kategori */}
                        <div className="mt-8 flex justify-center gap-6 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                <span className="text-xs text-gray-500">Umum</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="text-xs text-gray-500">Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                <span className="text-xs text-gray-500">Penting</span>
                            </div>
                        </div>
                    </div>

                    {/* === LIST AGENDA (KANAN - 1 KOLOM) === */}
                    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-1">
                        <h3 className="mb-6 text-lg font-bold text-gray-800">Agenda Terdekat</h3>

                        {upcoming.length > 0 ? (
                            <div className="relative flex-1 space-y-6 pl-4">
                                {/* Garis Timeline */}
                                <div className="absolute top-2 bottom-2 left-0 w-0.5 bg-gray-100"></div>

                                {upcoming.map((item) => (
                                    <div key={item.id} className="group relative cursor-pointer pl-6">
                                        {/* Dot Indicator pada Timeline */}
                                        <span className={`absolute top-1.5 -left-[5px] h-3 w-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${item.type === 'red' ? 'bg-red-500' : item.type === 'green' ? 'bg-green-500' : 'bg-blue-500'} `}></span>

                                        <div className={`rounded-xl p-4 transition-all duration-200 hover:shadow-md ${getBgColor(item.type)}`}>
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-bold text-gray-800">{item.title}</h4>
                                                <div className="opacity-50">{getIcon(item.type)}</div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <HiCalendar className="h-3.5 w-3.5" />
                                                    <span>{item.date_string}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <HiClock className="h-3.5 w-3.5" />
                                                    <span>{item.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                                <div className="mb-3 rounded-full bg-gray-50 p-4">
                                    <HiCalendar className="h-8 w-8 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-400">Belum ada agenda mendatang.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* === MODAL TAMBAH AGENDA === */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all">
                        <div className="w-full max-w-md scale-100 transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
                            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                                <h3 className="text-xl font-bold text-gray-900">Buat Agenda Baru</h3>
                                <button onClick={() => setShowModal(false)} className="rounded-full bg-gray-50 p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                                    <HiX className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Input Judul */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-gray-700">Judul Agenda</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.nama_agenda}
                                        onChange={(e) => setData('nama_agenda', e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                        placeholder="Contoh: Meeting Mingguan"
                                    />
                                    {errors.nama_agenda && <p className="mt-1 text-xs text-red-500">{errors.nama_agenda}</p>}
                                </div>

                                {/* Input Tanggal & Waktu */}
                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-gray-700">Tanggal</label>
                                        <input
                                            type="date"
                                            required
                                            value={data.tanggal}
                                            onChange={(e) => setData('tanggal', e.target.value)}
                                            className="w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                            style={{ colorScheme: 'light' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-gray-700">Waktu</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="time"
                                                required
                                                value={data.waktu_mulai}
                                                onChange={(e) => setData('waktu_mulai', e.target.value)}
                                                className="w-full cursor-pointer rounded-xl border border-gray-300 px-3 py-2.5 text-center text-sm text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                            />
                                            <span className="font-bold text-gray-400">-</span>
                                            <input
                                                type="time"
                                                required
                                                value={data.waktu_selesai}
                                                onChange={(e) => setData('waktu_selesai', e.target.value)}
                                                className="w-full cursor-pointer rounded-xl border border-gray-300 px-3 py-2.5 text-center text-sm text-gray-900 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pilihan Kategori */}
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Kategori</label>
                                    <div className="flex gap-3">
                                        {[
                                            { val: 'blue', label: 'Umum', bg: 'bg-blue-500' },
                                            { val: 'green', label: 'Online', bg: 'bg-green-500' },
                                            { val: 'red', label: 'Penting', bg: 'bg-red-500' },
                                        ].map((opt) => (
                                            <label
                                                key={opt.val}
                                                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-2.5 transition-all ${data.tipe === opt.val ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400' : 'border-gray-200 hover:bg-gray-50'} `}
                                            >
                                                <input type="radio" name="tipe" value={opt.val} checked={data.tipe === opt.val} onChange={(e) => setData('tipe', e.target.value)} className="hidden" />
                                                <span className={`h-2.5 w-2.5 rounded-full ${opt.bg}`}></span>
                                                <span className="text-xs font-bold text-gray-700">{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Tombol Simpan */}
                                <div className="pt-4">
                                    <button type="submit" disabled={processing} className="w-full rounded-xl bg-yellow-400 py-3 text-sm font-bold text-gray-900 shadow-lg shadow-yellow-100 transition-all hover:bg-yellow-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70">
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
