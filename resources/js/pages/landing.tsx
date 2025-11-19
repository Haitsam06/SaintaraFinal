import Footer from '@/components/footer'; // Sesuaikan path import
import Navbar from '@/components/navbar'; // Sesuaikan path import
import { Head, Link } from '@inertiajs/react'; // Head untuk Title halaman
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { HiCheckCircle } from 'react-icons/hi';

export default function Welcome() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic',
        });
    }, []);

    // Data Karakter (Path gambar diubah ke folder public/assets/9karakter/...)
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
        {
            title: 'Gaya Komunikasi Alami',
            desc: 'Memahami cara Anda berinteraksi paling efektif.',
        },
        {
            title: 'Potensi Karier Terbaik',
            desc: 'Menemukan jalur karier yang paling sesuai dengan bakat Anda.',
        },
        {
            title: 'Pemicu Stres & Solusinya',
            desc: 'Mengenali apa yang membuat Anda stres dan cara mengatasinya.',
        },
        {
            title: 'Kekuatan Terpendam',
            desc: 'Menggali kelebihan yang mungkin belum Anda sadari.',
        },
        {
            title: 'Manajemen Emosi',
            desc: 'Cara Anda mengelola perasaan dalam berbagai situasi.',
        },
        {
            title: 'Kecocokan Hubungan',
            desc: 'Tipe pasangan atau rekan yang paling cocok dengan Anda.',
        },
    ];

    const testimonials = [
        {
            name: 'Budi Santoso',
            text: 'Saintara sangat membantu saya dalam mengenal diri saya lebih lanjut.',
            image: '/assets/testimoni/fotopria.png',
        },
        {
            name: 'Meri',
            text: 'Memberikan dampak yang signifikan dalam hidup saya sehingga membuka jalan baru.',
            image: '/assets/testimoni/fotowanita.png',
        },
        {
            name: 'Lastri',
            text: 'Terimakasih Saintara saya bisa tahu karakter asli saya dan menjalani hidup lebih baik.',
            image: '/assets/testimoni/fotowanita.png',
        },
    ];

    return (
        <>
            <Head title="Welcome to Saintara" />
            <Navbar />

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen overflow-hidden bg-white pt-20 lg:pt-32">
                <div className="absolute inset-0">
                    <img
                        src="/assets/landingPage.png" // Pastikan path-nya mengarah ke folder public
                        alt="Background Saintara"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>
                <div className="relative mx-auto grid max-w-screen-xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
                    <div className="text-center lg:text-left" data-aos="fade-right">
                        <h1 className="font-poppins text-4xl leading-tight font-extrabold text-saintara-black md:text-5xl lg:text-6xl">
                            Kenali <span className="text-saintara-yellow">Karakter Alami</span> dan Potensi Mendalam Anda
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 lg:mx-0">
                            Peta sempurna kehidupan untuk menggali potensi dan menjadi diri sendiri seutuhnya—untuk Anda, keluarga, pasangan, sahabat, dan tim.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                            <Link
                                href="#harga"
                                className="w-full transform rounded-lg bg-saintara-yellow px-8 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-saintara-black focus:ring-4 focus:ring-yellow-300 sm:w-auto"
                                aria-label="Try test now"
                            >
                                Coba Tes Sekarang
                            </Link>
                            <Link
                                href="/partnership"
                                className="w-full rounded-lg border-2 border-saintara-black px-8 py-3 text-center text-base font-semibold text-saintara-black transition-colors duration-300 hover:bg-saintara-black hover:text-white sm:w-auto"
                                aria-label="Register for partnership license"
                            >
                                Daftar Kemitraan Lisensi
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block" data-aos="fade-left" data-aos-delay="200">
                        <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-gray-100 shadow-2xl">
                            <img
                                src="/assets/arrow.png" // Ganti variable {arrow} menjadi string path ke folder public
                                alt="Yellow arrow pointing right centered on a light circular background, indicating forward action; placed in the middle of a soft gray rounded card to invite users to explore further"
                                width={400}
                                height={400}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tentang Saintara */}
            <section id="tentang" className="bg-white py-20">
                <div className="mx-auto grid max-w-screen-xl items-center gap-12 px-4 md:grid-cols-2">
                    <div data-aos="fade-right">
                        <h2 className="font-poppins text-3xl font-bold text-saintara-black md:text-4xl">Tentang Saintara</h2>
                        <p className="mt-6 leading-relaxed text-gray-600">
                            Saintara adalah sebuah platform inovatif yang dirancang untuk membantu Anda memahami cetak biru alami kepribadian Anda. Kami percaya bahwa setiap orang
                            memiliki potensi unik yang, jika dipahami dan dikembangkan, dapat membawa pada kehidupan yang lebih memuaskan dan sukses.
                        </p>
                        <div className="mt-6">
                            <h3 className="font-poppins text-xl font-semibold text-saintara-black">Visi & Misi</h3>
                            <p className="mt-2 text-gray-600">
                                Membantu setiap individu di dunia untuk mengenali, menerima, dan memaksimalkan potensi alami mereka untuk menjadi versi terbaik dari diri mereka
                                sendiri.
                            </p>
                        </div>
                    </div>
                    <div data-aos="fade-left">
                        <div className="flex h-96 w-full items-center justify-center rounded-xl bg-gray-200 shadow-lg">
                            <span className="text-gray-500">Team Image</span>
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
                        Saintara memberikan perubahan dan menggali makna dari kekuatan yang terpendam dalam diri, memetakan agar dapat dieksplorasi untuk kesuksesan yang
                        membahagiakan, menjadi diri yang utuh, dan menemukan jati diri yang sesungguhnya.
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
                            Ungkap berbagai aspek mendalam dari diri Anda yang belum pernah Anda sadari sebelumnya.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-saintara-yellow"
                                data-aos="fade-up"
                                data-aos-delay={200 + index * 100}
                            >
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
                            Setiap individu unik. Kenali tipe karakter alami Anda dan orang-orang di sekitar Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {characterTypes.map((char, index) => (
                            <div key={index} className="group relative h-80 overflow-hidden rounded-xl shadow-lg" data-aos="zoom-in" data-aos-delay={index * 100}>
                                <div className="absolute inset-0 h-full w-full">
                                    <img
                                        src={char.imageSrc}
                                        alt={`Ilustrasi karakter ${char.name}`}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="z=10 absolute bottom-0 left-0 p-6">
                                    <h3 className="font-poppins text-2xl font-bold text-white">{char.name}</h3>
                                </div>

                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-saintara-black/90 p-6 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <p className="mb-4">{char.desc}</p>
                                    <Link
                                        href="/dashboard/articles"
                                        className="rounded-full border-2 border-white px-6 py-2 transition-colors hover:bg-white hover:text-saintara-black"
                                        aria-label={`Learn more about ${char.name}`}
                                    >
                                        Pelajari Lebih Lanjut
                                    </Link>
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
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
                            Pengalaman nyata dari mereka yang telah menemukan potensinya.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="flex items-center space-x-6 rounded-2xl bg-white p-6 shadow-lg" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                                <div className="flex-shrink-0">
                                    <img src={testimonial.image} alt={`Foto profil ${testimonial.name}`} className="h-20 w-20 rounded-full object-cover" />
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

            {/* Paket & Harga */}
            <section id="harga" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-screen-xl px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-poppins text-3xl font-bold text-saintara-black md:text-4xl" data-aos="fade-up">
                            Pilih Paket yang Sesuai Untuk Anda
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
                            Mulai perjalanan penemuan diri Anda hari ini.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Personal */}
                        <div
                            className="border-gray- flex flex-col rounded-2xl border-t-4 bg-white p-8 shadow-lg transition-all hover:border-saintara-yellow"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <h3 className="font-poppins text-2xl font-semibold text-saintara-black">Personal</h3>
                            <p className="mt-2 text-gray-500">Untuk individu yang ingin mengenal diri.</p>
                            <div className="my-6">
                                <span className="text-4xl font-extrabold text-saintara-black">Rp150k</span>
                            </div>
                            <ul className="flex-grow space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    35 Atribut Lengkap
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />6 Framework Analisis
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    Rekomendasi Karier
                                </li>
                            </ul>
                            <div className="mt-8 space-y-2">
                                <Link
                                    href="/products/personal"
                                    className="block w-full rounded-lg border-2 border-saintara-yellow px-8 py-3 text-center text-base font-semibold text-saintara-yellow transition-colors duration-300 hover:bg-saintara-yellow hover:text-white"
                                    aria-label="Learn more about personal package"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                                <Link
                                    href="/register?product=personal"
                                    className="block w-full rounded-lg border-2 border-saintara-black px-8 py-3 text-center text-base font-semibold text-saintara-black transition-colors duration-300 hover:bg-saintara-black hover:text-white"
                                    aria-label="Choose individual package"
                                >
                                    Pilih Paket
                                </Link>
                            </div>
                        </div>

                        {/* Organization */}
                        <div
                            className="flex flex-col rounded-2xl border-t-4 border-gray-300 bg-white p-8 shadow-lg transition-all hover:border-saintara-yellow"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <h3 className="font-poppins text-2xl font-semibold text-saintara-black">Organization</h3>
                            <p className="mt-2 text-gray-500">Untuk perusahaan & organisasi.</p>
                            <div className="my-6">
                                <span className="text-2xl font-bold text-saintara-black">Rp100k</span>
                                <p className="text-sm text-gray-500">Mulai dari (bulk)</p>
                            </div>
                            <ul className="flex-grow space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    Analisis Tim
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    Dashboard Admin
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    Bulk Upload
                                </li>
                            </ul>
                            <div className="mt-8 space-y-2">
                                <Link
                                    href="/products/organization"
                                    className="block w-full rounded-lg border-2 border-saintara-yellow px-8 py-3 text-center text-base font-semibold text-saintara-yellow transition-colors duration-300 hover:bg-saintara-yellow hover:text-white"
                                    aria-label="Learn more about organization package"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                                <Link
                                    href="/register?product=organization"
                                    className="block w-full rounded-lg border-2 border-saintara-black px-8 py-3 text-center text-base font-semibold text-saintara-black transition-colors duration-300 hover:bg-saintara-black hover:text-white"
                                    aria-label="Contact sales for organization package"
                                >
                                    Kontak Sales
                                </Link>
                            </div>
                        </div>

                        {/* School */}
                        <div
                            className="flex flex-col rounded-2xl border-t-4 border-gray-300 bg-white p-8 shadow-lg transition-all hover:border-saintara-yellow"
                            data-aos="fade-up"
                            data-aos-delay="400"
                        >
                            <h3 className="font-poppins text-2xl font-semibold text-saintara-black">School</h3>
                            <p className="mt-2 text-gray-500">Untuk sekolah & universitas.</p>
                            <div className="my-6">
                                <span className="text-2xl font-bold text-saintara-black">Rp75k</span>
                                <p className="text-sm text-gray-500">Mulai dari (bulk)</p>
                            </div>
                            <ul className="flex-grow space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    Rekomendasi Jurusan
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    Parent Report
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-yellow" />
                                    Counseling Support
                                </li>
                            </ul>
                            <div className="mt-8 space-y-2">
                                <Link
                                    href="/products/school"
                                    className="block w-full rounded-lg border-2 border-saintara-yellow px-8 py-3 text-center text-base font-semibold text-saintara-yellow transition-colors duration-300 hover:bg-saintara-yellow hover:text-white"
                                    aria-label="Learn more about school package"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                                <Link
                                    href="/register?product=school"
                                    className="block w-full rounded-lg border-2 border-saintara-black px-8 py-3 text-center text-base font-semibold text-saintara-black transition-colors duration-300 hover:bg-saintara-black hover:text-white"
                                    aria-label="Contact sales for school package"
                                >
                                    Kontak Sales
                                </Link>
                            </div>
                        </div>

                        {/* Gift */}
                        <div
                            className="relative flex flex-col rounded-2xl border-t-4 border-saintara-yellow bg-gradient-to-br from-saintara-yellow/30 to-white p-8 shadow-2xl"
                            data-aos="fade-up"
                            data-aos-delay="500"
                        >
                            <span className="absolute top-0 right-6 -mt-4 rounded-full bg-saintara-yellow px-3 py-1 text-xs font-bold text-saintara-black">GIFT CARD</span>
                            <h3 className="font-poppins text-2xl font-semibold text-saintara-black">Gift</h3>
                            <p className="mt-2 text-gray-700">Hadiah bermakna untuk orang tersayang.</p>
                            <div className="my-6">
                                <span className="text-4xl font-extrabold text-saintara-black">Rp175k</span>
                            </div>
                            <ul className="flex-grow space-y-3 text-gray-700">
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-black" />
                                    Premium Report
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-black" />
                                    Digital Gift Card
                                </li>
                                <li className="flex items-center">
                                    <HiCheckCircle className="mr-2 h-5 w-5 text-saintara-black" />
                                    Custom Message
                                </li>
                            </ul>
                            <div className="mt-8 space-y-2">
                                <Link
                                    href="/products/gift"
                                    className="block w-full rounded-lg border-2 border-saintara-black px-8 py-3 text-center text-base font-semibold text-saintara-black transition-colors duration-300 hover:bg-saintara-black hover:text-white"
                                    aria-label="Learn more about gift package"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                                <Link
                                    href="/register?product=gift"
                                    className="block w-full rounded-lg bg-saintara-black px-8 py-3 text-center text-base font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
                                    aria-label="Buy gift card"
                                >
                                    Beli Gift Card
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="600">
                        <Link href="/faq" className="mr-6 inline-block font-semibold text-saintara-yellow hover:underline">
                            Lihat FAQ
                        </Link>
                        <Link href="/partnership" className="inline-block font-semibold text-saintara-yellow hover:underline">
                            Jadi Partner Saintara
                        </Link>
                    </div>
                </div>
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
                    <Link
                        href="#harga"
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
