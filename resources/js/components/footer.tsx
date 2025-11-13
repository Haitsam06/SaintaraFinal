import { Link } from '@inertiajs/react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-black pt-16 pb-8 text-white">
            <div className="mx-auto max-w-screen-xl px-4">
                <div className="md:flex md:items-start md:justify-between">
                    <div className="mb-8 max-w-sm md:mb-0">
                        <Link href="/" className="mb-4 flex items-center">
                            <span className="font-poppins self-center text-3xl font-bold tracking-wider whitespace-nowrap text-white">
                                Saintara
                            </span>
                        </Link>
                        <p className="leading-relaxed text-gray-400">
                            Peta sempurna untuk menggali potensi dan menjadi
                            diri sendiri. Temukan versi terbaik diri Anda
                            bersama kami.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
                        <div>
                            <h2 className="mb-6 text-sm font-bold tracking-wider text-gray-200 uppercase">
                                Navigasi
                            </h2>
                            <ul className="space-y-3 font-medium text-gray-400">
                                <li>
                                    <Link
                                        href="/#tentang"
                                        className="transition hover:text-yellow-400"
                                    >
                                        Tentang
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/#harga"
                                        className="transition hover:text-yellow-400"
                                    >
                                        Paket
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/register"
                                        className="transition hover:text-yellow-400"
                                    >
                                        Kontak
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-bold tracking-wider text-gray-200 uppercase">
                                Legal
                            </h2>
                            <ul className="space-y-3 font-medium text-gray-400">
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="transition hover:text-yellow-400"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="transition hover:text-yellow-400"
                                    >
                                        Terms & Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-gray-800" />

                <div className="flex flex-col items-center justify-between md:flex-row">
                    <span className="text-center text-sm text-gray-500 md:text-left">
                        © 2025{' '}
                        <Link href="/" className="transition hover:text-white">
                            Saintara™
                        </Link>
                        . All Rights Reserved.
                    </span>
                    <div className="mt-4 flex space-x-6 md:mt-0">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transform text-gray-400 transition hover:scale-110 hover:text-white"
                        >
                            <FaInstagram size={20} />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transform text-gray-400 transition hover:scale-110 hover:text-white"
                        >
                            <FaLinkedin size={20} />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transform text-gray-400 transition hover:scale-110 hover:text-white"
                        >
                            <FaTwitter size={20} />
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transform text-gray-400 transition hover:scale-110 hover:text-white"
                        >
                            <FaFacebook size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
