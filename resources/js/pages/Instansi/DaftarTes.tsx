import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, usePage, Link } from '@inertiajs/react';
import {
    HiCreditCard,
    HiOutlineCheckCircle,
    HiOutlineGift,
    HiOutlineUser,
    HiOutlineUsers,
} from 'react-icons/hi';

type TestPackage = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    token_cost: number;
    type: 'personal' | 'team' | 'gift' | string;
};

type Summary = {
    token_tersisa: number;
    tes_selesai_bulan_ini: number;
};

type PageProps = {
    tests: TestPackage[];
    summary: Summary;
};

export default function Tes() {
    const { props } = usePage<PageProps>();
    const tests = props.tests ?? [];
    const summary = props.summary ?? {
        token_tersisa: 0,
        tes_selesai_bulan_ini: 0,
    };

    // mapping backend -> struktur lama testList
    const testList = tests.map((pkg) => {
        // pilih icon & warna berdasarkan type
        let icon = HiOutlineUser;
        let color = 'text-blue-600 bg-blue-100';

        if (pkg.type === 'team') {
            icon = HiOutlineUsers;
            color = 'text-green-600 bg-green-100';
        } else if (pkg.type === 'gift') {
            icon = HiOutlineGift;
            color = 'text-orange-600 bg-orange-100';
        }

        return {
            id: pkg.id,
            title: pkg.title,
            desc: pkg.description ?? '',
            // ⬇️ di sini pakai token_cost, bukan token → tidak undefined lagi
            cost: `${pkg.token_cost} Token`,
            icon,
            color,
        };
    });

    return (
        <InstansiLayout>
            <Head title="Daftar Tes Karakter" />

            <div className="space-y-8 font-poppins">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Daftar Tes Karakter
                    </h2>
                    <button className="flex items-center gap-2 rounded-full bg-saintara-yellow px-6 py-3 font-bold text-gray-900 shadow-md transition-colors hover:bg-yellow-500">
                        <HiCreditCard className="h-5 w-5" />
                        Beli Token Tambahan
                    </button>
                </div>

                {/* === RINGKASAN TOKEN === */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex items-center gap-5 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-saintara-yellow">
                            <HiCreditCard className="h-8 w-8 text-gray-900" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                Token Tersisa
                            </p>
                            <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
                                {summary.token_tersisa} Token
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-800">
                            <HiOutlineCheckCircle className="h-8 w-8 text-saintara-yellow" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                Tes Selesai (Bulan Ini)
                            </p>
                            <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
                                {summary.tes_selesai_bulan_ini} Tes
                            </h3>
                        </div>
                    </div>
                </div>

                {/* === DAFTAR PAKET TES === */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                        Pilih Paket Tes
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {testList.map((test, index) => (
                            <div
                                key={test.id ?? index}
                                className="flex transform flex-col justify-between rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-saintara-yellow hover:shadow-xl"
                            >
                                {/* Bagian Atas: Info */}
                                <div>
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-full ${test.color}`}
                                    >
                                        <test.icon className="h-7 w-7" />
                                    </div>
                                    <h4 className="mt-5 text-lg font-bold text-gray-900">
                                        {test.title}
                                    </h4>
                                    <p className="mt-2 min-h-[40px] text-sm text-gray-500">
                                        {test.desc}
                                    </p>
                                </div>

                                {/* Bagian Bawah: Harga & Tombol */}
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-gray-600">
                                        Biaya:
                                    </p>
                                    <p className="mb-4 text-2xl font-bold text-gray-900">
                                        {test.cost}
                                    </p>

                                    {/* Pindah ke form tes instansi + bawa test_package_id */}
                                    <Link
                                        href={`/instansi/formTesInstansi?test_package_id=${test.id}`}
                                        as="button"
                                        className="w-full rounded-full bg-saintara-black px-4 py-3 font-bold text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-saintara-yellow focus:ring-offset-2 focus:outline-none text-center"
                                    >
                                        Gunakan Paket
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </InstansiLayout>
    );
}
