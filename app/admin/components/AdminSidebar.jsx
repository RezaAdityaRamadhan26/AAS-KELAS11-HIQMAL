"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;

    return (
        <aside className="w-60 bg-white border-r fixed h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-indigo-800">StarRead</h1>
                <p className="text-xs text-gray-500 mt-1">Admin Perpustakaan</p>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 p-4">
                <NavItem
                    href="/admin"
                    icon={<DashboardIcon />}
                    label="Dashboard"
                    active={isActive("/admin")}
                />
                <NavItem
                    href="/admin/manajemen-buku"
                    icon={<BookIcon />}
                    label="Manajemen Buku"
                    active={isActive("/admin/manajemen-buku")}
                />
                <NavItem
                    href="/admin/keterlambatan"
                    icon={<ClockIcon />}
                    label="Keterlambatan"
                    active={isActive("/admin/keterlambatan")}
                />
                <NavItem
                    href="/admin/pengaturan"
                    icon={<SettingsIcon />}
                    label="pengaturan"
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
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
        >
            <span className={active ? "text-indigo-700" : "text-gray-500"}>{icon}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}

const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
    </svg>
);
const BookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    </svg>
);
const ClockIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
        />
    </svg>
);
const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
        />
    </svg>
);
