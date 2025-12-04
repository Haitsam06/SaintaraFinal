'use client';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { HiClock, HiMenuAlt2, HiX } from 'react-icons/hi'; // Icons for modal

// --- Types ---
type CalendarEvent = {
    id: number;
    date: string; // YYYY-MM-DD
    title: string;
    color: 'blue' | 'green' | 'yellow' | 'red';
    // --- New Data Fields ---
    time: string; // from 'waktu' column
    description?: string; // from 'deskripsi' column
    icon?: string;
};

interface CalendarPageProps {
    events: CalendarEvent[];
    upcoming: any[];
    currentDateStr: string;
}

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAYS_OF_WEEK_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// --- HELPER FUNCTIONS ---
const getEventColorClasses = (color: CalendarEvent['color']) => {
    switch (color) {
        case 'blue':
            return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
        case 'green':
            return 'bg-green-100 text-green-800 border-l-4 border-green-500';
        case 'yellow':
            return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
        case 'red':
            return 'bg-red-100 text-red-800 border-l-4 border-red-500';
        default:
            return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
    }
};

const getDayHighlightClasses = (color: CalendarEvent['color']) => {
    switch (color) {
        case 'blue':
            return 'border-blue-300 bg-blue-50/50';
        case 'green':
            return 'border-green-300 bg-green-50/50';
        case 'yellow':
            return 'border-yellow-300 bg-yellow-50/50';
        case 'red':
            return 'border-red-300 bg-red-50/50';
        default:
            return 'border-gray-200';
    }
};

