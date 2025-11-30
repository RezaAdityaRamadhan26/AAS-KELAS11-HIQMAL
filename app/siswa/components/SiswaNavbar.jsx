"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

export default function SiswaNavbar({ user }) {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;

    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/siswa" className="flex items-center">
                    <span className="text-2xl font-bold text-[#211C84]">StarRead</span>
                </Link>
                <nav className="flex items-center gap-8 text-sm">
                    <Link
                        className={`${isActive("/siswa") || isActive("/siswa/home") ? "font-semibold text-[#211C84]" : "text-gray-600 hover:text-[#211C84]"}`}
                        href="/siswa"
                    >
                        Dashboard
                    </Link>
                    <Link
                        className={`${isActive("/siswa/koleksi-buku") ? "font-semibold text-[#211C84]" : "text-gray-600 hover:text-[#211C84]"}`}
                        href="/siswa/koleksi-buku"
                    >
                        Koleksi Buku
                    </Link>
                    <Link
                        className={`${isActive("/siswa/riwayat") ? "font-semibold text-[#211C84]" : "text-gray-600 hover:text-[#211C84]"}`}
                        href="/siswa/riwayat"
                    >
                        Riwayat
                    </Link>
                    <Link
                        className={`${isActive("/siswa/profil") ? "font-semibold text-[#211C84]" : "text-gray-600 hover:text-[#211C84]"}`}
                        href="/siswa/profil"
                    >
                        Profil
                    </Link>
                    <Link href="/siswa/profil">
                        <div className="w-9 h-9 rounded-full bg-[#211C84] flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
