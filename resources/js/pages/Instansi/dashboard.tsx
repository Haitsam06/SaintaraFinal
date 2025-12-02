// resources/js/Pages/Instansi/dashboard.tsx

import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, usePage } from '@inertiajs/react';
import { HiOutlineArrowDown } from 'react-icons/hi';
import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
} from 'recharts';

/* ========= TIPE DATA ========= */

type HasilTesRow = {
    no: number;
    nama: string;
    devisi: string | null;
    tgl: string;
    email: string;
};

type Summary = {
    total_participants: number;
    latest_reports: number;
};

type PieSlice = {
    label: string;
    value: number;
};

type OrgBar = {
    label: string;
    value: number;
};

interface PageProps {
    summary?: Summary;
    hasilTes?: any[];
    pieData?: any[];
    orgData?: any[];
    instansi_name?: string;
    instansi_tagline?: string;
    [key: string]: any;
}

/* ========= WARNA ========= */

const PIE_COLORS = ['#22C55E', '#2563EB', '#FACC15', '#FB923C', '#A855F7', '#14B8A6'];

/* ========= ELEGANT PIE CHART ala ADMIN ========= */

type ElegantPieChartProps = {
    data: PieSlice[];
    total: number;
};

const ElegantPieChart: React.FC<ElegantPieChartProps> = ({ data, total }) => {
    if (!data || data.length === 0 || total === 0) {
        return (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 text-center text-xs text-gray-400">
                Belum ada data dari Excel
            </div>
        );
    }

    // hitung segmen 0–100% untuk conic-gradient
    let current = 0;
    const segments = data.map((item, idx) => {
        const pct = (item.value / total) * 100;
        const start = current;
        const end = current + pct;
        current = end;
        return {
            ...item,
            start,
            end,
            color: PIE_COLORS[idx % PIE_COLORS.length],
        };
    });

    const background = `conic-gradient(${segments
        .map((seg) => `${seg.color} ${seg.start}% ${seg.end}%`)
        .join(', ')})`;

    return (
        <div className="flex items-center gap-6">
            {/* Donut ala admin */}
            <div className="relative h-40 w-40">
                <div
                    className="h-40 w-40 rounded-full shadow-inner"
                    style={{ background }}
                />
                <div className="pointer-events-none absolute inset-0 m-auto flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                    <div className="text-xs text-gray-400">Total peserta</div>
                    <div className="text-2xl font-bold text-gray-900">{total}</div>
                </div>
            </div>

            {/* Legend ala admin */}
            <div className="hidden flex-1 flex-col space-y-2 text-xs text-gray-600 md:flex">
                {segments.map((item, idx) => {
                    const percent = ((item.value / total) * 100).toFixed(1);
                    return (
                        <div key={idx} className="flex items-center gap-3">
                            <span
                                className="inline-block h-3 w-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="flex-1 truncate">
                                <span
                                    className="truncate font-semibold text-gray-800"
                                    title={item.label}
                                >
                                    {item.label}
                                </span>
                            </div>
                            <span className="text-gray-500">{item.value} org</span>
                            <span className="w-12 text-right font-semibold text-gray-800">
                                {percent}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ========= ORGANISASI BAR CHART (lebih keren) ========= */

type OrgChartProps = {
    data: OrgBar[];
};

const OrgBarChart: React.FC<OrgChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                Belum ada data devisi dari Excel
            </div>
        );
    }

    const maxValue = data.reduce((max, item) => Math.max(max, item.value), 0) || 1;

    return (
        <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 16, left: 0, bottom: 30 }}
                >
                    <defs>
                        <linearGradient id="orgBarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FACC15" />
                            <stop offset="50%" stopColor="#FB923C" />
                            <stop offset="100%" stopColor="#2563EB" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={48}
                    />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        domain={[0, maxValue]}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: 8,
                            borderColor: '#E5E7EB',
                            boxShadow:
                                '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                            fontSize: '0.75rem',
                        }}
                        formatter={(value: any) => [`${value} peserta`, 'Jumlah']}
                    />
                    <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        fill="url(#orgBarGradient)"
                        maxBarSize={40}
                    >
                        <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(val: any) => `${val}`}
                            style={{ fontSize: '0.7rem', fill: '#374151' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

/* ========= KOMPONEN DASHBOARD ========= */

export default function Dashboard() {
    const {
        summary,
        hasilTes = [],
        pieData = [],
        orgData = [],
        instansi_name,
        instansi_tagline,
    } = usePage<PageProps>().props;

    const safeSummary: Summary = summary ?? {
        total_participants: 0,
        latest_reports: 0,
    };

    const bannerTitle =
        instansi_tagline ??
        `${instansi_name ?? 'Instansi Anda'}, Mari Bertumbuh Lebih Cepat.`;

    // handler download form tes
    const handleDownloadFormTes = () => {
        window.location.href = '/instansi/download-form-tes';
    };

    return (
        <InstansiLayout>
            <Head title="Dashboard Institusi" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* === KOLOM KIRI (2/3) === */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Ringkasan Utama */}
                    <div className="flex flex-col items-center justify-between rounded-xl bg-white p-6 shadow-sm md:flex-row">
                        <div className="text-center md:text-left">
                            <h3 className="mb-2 text-lg font-bold text-gray-800">
                                Ringkasan Utama
                            </h3>
                            <p className="text-sm text-gray-500">Total peserta</p>
                            <h4 className="mt-2 text-6xl font-bold text-gray-900">
                                {safeSummary.total_participants}
                            </h4>
                        </div>

                        <div className="relative mt-6 md:mt-0">
                            <ElegantPieChart
                                data={pieData as PieSlice[]}
                                total={safeSummary.total_participants}
                            />
                        </div>
                    </div>

                    {/* Hasil Peserta Tes */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Hasil Peserta Tes
                                </h3>
                                <p className="hidden text-sm text-gray-500 md:block">
                                    Total peserta{' '}
                                    <span className="font-semibold text-gray-900">
                                        {safeSummary.total_participants}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-gray-500">
                                    <tr>
                                        <th className="px-3 py-2">No</th>
                                        <th className="px-3 py-2">Nama</th>
                                        <th className="px-3 py-2">Devisi</th>
                                        <th className="px-3 py-2">Tanggal</th>
                                        <th className="px-3 py-2">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="font-medium text-gray-800">
                                    {hasilTes.map((tes: HasilTesRow) => (
                                        <tr
                                            key={tes.no}
                                            className="border-b border-gray-100"
                                        >
                                            <td className="px-3 py-3">{tes.no}</td>
                                            <td className="px-3 py-3">{tes.nama}</td>
                                            <td className="px-3 py-3">
                                                {tes.devisi ?? '-'}
                                            </td>
                                            <td className="px-3 py-3">{tes.tgl}</td>
                                            <td className="px-3 py-3">{tes.email}</td>
                                        </tr>
                                    ))}
                                    {hasilTes.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-3 py-4 text-center text-sm text-gray-400"
                                            >
                                                Belum ada peserta tes (belum ada data di
                                                Excel).
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="relative h-48 overflow-hidden rounded-xl shadow-sm">
                        <img
                            src="https://via.placeholder.com/800x200.png?text=Placeholder+Image"
                            alt={bannerTitle}
                            className="h-full w-full object-cover"
                        />
                        <div className="bg-opacity-40 absolute inset-0 bg-black" />
                        <h3 className="absolute bottom-6 left-6 max-w-sm text-2xl font-bold text-white">
                            {bannerTitle}
                        </h3>
                    </div>
                </div>

                {/* === KOLOM KANAN === */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Laporan Terbaru */}
                    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                        <p className="text-sm text-gray-500">Laporan terbaru</p>
                        <h4 className="my-4 text-7xl font-bold text-gray-900">
                            {safeSummary.latest_reports}
                        </h4>
                    </div>

                    {/* Organisasi - bar chart */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">
                            Golongan/Batch
                        </h3>
                        <OrgBarChart data={orgData as OrgBar[]} />
                    </div>
                </div>
            </div>
        </InstansiLayout>
    );
}