// --- AGENDA DETAIL MODAL COMPONENT ---
const AgendaDetailModal = ({ isOpen, onClose, date, events }: { isOpen: boolean; onClose: () => void; date: string; events: CalendarEvent[] }) => {
    if (!isOpen) return null;

    // Format date for header (e.g., Senin, 22 November 2025)
    const dateObj = new Date(date);
    const dateDisplay = isNaN(dateObj.getTime()) ? date : dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-saintara-yellow/10 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Detail Agenda</h3>
                        <p className="text-sm text-gray-600">{dateDisplay}</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                        <HiX className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[60vh] overflow-y-auto p-6">
                    {events.length > 0 ? (
                        <div className="space-y-4">
                            {events.map((event) => (
                                <div key={event.id} className={`rounded-xl border p-4 shadow-sm ${getEventColorClasses(event.color)} bg-opacity-20 border-opacity-50`}>
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-base font-bold">{event.title}</h4>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 text-sm font-medium opacity-90">
                                        <HiClock className="h-4 w-4" />
                                        <span>{event.time || '-'}</span>
                                    </div>

                                    {event.description && (
                                        <div className="mt-3 border-t border-black/10 pt-2 text-sm">
                                            <div className="flex gap-2">
                                                <HiMenuAlt2 className="mt-0.5 h-4 w-4 shrink-0" />
                                                <p className="leading-relaxed whitespace-pre-line">{event.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 italic">Tidak ada agenda pada tanggal ini.</p>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-3 text-right">
                    <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
export default function Calendar({ events, upcoming, currentDateStr }: CalendarPageProps) {
    const currentDate = useMemo(() => new Date(currentDateStr), [currentDateStr]);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // --- STATE FOR MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
    const [selectedDateStr, setSelectedDateStr] = useState<string>('');

    // === NAVIGATION LOGIC ===
    const changeMonth = (offset: number) => {
        const newDate = new Date(year, month + offset, 1);
        const newDateStr = newDate.toISOString().split('T')[0];
        router.get('/kalender-agenda', { date: newDateStr }, { preserveScroll: true, preserveState: true });
    };

    const handlePrevMonth = () => changeMonth(-1);
    const handleNextMonth = () => changeMonth(1);
    const goToToday = () => router.get('/kalender-agenda', {}, { preserveScroll: true });

    // === HANDLE DATE CLICK ===
    const handleDateClick = (dateStr: string, dailyEvents: CalendarEvent[]) => {
        // Only open modal if there are events, OR if you want users to see "No events" message
        // Here we open it regardless, but the UI shows "No events" if empty.
        // You can add `if (dailyEvents.length > 0)` check if preferred.
        if (dailyEvents.length > 0) {
            setSelectedDateStr(dateStr);
            setSelectedDateEvents(dailyEvents);
            setIsModalOpen(true);
        }
    };

    // --- GRID BUILD LOGIC ---
    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        const prevMonthYear = prevMonth.getFullYear();
        const prevMonthMonth = prevMonth.getMonth();
        const nextMonth = new Date(year, month + 1, 1);
        const nextMonthYear = nextMonth.getFullYear();
        const nextMonthMonth = nextMonth.getMonth();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0].substring(0, 10);
        const currentMonthYearStr = new Date(year, month, 1).toISOString().substring(0, 7);

        const calendarDays = [];
        const eventsMap = new Map();

        events.forEach((event) => {
            const dateKey = event.date.substring(0, 10);
            if (!eventsMap.has(dateKey)) {
                eventsMap.set(dateKey, []);
            }
            eventsMap.get(dateKey).push(event);
        });

        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = daysInPrevMonth - i + 1;
            const dateStr = `${prevMonthYear}-${String(prevMonthMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            calendarDays.push({ day, isCurrentMonth: false, dateStr, events: eventsMap.get(dateStr) || [] });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            calendarDays.push({
                day: i,
                isCurrentMonth: true,
                dateStr,
                isToday: dateStr === todayStr && currentMonthYearStr === todayStr.substring(0, 7),
                events: eventsMap.get(dateStr) || [],
            });
        }

        const remainingCells = 42 - calendarDays.length;
        for (let i = 1; i <= remainingCells; i++) {
            const day = i;
            const dateStr = `${nextMonthYear}-${String(nextMonthMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            calendarDays.push({ day, isCurrentMonth: false, dateStr, events: eventsMap.get(dateStr) || [] });
        }
        return calendarDays;
    }, [year, month, events]);

    return (
        <div className="min-h-screen bg-white font-poppins text-gray-900">
            <Navbar />

            <main className="px-4 pt-36 pb-20">
                <div className="mx-auto w-full max-w-7xl rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    <h1 className="mt-8 mb-6 text-center text-3xl font-semibold text-saintara-yellow md:text-6xl">Kalender Agenda</h1>
                    <hr />

                    <div className="mt-8 grid grid-cols-1 gap-8">
                        <div className="w-full">
                            {/* Calendar Header Navigation */}
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex-1"></div>
                                <div className="my-5 flex flex-1 items-center justify-center gap-2">
                                    <button onClick={handlePrevMonth} className="rounded-full p-2 text-gray-600 transition-colors hover:bg-saintara-yellow/20 hover:text-saintara-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className="w-auto px-4 text-center text-xl font-bold text-saintara-black md:text-2xl" style={{ minWidth: '200px' }}>
                                        {MONTH_NAMES[month]} {year}
                                    </span>
                                    <button onClick={handleNextMonth} className="rounded-full p-2 text-gray-600 transition-colors hover:bg-saintara-yellow/20 hover:text-saintara-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-1 items-center justify-end gap-4">
                                    <button onClick={goToToday} className="rounded-lg border-2 border-saintara-black px-4 py-2 text-sm font-semibold text-saintara-black transition-colors duration-300 hover:bg-saintara-black hover:text-white">
                                        Today
                                    </button>
                                </div>
                            </div>

                            {/* Day Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {DAYS_OF_WEEK_FULL.map((day) => (
                                    <div key={day} className="pt-2 pb-3 pl-2 text-left text-sm font-semibold text-gray-600">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Date Grid */}
                            <div className="grid grid-cols-7 grid-rows-6 gap-2">
                                {calendarDays.map(({ day, isCurrentMonth, dateStr, isToday, events }) => {
                                    const dayHighlightColor = events.length > 0 ? events[0].color : null;
                                    const highlightClass = dayHighlightColor && isCurrentMonth ? getDayHighlightClasses(dayHighlightColor) : 'border-gray-100';
                                    const hasEvents = events.length > 0;

                                    return (
                                        <div key={dateStr} onClick={() => handleDateClick(dateStr, events)} className={`flex h-32 flex-col items-start overflow-hidden rounded-lg border p-2 transition-all ${highlightClass} ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-60'} ${hasEvents ? 'cursor-pointer hover:z-10 hover:scale-[1.01] hover:shadow-md' : ''} `}>
                                            <span className={`mb-1.5 text-sm font-semibold ${isCurrentMonth ? 'text-saintara-black' : 'text-gray-400'} ${isToday ? 'flex h-7 w-7 items-center justify-center rounded-full bg-saintara-yellow text-saintara-black' : 'p-1'}`}>{day}</span>

                                            <div className="flex w-full flex-col gap-1 overflow-y-auto pr-1 text-xs">
                                                {events.map((event) => (
                                                    <div key={event.id} title={event.title} className={`rounded-md p-1.5 ${getEventColorClasses(event.color)} truncate`}>
                                                        {/* Show time snippet in grid if available */}
                                                        {event.time && <span className="mr-1 font-bold">{event.time.split('-')[0].trim()}</span>}
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* RENDER MODAL */}
            <AgendaDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} date={selectedDateStr} events={selectedDateEvents} />
        </div>
    );
}
