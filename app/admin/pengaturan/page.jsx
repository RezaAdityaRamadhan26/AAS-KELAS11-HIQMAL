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
                    {/* Settings Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border p-6">
                            <h2 className="text-lg font-semibold mb-4">Pengaturan Peminjaman</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Denda Per Hari (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.fine_per_day}
                                        onChange={(e) =>
                                            setSettings({ ...settings, fine_per_day: Number(e.target.value) })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Denda yang dikenakan untuk setiap hari keterlambatan
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maksimal Hari Peminjaman
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.max_borrow_days}
                                        onChange={(e) =>
                                            setSettings({ ...settings, max_borrow_days: Number(e.target.value) })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Durasi maksimal peminjaman buku (default)
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maksimal Buku Per User
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.max_books_per_user}
                                        onChange={(e) =>
                                            setSettings({ ...settings, max_books_per_user: Number(e.target.value) })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Jumlah maksimal buku yang bisa dipinjam per siswa
                                    </p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2.5 rounded-lg text-sm"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border p-6">
                            <h2 className="text-lg font-semibold mb-4">Informasi Sistem</h2>
                            <div className="space-y-3">
                                <InfoRow label="Versi Aplikasi" value="1.0.0" />
                                <InfoRow label="Database" value="MySQL 8.0" />
                                <InfoRow label="Framework" value="Next.js 16 (Webpack)" />
                                <InfoRow label="Last Updated" value="November 2025" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border p-6">
                            <h3 className="font-semibold mb-4">Aksi Cepat</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg py-2.5 text-sm font-medium">
                                    Backup Database
                                </button>
                                <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 rounded-lg py-2.5 text-sm font-medium">
                                    Export Laporan
                                </button>
                                <button className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg py-2.5 text-sm font-medium">
                                    Clear Cache
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border p-6">
                            <h3 className="font-semibold mb-4">Akun Admin</h3>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-lg py-2.5 text-sm font-medium"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2 border-b last:border-0">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}
