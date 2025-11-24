import Footer from '@/components/footer'; // Sesuaikan path import
import Navbar from '@/components/navbar'; // Sesuaikan path import
import { Head, Link, usePage } from '@inertiajs/react'; // Tambahkan usePage
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import { HiCheckCircle, HiX } from 'react-icons/hi';

export default function Welcome() {
    // 1. Mengambil Props Auth dari Inertia
    const { auth } = usePage().props as any;
    const user = auth?.user;

    // Logic Pengecekan Role
    const isInstansi = user?.role_id === 4; // Sesuaikan dengan role_id di DB (4 = Instansi)
    const isPersonal = user?.role_id === 3; // Sesuaikan dengan role_id di DB (3 = Personal)

    // URL Tujuan (PERBAIKAN LINK DI SINI)
    const urlPersonal = user ? '/personal/dashboard' : '/login';
    const urlInstansi = user ? '/instansi/dashboardInstansi' : '/login';

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic',
        });
    }, []);

    // 2. Logic Menentukan Tujuan Link CTA Utama
    const getTargetUrl = () => {
        if (!user) {
            return '/login';
        }

        const rid = Number(user.role_id);

        if (rid === 1 || rid === 2) {
            return '/admin/dashboardAdmin';
        } else if (rid === 4) {
            return '/instansi/dashboardInstansi';
        } else {
            // Personal: Arahkan ke dashboard (PERBAIKAN DI SINI)
            return '/personal/dashboard';
        }
    };

    const ctaLink = getTargetUrl();

    // 3. State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({ title: '', description: '' });

    // 4. Data Konten Modal
    const modalContent = {
        personal: {
            title: 'Personal – Tes Kepribadian untuk Individu',
            description: `Paket ini cocok untuk kamu yang ingin mengenal diri lebih dalam dan memahami arah pengembangan diri. Kamu akan mendapatkan satu token yang dapat digunakan untuk mengakses tes satu kali dan langsung menerima laporan lengkap yang merangkum kepribadian, gaya kerja, serta potensi kariermu. Paket Personal ideal untuk mahasiswa, pencari kerja, atau siapa pun yang ingin memahami diri secara profesional sebelum mengambil langkah besar.`,
        },
        organization: {
            title: 'Organization – Solusi Analisis Kepribadian untuk Perusahaan & Institusi',
            description: `Paket ini dirancang untuk kebutuhan skala besar seperti perusahaan, sekolah, komunitas, atau organisasi kampus. Admin dapat membeli token sesuai kebutuhan, mengelola peserta, memantau progres, dan melihat hasil analisis tim melalui dashboard khusus. Cocok digunakan untuk proses rekrutmen, pembentukan tim, pengembangan SDM, ataupun evaluasi anggota organisasi.`,
        },
        gift: {
            title: 'Gift – Hadiah Digital yang Personal & Bermakna',
            description: `Paket Gift memungkinkan kamu memberikan tes kepribadian sebagai hadiah untuk orang tersayang. Token akan dikirim bersama pesan khusus, dan penerima dapat melakukan tes kapan saja. Hadiah ini bukan hanya berkesan, tapi juga bermanfaat bagi pengembangan diri mereka. Cocok sebagai hadiah ulang tahun, ucapan terima kasih, atau bentuk apresiasi sederhana.`,
        },
    };

    const handleOpenModal = (type: 'personal' | 'organization' | 'gift') => {
        // @ts-ignore
        setSelectedData(modalContent[type]);
        setIsModalOpen(true);
    };

    // Data Karakter & Fitur
    const characterTypes = [
        {
            name: 'Pemikir Introvert',
            desc: 'Analis yang mendalam, logis, dan lebih suka bekerja sendiri.',
            imageSrc: '/assets/9karakter/PemikirIntrovert.png',
        },
        {
            name: 'Pemikir Extrovert',
            desc: 'Pemimpin tegas, strategis, dan suka mengatur sistem.',
            imageSrc: '/assets/9karakter/PemikirExtrovert.png',
        },
        {
            name: 'Pengamat Introvert',
            desc: 'Praktis, teliti, dan mengandalkan fakta nyata.',
            imageSrc: '/assets/9karakter/PengamatIntrovert.png',
        },
        {
            name: 'Pengamat Extrovert',
            desc: 'Energik, spontan, dan suka menikmati momen saat ini.',
            imageSrc: '/assets/9karakter/PengamatExtrovert.png',
        },
        {
            name: 'Perasa Introvert',
            desc: 'Penuh empati, peduli, dan setia pada nilai-nilai pribadi.',
            imageSrc: '/assets/9karakter/PerasaIntrovert.png',
        },
        {
            name: 'Perasa Extrovert',
            desc: 'Karismatik, inspiratif, dan mudah bergaul dengan orang lain.',
            imageSrc: '/assets/9karakter/PerasaExtrovert.png',
        },
        {
            name: 'Pemimpi Introvert',
            desc: 'Idealis, kreatif, dan mencari makna mendalam dalam hidup.',
            imageSrc: '/assets/9karakter/PemimpiIntrovert.png',
        },
        {
            name: 'Pemimpi Extrovert',
            desc: 'Inovatif, antusias, dan pandai menghubungkan ide-ide.',
            imageSrc: '/assets/9karakter/PemimpiExtrovert.png',
        },
        {
            name: 'Penggerak',
            desc: 'Adaptif, pemecah masalah, dan berorientasi pada tindakan.',
            imageSrc: '/assets/9karakter/Penggerak.png',
        },
    ];

    const features = [
        { title: 'Gaya Komunikasi Alami', desc: 'Memahami cara Anda berinteraksi paling efektif.' },
        { title: 'Potensi Karier Terbaik', desc: 'Menemukan jalur karier yang paling sesuai dengan bakat Anda.' },
        { title: 'Pemicu Stres & Solusinya', desc: 'Mengenali apa yang membuat Anda stres dan cara mengatasinya.' },
        { title: 'Kekuatan Terpendam', desc: 'Menggali kelebihan yang mungkin belum Anda sadari.' },
        { title: 'Manajemen Emosi', desc: 'Cara Anda mengelola perasaan dalam berbagai situasi.' },
        { title: 'Kecocokan Hubungan', desc: 'Tipe pasangan atau rekan yang paling cocok dengan Anda.' },
    ];

    const testimonials = [
        { name: 'Budi Santoso', text: 'Saintara sangat membantu saya dalam mengenal diri saya lebih lanjut.', image: '/assets/testimoni/fotopria.png' },
        { name: 'Meri', text: 'Memberikan dampak yang signifikan dalam hidup saya sehingga membuka jalan baru.', image: '/assets/testimoni/fotowanita.png' },
        { name: 'Lastri', text: 'Terimakasih Saintara saya bisa tahu karakter asli saya dan menjalani hidup lebih baik.', image: '/assets/testimoni/fotowanita.png' },
    ];

    return (
        <>
            <Head title="Welcome to Saintara" />
            <Navbar />

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen overflow-hidden bg-white pt-20 lg:pt-32">
                <div className="absolute inset-0">
                    <img src="/assets/landingPage.png" alt="Background Saintara" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                </div>
                <div className="relative mx-auto grid max-w-screen-xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
                    <div className="text-center lg:text-left" data-aos="fade-right">
                        <h1 className="font-poppins text-4xl leading-tight font-extrabold text-saintara-black md:text-5xl lg:text-6xl">
                            Kenali <span className="text-saintara-yellow">Karakter Alami</span> dan Potensi Mendalam Anda
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 lg:mx-0">Peta sempurna kehidupan untuk menggali potensi dan menjadi diri sendiri seutuhnya—untuk Anda, keluarga, pasangan, sahabat, dan tim.</p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                            <Link href={ctaLink} className="w-full transform rounded-lg bg-saintara-yellow px-8 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-saintara-black focus:ring-4 focus:ring-yellow-300 sm:w-auto">
                                Coba Tes Sekarang
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block" data-aos="fade-left" data-aos-delay="200">
                        <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-gray-100 shadow-2xl">
                            <img src="/assets/cou.jpeg" alt="landing illustration" className="rounded-4xl object-contain" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tentang Saintara */}
            <section id="tentang" className="bg-white py-20">
                <div className="mx-auto grid max-w-screen-xl items-center gap-12 px-4 md:grid-cols-2">
                    <div data-aos="fade-right">
                        <h2 className="font-poppins text-3xl font-bold text-saintara-black md:text-4xl">Tentang Saintara</h2>
                        <p className="mt-6 leading-relaxed text-gray-600">Saintara adalah sebuah platform inovatif yang dirancang untuk membantu Anda memahami cetak biru alami kepribadian Anda...</p>
                        <div className="mt-6">
                            <h3 className="font-poppins text-xl font-semibold text-saintara-black">Visi & Misi</h3>
                            <p className="mt-2 text-gray-600">Membantu setiap individu di dunia untuk mengenali, menerima, dan memaksimalkan potensi alami mereka...</p>
                        </div>
                    </div>
                    <div data-aos="fade-left">
                        <div className="flex h-96 w-full items-center justify-center rounded-xl bg-gray-200 shadow-lg">
                            <img src="/assets/tim.jpeg" alt="landing illustration" className="rounded-4xl object-contain" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mengapa Saintara */}
            <section id="mengapa" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-screen-lg px-4 text-center">
                    <h2 className="mb-6 font-poppins text-3xl font-bold text-saintara-black md:text-4xl" data-aos="fade-up">
                        Mengapa Memilih Saintara?
                    </h2>
                    <p className="text-base leading-relaxed text-gray-600 md:text-lg" data-aos="fade-up" data-aos-delay="100">
                        Saintara memberikan perubahan dan menggali makna dari kekuatan yang terpendam dalam diri...
                    </p>
                </div>
            </section>

            {/* 35 Rahasia */}
            <section id="fitur" className="bg-white py-20">
                <div className="mx-auto max-w-screen-xl px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-poppins text-3xl font-bold text-saintara-black md:text-4xl" data-aos="fade-up">
                            35 Rahasia Kepribadian Alami Anda
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
                            Ungkap berbagai aspek mendalam dari diri Anda...
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-saintara-yellow" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                                <h3 className="text-lg font-semibold text-saintara-black">{feature.title}</h3>
                                <p className="mt-2 text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9 Karakter */}
            <section id="produk" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-screen-xl px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-poppins text-3xl font-bold text-saintara-black md:text-4xl" data-aos="fade-up">
                            Temukan 9 Tipe Karakter Saintara
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
                            Setiap individu unik...
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {characterTypes.map((char, index) => (
                            <div key={index} className="group relative h-80 overflow-hidden rounded-xl shadow-lg" data-aos="zoom-in" data-aos-delay={index * 100}>
                                <div className="absolute inset-0 h-full w-full">
                                    <img src={char.imageSrc} alt={`Ilustrasi karakter ${char.name}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="z=10 absolute bottom-0 left-0 p-6">
                                    <h3 className="font-poppins text-2xl font-bold text-white">{char.name}</h3>
                                </div>
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-saintara-black/90 p-6 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <p className="mb-4">{char.desc}</p>
                                    {/* <Link href="/dashboard/articles" className="rounded-full border-2 border-white px-6 py-2 transition-colors hover:bg-white hover:text-saintara-black">
                                        Pelajari Lebih Lanjut
                                    </Link> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimoni */}
            <section id="testimoni" className="bg-[#FFF3D8] py-20">
                <div className="mx-auto max-w-screen-lg px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-poppins text-3xl font-bold text-saintara-black md:text-4xl" data-aos="fade-up">
                            Apa Kata Mereka?
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="flex items-center space-x-6 rounded-2xl bg-white p-6 shadow-lg" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                                <div className="flex-shrink-0">
                                    <img src={testimonial.image} alt={`Foto ${testimonial.name}`} className="h-20 w-20 rounded-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-poppins text-xl font-bold text-saintara-black">{testimonial.name}</h3>
                                    <p className="mt-1 text-gray-600">&quot;{testimonial.text}&quot;</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="min-h-screen bg-gray-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
                    {/* PERSONAL */}
                    <div id="harga" className="relative flex flex-col rounded-[2rem] bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">Personal</h3>
                            <p className="mt-2 h-12 text-sm text-gray-500">Untuk individu yang ingin mengenal diri.</p>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-gray-900">Rp150k</span>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {['35 Atribut Lengkap', '6 Framework Analisis', 'Rekomendasi Karier'].map((item, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-600">
                                        <HiCheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-yellow-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-10 space-y-3">
                            <button onClick={() => handleOpenModal('personal')} className="w-full rounded-xl border-2 border-yellow-400 py-3 text-sm font-bold text-yellow-400 transition hover:bg-gray-50">
                                Pelajari Lebih Lanjut
                            </button>
                            <div className="mt-5"></div>
                            {/* {isInstansi ? (
                                <button disabled className="w-full cursor-not-allowed rounded-xl border-2 border-gray-200 bg-gray-100 py-3 text-sm font-bold text-gray-400">
                                    Khusus Akun Personal
                                </button>
                            ) : (
                                <Link href={urlPersonal} className="block w-full rounded-xl border-2 border-gray-900 py-3 text-center text-sm font-bold text-gray-900 transition hover:bg-gray-50">
                                    Pilih Paket
                                </Link>
                            )} */}
                        </div>
                    </div>

                    {/* ORGANIZATION */}
                    <div className="relative flex flex-col rounded-[2rem] bg-white p-8 shadow-xl transition-transform hover:-translate-y-1">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">Instansi</h3>
                            <p className="mt-2 h-12 text-sm text-gray-500">Untuk perusahaan & organisasi.</p>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-gray-900">Rp100k</span>
                                <span className="mt-1 block text-xs text-gray-400">Mulai dari (bulk)</span>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {['Analisis Tim', 'Dashboard Admin', 'Bulk Upload'].map((item, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-600">
                                        <HiCheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-yellow-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-10 space-y-3">
                            <button onClick={() => handleOpenModal('organization')} className="w-full rounded-xl border-2 border-yellow-400 py-3 text-sm font-bold text-yellow-400 transition hover:bg-gray-50">
                                Pelajari Lebih Lanjut
                            </button>
                            {/* {isPersonal ? (
                                <button disabled className="w-full cursor-not-allowed rounded-xl border-2 border-gray-200 bg-gray-100 py-3 text-sm font-bold text-gray-400">
                                    Khusus Akun Instansi
                                </button>
                            ) : (
                                <Link href={urlInstansi} className="block w-full rounded-xl border-2 border-gray-900 py-3 text-center text-sm font-bold text-gray-900 transition hover:bg-gray-50">
                                    Pilih Paket
                                </Link>
                            )} */}
                            <div className="mt-5"></div>
                        </div>
                    </div>

                    {/* GIFT */}
                    <div className="relative flex flex-col rounded-[2rem] border-none bg-[#FFF9E5] p-8 shadow-xl transition-transform hover:-translate-y-1">
                        <div className="absolute -top-3 right-6 rounded-full bg-yellow-400 px-4 py-1 text-xs font-extrabold text-white shadow-sm">GIFT CARD</div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">Hadiah</h3>
                            <p className="mt-2 h-12 text-sm text-gray-500">Hadiah bermakna untuk orang tersayang.</p>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-gray-900">Rp175k</span>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {['Premium Report', 'Digital Gift Card', 'Custom Message'].map((item, idx) => (
                                    <li key={idx} className="flex items-center text-sm font-medium text-gray-900">
                                        <HiCheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-gray-900" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-10 space-y-3">
                            <button onClick={() => handleOpenModal('gift')} className="w-full rounded-xl border-2 border-black py-3 text-sm font-bold text-black shadow-lg transition hover:bg-gray-800">
                                Pelajari Lebih Lanjut
                            </button>
                            {/* {isInstansi ? (
                                <button disabled className="w-full cursor-not-allowed rounded-xl bg-gray-300 py-3 text-sm font-bold text-gray-500">
                                    Khusus Akun Personal
                                </button>
                            ) : (
                                <Link href={urlPersonal} className="block w-full rounded-xl bg-gray-900 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:bg-gray-800">
                                    Beli Gift Card
                                </Link>
                            )} */}
                            <p className="pt-2 text-xs text-slate-700">*Harus memiliki akun personal</p>
                        </div>
                    </div>
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
                        <div className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-8 text-left shadow-2xl transition-all">
                            <div className="mb-4 flex items-start justify-between">
                                <h3 className="pr-4 text-xl leading-6 font-bold text-gray-900">{selectedData.title}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 focus:outline-none">
                                    <HiX className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm leading-relaxed text-gray-600">{selectedData.description}</p>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button type="button" className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-yellow-500" onClick={() => setIsModalOpen(false)}>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* CTA Penutup */}
            <section id="cta-penutup" className="cta-gradient py-20">
                <div className="mx-auto max-w-screen-md px-4 text-center">
                    <h2 className="font-poppins text-3xl font-extrabold text-white md:text-4xl" data-aos="fade-up">
                        Sudah siap menemukan Potensi Alami Terbaik Anda?
                    </h2>
                    <p className="mt-4 text-lg text-gray-300" data-aos="fade-up" data-aos-delay="100">
                        Mulailah perjalanan transformatif bersama Saintara sekarang juga.
                    </p>

                    {/* TOMBOL YANG SUDAH DINAMIS */}
                    <Link
                        href={ctaLink} // Menggunakan hasil dari getTargetUrl()
                        className="mt-8 inline-block transform rounded-lg bg-saintara-yellow px-12 py-4 text-lg font-bold text-saintara-black transition-all duration-300 hover:scale-105 hover:bg-white hover:text-saintara-black focus:ring-4 focus:ring-yellow-300"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                    >
                        Ikuti Tes Saintara Sekarang
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
