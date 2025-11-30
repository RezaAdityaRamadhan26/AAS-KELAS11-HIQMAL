"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Clock, Settings } from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;

    return (
        <aside className="w-60 bg-[#211C84] fixed h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/30">
                <h1 className="text-2xl font-bold text-white">StarRead</h1>
                <p className="text-xs text-white/80 mt-1">Admin Perpustakaan</p>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 p-4">
                <NavItem
                    href="/admin"
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    active={isActive("/admin")}
                />
                <NavItem
                    href="/admin/manajemen-buku"
                    icon={<BookOpen size={20} />}
                    label="Manajemen Buku"
                    active={isActive("/admin/manajemen-buku")}
                />
                <NavItem
                    href="/admin/keterlambatan"
                    icon={<Clock size={20} />}
                    label="Keterlambatan"
                    active={isActive("/admin/keterlambatan")}
                />
                <NavItem
                    href="/admin/pengaturan"
                    icon={<Settings size={20} />}
                    label="Pengaturan"
                    active={isActive("/admin/pengaturan")}
                />
            </nav>
        </aside>
    );
}

function NavItem({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${active
                ? "bg-white/20 text-white font-medium"
                : "text-white/90 hover:bg-white/10"
                }`}
        >
            <span className="text-white">{icon}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}
