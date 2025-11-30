"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function PengaturanPage() {
    const [settings, setSettings] = useState({
        fine_per_day: 1000,
        max_borrow_days: 7,
        max_books_per_user: 3,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.settings) {
            setSettings(data.settings);
        }
        setLoading(false);
    }

    async function handleSave() {
        const res = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
        });

        if (res.ok) {
            alert("Pengaturan berhasil disimpan!");
        } else {
            alert("Gagal menyimpan pengaturan");
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Pengaturan</h1>
                <p className="text-sm text-gray-600">Kelola pengaturan sistem perpustakaan</p>
            </div>

            {loading ? (
                <p>Memuat pengaturan...</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Settings Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4 text-[#211C84]">Pengaturan Peminjaman</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">Denda Per Hari (Rp)</label>
                                    <input
                                        type="number"
                                        value={settings.fine_per_day}
                                        onChange={(e) => setSettings({ ...settings, fine_per_day: Number(e.target.value) })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Denda yang dikenakan untuk setiap hari keterlambatan.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-2">Maksimal Hari Peminjaman</label>
                                        <input
                                            type="number"
                                            value={settings.max_borrow_days}
                                            onChange={(e) => setSettings({ ...settings, max_borrow_days: Number(e.target.value) })}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Durasi maksimal peminjaman buku (default).</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-2">Maksimal Buku Per User</label>
                                        <input
                                            type="number"
                                            value={settings.max_books_per_user}
                                            onChange={(e) => setSettings({ ...settings, max_books_per_user: Number(e.target.value) })}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Jumlah maksimal buku yang dapat dipinjam per siswa.</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={handleSave}
                                        className="bg-[#211C84] hover:bg-[#1a1569] text-white px-6 py-3 rounded-lg text-sm font-semibold w-full md:w-auto"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right: Logout */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-full">
                            <h3 className="font-semibold mb-4 text-[#211C84]">Aksi Akun</h3>
                            <p className="text-sm text-gray-600 mb-6">Kelola sesi masuk admin. Gunakan tombol di bawah untuk keluar dari sistem.</p>
                            <div className="mt-auto">
                                <button
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 text-sm font-semibold shadow-sm transition-colors"
                                >
                                    Keluar Akun
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
