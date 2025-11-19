import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, Link } from '@inertiajs/react';
import { HiArrowRight } from 'react-icons/hi';

export default function Artikel() {
    // Data Dummy
    const articles = [
        {
            id: 1,
            category: 'Manajemen Tim',
            title: '5 Cara Meningkatkan Kolaborasi Tim dengan Tipe Karakter Berbeda',
            blurb: 'Memahami bahwa setiap individu unik adalah kunci. Berikut cara memanfaatkannya...',
            image: 'https://via.placeholder.com/600x400.png?text=Manajemen+Tim', // Ganti URL gambar
        },
        {
            id: 2,
            category: 'Pengembangan Diri',
            title: 'Mengenal Tipe Karakter Pemikir: Kelebihan dan Tantangannya',
            blurb: 'Apakah Anda seorang pemikir? Pahami bagaimana tipe ini beroperasi di tempat kerja.',
            image: 'https://via.placeholder.com/600x400.png?text=Pengembangan+Diri',
        },
        {
            id: 3,
            category: 'Studi Kasus',
            title: 'Studi Kasus: PT Maju Jaya Meningkatkan Retensi Karyawan 20%',
            blurb: 'Bagaimana PT Maju Jaya menggunakan data karakter untuk menempatkan orang yang tepat...',
            image: 'https://via.placeholder.com/600x400.png?text=Studi+Kasus',
        },
    ];

    return (
        <InstansiLayout>
            <Head title="Artikel & Update" />

            <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Artikel & Update
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm"
                    >
                        <img
                            src={article.image}
                            alt={article.title}
                            className="h-48 w-full object-cover"
                        />
                        <div className="flex flex-1 flex-col p-6">
                            <span className="mb-3 inline-block w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                {article.category}
                            </span>
                            <h3 className="mb-2 flex-1 text-lg font-bold text-gray-900">
                                {article.title}
                            </h3>
                            <p className="mb-4 text-sm text-gray-500">
                                {article.blurb}
                            </p>
                            <Link
                                href="#"
                                className="inline-flex items-center text-sm font-bold text-saintara-yellow transition-colors group-hover:gap-2 hover:text-yellow-500"
                            >
                                Baca Selengkapnya{' '}
                                <HiArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </InstansiLayout>
    );
}
