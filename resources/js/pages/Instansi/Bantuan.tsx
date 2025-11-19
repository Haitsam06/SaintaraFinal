import InstansiLayout from '@/layouts/dashboardLayoutInstansi';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

// Komponen Accordion Item
const AccordionItem = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="rounded-xl border border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-5 font-bold text-gray-800"
            >
                <span>{title}</span>
                {isOpen ? (
                    <HiChevronUp className="h-5 w-5" />
                ) : (
                    <HiChevronDown className="h-5 w-5" />
                )}
            </button>
            {isOpen && (
                <div className="p-5 pt-0 leading-relaxed text-gray-600">
                    {children}
                </div>
            )}
        </div>
    );
};

export default function Bantuan() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ganti 'instansi.bantuan.submit' dengan route Anda
        // post(route('instansi.bantuan.submit'), {
        //     onSuccess: () => alert('Tiket Bantuan Terkirim!'),
        // });
    };

    return (
        <InstansiLayout>
            <Head title="Bantuan" />

            <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Pusat Bantuan
            </h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Kolom Kiri: FAQ */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                        Pertanyaan Sering Diajukan
                    </h3>
                    <div className="space-y-4">
                        <AccordionItem title="Bagaimana cara membeli token?">
                            Anda dapat membeli token melalui halaman 'Transaksi
                            & Voucher', kemudian klik tombol 'Beli Token/Voucher
                            Baru'. Ikuti instruksi pembayaran untuk
                            menyelesaikan.
                        </AccordionItem>
                        <AccordionItem title="Apa beda Tes Personal dan Tes Tim?">
                            Tes Personal menganalisis satu individu. Tes Tim
                            menganalisis dinamika kelompok dan bagaimana
                            berbagai tipe karakter berinteraksi dalam satu tim.
                        </AccordionItem>
                        <AccordionItem title="Bagaimana cara mengunduh hasil tes?">
                            Pergi ke halaman 'Hasil Tes', cari peserta yang Anda
                            inginkan, lalu klik ikon 'Lihat Detail' atau
                            'Download' pada kolom Aksi.
                        </AccordionItem>
                    </div>
                </div>

                {/* Kolom Kanan: Form Bantuan */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                        Kirim Tiket Bantuan
                    </h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Jika Anda tidak menemukan jawaban, silakan kirimkan
                        pertanyaan Anda melalui formulir di bawah ini.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="subject"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Subjek
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={data.subject}
                                onChange={(e) =>
                                    setData('subject', e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                                placeholder="Contoh: Masalah saat download hasil"
                            />
                            {errors.subject && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.subject}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="message"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Pesan Anda
                            </label>
                            <textarea
                                id="message"
                                value={data.message}
                                onChange={(e) =>
                                    setData('message', e.target.value)
                                }
                                rows={5}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-saintara-yellow focus:ring-saintara-yellow"
                                placeholder="Jelaskan kendala Anda secara detail..."
                            />
                            {errors.message && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.message}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-saintara-yellow px-8 py-3 font-bold text-gray-900 shadow-md transition-colors hover:bg-yellow-500 disabled:opacity-50"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Tiket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </InstansiLayout>
    );
}
