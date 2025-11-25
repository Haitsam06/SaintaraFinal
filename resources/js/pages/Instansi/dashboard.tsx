import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, usePage } from '@inertiajs/react';
import { FaDownload } from 'react-icons/fa';
import { HiOutlineArrowDown } from 'react-icons/hi';
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
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
    hasilTes?: HasilTesRow[];
    pieData?: PieSlice[];
    orgData?: OrgBar[];
}

/* ========= WARNA ========= */

const PIE_COLORS = ['#22C55E', '#2563EB', '#FACC15', '#FB923C', '#A855F7', '#14B8A6'];
const BAR_COLOR = '#2563EB';

/* ========= ELEGANT PIE CHART ========= */

type ElegantPieChartProps = {
    data: PieSlice[];
    total: number;
};

const ElegantPieChart: React.FC<ElegantPieChartProps> = ({ data, total }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 text-center text-xs text-gray-400">
                Belum ada data dari Excel
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={2}
                            stroke="#ffffff"
                            strokeWidth={2}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`slice-${index}`}
                                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: 8,
                                borderColor: '#E5E7EB',
                                boxShadow:
                                    '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                                fontSize: '0.75rem',
                            }}
                            formatter={(value: any) => [`${value} peserta`, 'Jumlah']}
                            labelFormatter={(label) => `File: ${label}`}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute flex h-40 w-40 flex-col items-center justify-center text-center">
                    <div className="text-xs text-gray-400">Total peserta</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {total}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="hidden flex-col space-y-1 text-xs text-gray-600 md:flex">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                        />
                        <span className="truncate max-w-[140px]" title={item.label}>
                            {item.label}
                        </span>
                        <span className="ml-auto font-semibold text-gray-800">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ========= ORGANISASI BAR CHART ========= */

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

    return (
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={50}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
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
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={BAR_COLOR} />
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
    } = usePage<PageProps>().props;

    const safeSummary: Summary = summary ?? {
        total_participants: 0,
        latest_reports: 0,
    };

    // handler download form tes
    const handleDownloadFormTes = () => {
        // route name: instansi.tes.downloadForm
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
                                data={pieData}
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

                            <button
                                type="button"
                                onClick={handleDownloadFormTes}
                                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"
                            >
                                <HiOutlineArrowDown className="h-5 w-5" />
                                Unduh Form Tes
                            </button>
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
                                        <th className="px-3 py-2">Unduh</th>
                                    </tr>
                                </thead>
                                <tbody className="font-medium text-gray-800">
                                    {hasilTes.map((tes) => (
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
                                            <td className="px-3 py-3">
                                                <button
                                                    type="button"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
                                                >
                                                    <FaDownload className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {hasilTes.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-3 py-4 text-center text-sm text-gray-400"
                                            >
                                                Belum ada peserta tes (belum ada data di Excel).
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
                            alt="Banner PT Maju Jaya"
                            className="h-full w-full object-cover"
                        />
                        <div className="bg-opacity-40 absolute inset-0 bg-black" />
                        <h3 className="absolute bottom-6 left-6 max-w-sm text-2xl font-bold text-white">
                            PT. Maju Jaya Bersama, Mari Bertumbuh Lebih Cepat.
                        </h3>
                    </div>
                </div>

                {/* === KOLOM KANAN (hanya 2 kartu: Laporan & Organisasi) === */}
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
                            Organisasi
                        </h3>
                        <OrgBarChart data={orgData} />
                    </div>
                </div>
            </div>
        </InstansiLayout>
    );
}
