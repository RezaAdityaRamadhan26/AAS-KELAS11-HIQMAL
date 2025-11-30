"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { User, Mail, Briefcase, Phone, Calendar, BookOpen, X, LogOut } from "lucide-react";

export default function ProfilPage() {
    const [session, setSession] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        phone: "+62 897-6832-2928",
        birthdate: "2005-10-20",
        jurusan: "Rekayasa Perangkat Lunak"
    });

    useEffect(() => {
        // Fetch session data
        fetch("/api/auth/session")
            .then(res => res.json())
            .then(data => {
                setSession(data);
                if (data?.user) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.user.name || "",
                        email: data.user.email || "",
                        username: data.user.username || ""
                    }));
                }
            });
    }, []);

    const handleSave = async () => {
        try {
            // Validate required fields
            if (!formData.name || !formData.email) {
                alert("Nama dan email harus diisi!");
                return;
            }

            const res = await fetch("/api/siswa/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    username: formData.username?.trim() || undefined
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Profil berhasil diperbarui!");
                setShowEditModal(false);
                // Refresh local session display without full reload
                const refreshed = await fetch("/api/auth/session").then(r => r.json());
                setSession(refreshed);
            } else {
                alert("Gagal memperbarui profil: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan: " + error.message);
        }
    };

    if (!session) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <p className="text-gray-600">Memuat profil...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-[#211C84] to-[#08061E] rounded-2xl text-white p-8 mb-8">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-[#211C84]">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{session?.user?.name || "User"}</h1>
                        <p className="text-sm opacity-90">NISN/NIS : 931840987238</p>
                        <p className="text-sm opacity-90">XI RPL 2</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="px-4 py-2 bg-white text-[#211C84] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Edit Profil
                        </button>
                        <button
                            onClick={() => signOut()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                            title="Keluar"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Informasi Pribadi */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-900">Informasi Pribadi</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <User size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-medium">Username</p>
                                <p className="font-semibold text-gray-900">@{session?.user?.username || "hiqmal"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <User size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-medium">Nama Lengkap</p>
                                <p className="font-semibold text-gray-900">{session?.user?.name || "Muhamad Hiqmal Saputra"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Mail size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-medium">Email</p>
                                <p className="font-semibold text-gray-900">{session?.user?.email || "muhamadHiqmalsaputra@gmail.com"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <Briefcase size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-medium">Jurusan</p>
                                <p className="font-semibold text-gray-900">Rekayasa Perangkat Lunak</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                                <Phone size={20} className="text-pink-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-medium">No. Telp</p>
                                <p className="font-semibold text-gray-900">+62 897-6832-2928</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <Calendar size={20} className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-medium">Tanggal Lahir</p>
                                <p className="font-semibold text-gray-900">20, Oktober 2005</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Riwayat Aktivitas */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-900">Riwayat Aktivitas</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <BookOpen size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-medium">NISN/NIS</p>
                                <p className="font-semibold text-gray-900">931847730748</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                    <p className="text-sm text-gray-700 mb-2 font-medium">Sedang Dipinjam</p>
                    <p className="text-4xl font-bold text-blue-600">4</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
                    <p className="text-sm text-gray-700 mb-2 font-medium">Dikembalikan</p>
                    <p className="text-4xl font-bold text-green-600">4</p>
                </div>
                <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
                    <p className="text-sm text-gray-700 mb-2 font-medium">Total Denda</p>
                    <p className="text-4xl font-bold text-red-600">4</p>
                </div>
            </div>

            {/* Reading Statistics Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6 text-gray-900">Statistik Buku Yang Dibaca</h2>
                {/* Placeholder chart */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Chart akan ditampilkan di sini</p>
                </div>
            </div>

            {/* Modal Edit Profil */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Profil</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">No. Telepon</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        value={formData.birthdate}
                                        onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Jurusan</label>
                                <select
                                    value={formData.jurusan}
                                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                >
                                    <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                                    <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan</option>
                                    <option value="Multimedia">Multimedia</option>
                                    <option value="Sistem Informasi">Sistem Informasi</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-6 py-3 bg-[#211C84] text-white rounded-lg hover:bg-[#1a1569] font-semibold transition-colors"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
