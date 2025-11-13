'use client';

import Footer from '@/components/footer'; // 2. Import Footer (Opsional, agar konsisten)
import Navbar from '@/components/navbar'; // 1. Import Navbar
import { useState } from 'react';

// --- Tipe Data & Mock Data (Tetap Sama) ---
type CalendarEvent = {
    id: number;
    date: string;
    title: string;
    color: 'blue' | 'green' | 'yellow' | 'red';
    icon?: string;
};

const MOCK_EVENTS: CalendarEvent[] = [];

const MONTH_NAMES = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];
const DAYS_OF_WEEK_FULL = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
];

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

// --- Komponen Utama ---
export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState(MOCK_EVENTS);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // --- Logic (Tetap Sama) ---
    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const buildCalendarGrid = () => {
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
        const todayStr = today.toISOString().split('T')[0];
        const calendarDays = [];

        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = daysInPrevMonth - i + 1;
            const dateStr = `${prevMonthYear}-${String(prevMonthMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            calendarDays.push({
                day,
                isCurrentMonth: false,
                dateStr,
                events: events.filter((e) => e.date === dateStr),
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = i;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            calendarDays.push({
                day,
                isCurrentMonth: true,
                dateStr,
                isToday: dateStr === todayStr,
                events: events.filter((e) => e.date === dateStr),
            });
        }

        const remainingCells = 42 - calendarDays.length;
        for (let i = 1; i <= remainingCells; i++) {
            const day = i;
            const dateStr = `${nextMonthYear}-${String(nextMonthMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            calendarDays.push({
                day,
                isCurrentMonth: false,
                dateStr,
                events: events.filter((e) => e.date === dateStr),
            });
        }
        return calendarDays;
    };

    const calendarDays = buildCalendarGrid();

    return (
        // 3. Wrapper Pembungkus Utama: bg-white untuk memaksa background putih
        <div className="min-h-screen bg-white font-poppins text-gray-900">
            {/* 4. Navbar dipanggil di sini */}
            <Navbar />

            {/* 5. Padding Top (pt-36) agar konten tidak ketutup Navbar */}
            <main className="px-4 pt-36 pb-20">
                <div className="mx-auto w-full max-w-7xl rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    <h1 className="mt-8 mb-6 text-center text-6xl font-semibold text-saintara-yellow">
                        Kalender Agenda
                    </h1>
                    <hr />

                    {/* Header Navigasi Kalender */}
                    <div className="mt-4 mb-5 flex items-center justify-between">
                        <div className="flex-1"></div>
                        <div className="my-5 flex flex-1 items-center justify-center gap-2">
                            <button
                                onClick={handlePrevMonth}
                                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-saintara-yellow/20 hover:text-saintara-black"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <span
                                className="w-auto px-4 text-center text-2xl font-bold text-saintara-black"
                                style={{ minWidth: '200px' }}
                            >
                                {MONTH_NAMES[month]} {year}
                            </span>
                            <button
                                onClick={handleNextMonth}
                                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-saintara-yellow/20 hover:text-saintara-black"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-end gap-4">
                            <button
                                onClick={goToToday}
                                className="rounded-lg border-2 border-saintara-black px-4 py-2 text-sm font-semibold text-saintara-black transition-colors duration-300 hover:bg-saintara-black hover:text-white"
                            >
                                Today
                            </button>
                            <button className="transform rounded-lg bg-saintara-yellow px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-saintara-black focus:ring-4 focus:ring-yellow-300">
                                + Add Event
                            </button>
                        </div>
                    </div>

                    {/* Grid Kalender */}
                    <div className="grid grid-cols-7 gap-1">
                        {DAYS_OF_WEEK_FULL.map((day) => (
                            <div
                                key={day}
                                className="pt-2 pb-3 pl-2 text-left text-sm font-semibold text-gray-600"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 grid-rows-6 gap-2">
                        {calendarDays.map(
                            ({
                                day,
                                isCurrentMonth,
                                dateStr,
                                isToday,
                                events,
                            }) => {
                                const dayHighlightColor = events[0]?.color;
                                const highlightClass =
                                    dayHighlightColor && isCurrentMonth
                                        ? getDayHighlightClasses(
                                              dayHighlightColor,
                                          )
                                        : 'border-gray-100';

                                return (
                                    <div
                                        key={dateStr}
                                        className={`h-32 border p-2 ${highlightClass} flex flex-col items-start overflow-hidden rounded-lg transition-colors ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}`}
                                    >
                                        <span
                                            className={`mb-1.5 text-sm font-semibold ${isCurrentMonth ? 'text-saintara-black' : 'text-gray-400'} ${isToday ? 'flex h-7 w-7 items-center justify-center rounded-full bg-saintara-yellow text-saintara-black' : 'p-1'}`}
                                        >
                                            {day}
                                        </span>
                                        <div className="flex w-full flex-col gap-1 overflow-y-auto pr-1 text-xs">
                                            {events.map((event) => (
                                                <div
                                                    key={event.id}
                                                    title={event.title}
                                                    className={`rounded-md p-1.5 ${getEventColorClasses(event.color)} truncate`}
                                                >
                                                    {event.icon} {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
