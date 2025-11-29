"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ user }) {
    const pathname = usePathname();
    return (
        <header className="w-full bg-white border-b sticky top-0 z-40">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/logo.svg" alt="StarRead" width={120} height={28} priority />
                </Link>
                <nav className="hidden sm:flex items-center gap-6 text-sm">
                    <Link className={pathname === "/dashboard" ? "font-semibold" : ""} href="/dashboard">Dashboard</Link>
                    {user?.role === "admin" && (
                        <Link className={pathname === "/admin" ? "font-semibold" : ""} href="/admin">Admin</Link>
                    )}
                    <Link href="/login" className="rounded-full border px-4 py-1.5">{user ? "Akun" : "Login"}</Link>
                </nav>
            </div>
        </header>
    );
}
