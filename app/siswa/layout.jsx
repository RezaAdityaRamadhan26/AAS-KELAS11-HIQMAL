import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SiswaLayout({ children }) {
    const session = await auth();

    // Cek apakah user sudah login
    if (!session?.user) {
        redirect("/login");
    }

    // Cek apakah rolenya siswa
    if (session.user.role !== "siswa") {
        redirect("/admin");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Siswa */}
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                    <Link href="/siswa">
                        <span className="text-2xl font-bold text-indigo-800">StarRead</span>
                    </Link>
                    <nav className="flex items-center gap-8 text-sm">
                        <Link href="/siswa" className="text-gray-600 hover:text-indigo-800">
                            Dashboard
                        </Link>
                        <Link href="/siswa/koleksi-buku" className="text-gray-600 hover:text-indigo-800">
                            Koleksi Buku
                        </Link>
                        <Link href="/siswa/riwayat" className="text-gray-600 hover:text-indigo-800">
                            Riwayat
                        </Link>
                        <Link href="/siswa/profil" className="text-gray-600 hover:text-indigo-800">
                            Profil
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Konten Halaman */}
            {children}
        </div>
    );
}