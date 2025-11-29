"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiswaNavbar({ user }) {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;

    return (
        <header className="w-full bg-white border-b sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                <Link href="/siswa" className="flex items-center">
                    <span className="text-2xl font-bold text-indigo-800">StarRead</span>
                </Link>
                <nav className="flex items-center gap-8 text-sm">
                    <Link
                        className={`${isActive("/siswa") ? "font-semibold text-indigo-800" : "text-gray-600"}`}
                        href="/siswa"
                    >
                        Dashboard
                    </Link>
                    <Link
                        className={`${isActive("/siswa/koleksi-buku") ? "font-semibold text-indigo-800" : "text-gray-600"}`}
                        href="/siswa/koleksi-buku"
                    >
                        Koleksi Buku
                    </Link>
                    <Link
                        className={`${isActive("/siswa/riwayat") ? "font-semibold text-indigo-800" : "text-gray-600"}`}
                        href="/siswa/riwayat"
                    >
                        Riwayat
                    </Link>
                    <Link
                        className={`${isActive("/siswa/profil") ? "font-semibold text-indigo-800" : "text-gray-600"}`}
                        href="/siswa/profil"
                    >
                        Profil
                    </Link>
                    <Link href="/siswa/profil">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
