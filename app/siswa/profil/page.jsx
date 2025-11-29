"use client";
// Import NextAuth untuk ambil data user
import { useSession, signOut } from "next-auth/react";

export default function ProfilPage() {
    // Ambil data user dari session
    const { data: session, status } = useSession();

    // Jika masih loading
    if (status === "loading") {
        return (
            <div className="p-6">
                <p>Memuat profil...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

            <div className="bg-white border rounded-lg p-6 max-w-2xl">
                {/* Avatar (Huruf Pertama Nama) */}
                <div className="mb-6">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Info User */}
                <div className="space-y-4 mb-6">
                    {/* Nama Lengkap */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nama Lengkap
                        </label>
                        <p className="text-lg font-medium">{session?.user?.name || "-"}</p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Username
                        </label>
                        <p className="text-lg">{session?.user?.username || "-"}</p>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Role
                        </label>
                        <p className="text-lg">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                {session?.user?.role === "siswa" ? "Siswa" : "Admin"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Tombol Logout */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-lg py-2 font-medium"
                >
                    Keluar
                </button>
            </div>
        </div>
    );
}
