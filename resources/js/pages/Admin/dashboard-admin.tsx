import { ProtectedRoute } from '@/hooks/useAuth'; // Import Hook Auth
import DashboardLayoutAdmin from '@/layouts/dashboardLayoutAdmin'; // Import Layout yang BENAR
import { Head } from '@inertiajs/react';
import { HiArrowSmRight, HiChatAlt2, HiCurrencyDollar, HiDesktopComputer, HiMicrophone, HiUserGroup, HiUsers } from 'react-icons/hi';
import { HiWrench } from 'react-icons/hi2';

export default function Dashboard() {
    return (
        // 1. Cek apakah user boleh masuk (Role 1 & 2)
        <ProtectedRoute requiredRoles={[1, 2]}>
            {/* 2. Bungkus dengan Layout Admin */}
            <DashboardLayoutAdmin>
                <Head title="Dashboard Admin" />

                <div className="space-y-6 font-poppins">
                    {/* --- BAGIAN 1: KARTU STATISTIK ATAS --- */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Card 1 */}
                        <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div>
                                <p className="mb-1 text-xs text-gray-400">Total Tes Bulan ini</p>
                                <h3 className="text-3xl font-bold text-gray-800">500</h3>
                            </div>
                            <div className="flex h-10 items-end gap-1">
                                <div className="h-4 w-1.5 rounded-full bg-yellow-100"></div>
                                <div className="h-6 w-1.5 rounded-full bg-yellow-200"></div>
                                <div className="h-8 w-1.5 rounded-full bg-yellow-300"></div>
                                <div className="h-10 w-1.5 rounded-full bg-yellow-500"></div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-white shadow-lg shadow-yellow-200">
                                <HiUserGroup className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Agen Aktif</p>
                                <h3 className="text-2xl font-bold text-gray-800">321</h3>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-white shadow-lg shadow-yellow-200">
                                <HiMicrophone className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Agenda Talkshow</p>
                                <h3 className="text-xl font-bold text-gray-800">12 Talkshow</h3>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-white shadow-lg shadow-yellow-200">
                                <HiChatAlt2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Agenda Webinar</p>
                                <h3 className="text-xl font-bold text-gray-800">1 Webinar</h3>
                            </div>
                        </div>
                    </div>

                    {/* --- BAGIAN 2: CHART & LIST TENGAH --- */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Donut Chart */}
                        <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
                            <h3 className="mb-6 text-xl font-bold text-gray-800">Distribusi Tes</h3>
                            <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="h-4 w-4 rounded-full bg-[#FCD34D]"></span>
                                        <span className="text-sm font-medium text-gray-600">Personal</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="h-4 w-4 rounded-full bg-[#A16207]"></span>
                                        <span className="text-sm font-medium text-gray-600">Institution</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="h-4 w-4 rounded-full bg-[#FFFF00]"></span>
                                        <span className="text-sm font-medium text-gray-600">Gift</span>
                                    </div>
                                </div>
                                {/* CSS Conic Gradient Chart */}
                                <div className="relative h-48 w-48 rounded-full shadow-inner" style={{ background: 'conic-gradient(#FCD34D 0% 35%, #FFFF00 35% 45%, #A16207 45% 100%)' }}>
                                    <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-white shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* List Permohonan */}
                        <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm lg:col-span-1">
                            <div>
                                <h3 className="mb-6 text-lg font-bold text-gray-800">Permohonan Persetujuan</h3>
                                <div className="relative ml-2 space-y-6 border-l-2 border-gray-100 pl-6">
                                    <div className="relative">
                                        <span className="absolute top-1 -left-[31px] h-3 w-3 rounded-full bg-yellow-400"></span>
                                        <h4 className="font-bold text-gray-800">Komisi Agen</h4>
                                        <p className="mt-1 text-xs text-gray-400">Today at 10:00 AM</p>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute top-1 -left-[31px] h-3 w-3 rounded-full bg-yellow-400"></span>
                                        <h4 className="font-bold text-gray-800">Kerja Sama</h4>
                                        <p className="mt-1 text-xs text-gray-400">Today at 07:00 AM</p>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute top-1 -left-[31px] h-3 w-3 rounded-full bg-gray-300"></span>
                                        <h4 className="font-bold text-gray-800">Undangan Seminar</h4>
                                        <p className="mt-1 text-xs text-gray-400">Yesterday at 05:00 PM</p>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-4 flex items-center justify-end text-sm font-bold text-yellow-500 hover:underline">
                                View all <HiArrowSmRight className="ml-1 h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* --- BAGIAN 3: BAWAH (3 KOLOM) --- */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Penjualan Token */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Penjualan Token</p>
                                    <h3 className="mt-1 text-2xl font-extrabold text-gray-900">Rp9.600.000</h3>
                                    <span className="mt-1 inline-flex items-center text-xs font-bold text-green-500">On track</span>
                                </div>
                                <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-500">+2.45%</span>
                            </div>
                            <div className="mt-6 flex h-32 items-end justify-between gap-2">
                                {[40, 60, 80, 50, 70, 90, 60].map((h, i) => (
                                    <div key={i} className="relative h-full w-3 rounded-t-md bg-gray-100">
                                        <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full rounded-t-md bg-yellow-400 transition-all hover:bg-yellow-500"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Laporan Tim */}
                        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-800">Laporan Tim</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} className="h-10 w-10 rounded-full bg-gray-200 object-cover" alt="User" />
                                        <div>
                                            <h5 className="text-sm font-bold text-gray-800">Anggota {i}</h5>
                                            <p className="text-xs text-gray-400">Divisi {i}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-2 flex items-center justify-end text-sm font-bold text-yellow-500 hover:underline">
                                View all <HiArrowSmRight className="ml-1 h-5 w-5" />
                            </button>
                        </div>

                        {/* Absensi */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h3 className="mb-6 text-lg font-bold text-gray-800">Absensi</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <HiDesktopComputer className="h-6 w-6 text-blue-500" />
                                    <span className="font-bold text-gray-700">IT Team</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <HiCurrencyDollar className="h-6 w-6 text-green-500" />
                                    <span className="font-bold text-gray-700">Finance</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <HiUsers className="h-6 w-6 text-pink-500" />
                                    <span className="font-bold text-gray-700">Marketing</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <HiWrench className="h-6 w-6 text-yellow-600" />
                                    <span className="font-bold text-gray-700">Ops</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayoutAdmin>
        </ProtectedRoute>
    );
}
