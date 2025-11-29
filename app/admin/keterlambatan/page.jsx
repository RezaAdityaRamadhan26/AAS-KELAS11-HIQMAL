"use client";
import { useState, useEffect } from "react";

export default function KeterlambatanPage() {
    const [lateBorrows, setLateBorrows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLateBorrows();
    }, []);

    async function loadLateBorrows() {
        // Menggunakan query dari backend
        const res = await fetch("/api/admin/late-borrows");
        const data = await res.json();
        setLateBorrows(data.borrows || []);
        setLoading(false);
    }

    async function handleReturn(borrow_id) {
        if (!confirm("Konfirmasi pengembalian buku ini?")) return;

        const res = await fetch("/api/admin/return", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ borrow_id }),
        });

        if (res.ok) {
            const data = await res.json();
            if (data.late_days > 0) {
                alert(
                    `Buku dikembalikan! Terlambat ${data.late_days} hari. Denda: Rp ${data.fine_amount.toLocaleString()}`
                );
            } else {
                alert("Buku berhasil dikembalikan!");
            }
            loadLateBorrows();
        } else {
            alert("Gagal mengembalikan buku");
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Keterlambatan</h1>
                <p className="text-sm text-gray-600">
                    Kelola dan pantau keterlambatan pengembalian buku
                </p>
            </div>

            {/* Alert Summary */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                <div>
                    <div className="font-medium text-red-900">
                        {lateBorrows.length} Peminjaman Terlambat/Aktif
                    </div>
                    <div className="text-sm text-red-700">
                        Harap segera ditindaklanjuti untuk menghindari denda bertambah
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Memuat data...</p>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold">Riwayat Keterlambatan Pengembalian</h2>
                        <span className="text-xs text-gray-500">Denda keterlambatan: Rp 1.000 per hari</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-3 font-medium">Nama Siswa</th>
                                    <th className="text-left p-3 font-medium">Username</th>
                                    <th className="text-left p-3 font-medium">Judul Buku</th>
                                    <th className="text-left p-3 font-medium">Tgl Pinjam</th>
                                    <th className="text-left p-3 font-medium">Jatuh Tempo</th>
                                    <th className="text-left p-3 font-medium">Tgl Kembali</th>
                                    <th className="text-left p-3 font-medium">Hari Terlambat</th>
                                    <th className="text-left p-3 font-medium">Denda</th>
                                    <th className="text-left p-3 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lateBorrows.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-6 text-center text-gray-500">
                                            Tidak ada keterlambatan
                                        </td>
                                    </tr>
                                ) : (
                                    lateBorrows.map((b) => {
                                        const now = new Date();
                                        const dueDate = new Date(b.due_date);
                                        const lateDays = b.return_date
                                            ? Math.max(
                                                0,
                                                Math.floor((new Date(b.return_date) - dueDate) / (1000 * 60 * 60 * 24))
                                            )
                                            : Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)));
                                        const denda = b.fine_amount || lateDays * 1000;

                                        return (
                                            <tr key={b.borrow_id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{b.nama_siswa}</td>
                                                <td className="p-3">{b.username}</td>
                                                <td className="p-3">{b.judul_buku}</td>
                                                <td className="p-3">{new Date(b.tgl_pinjam).toLocaleDateString("id-ID")}</td>
                                                <td className="p-3">{new Date(b.tgl_jatuh_tempo).toLocaleDateString("id-ID")}</td>
                                                <td className="p-3">
                                                    {b.tgl_kembali ? new Date(b.tgl_kembali).toLocaleDateString("id-ID") : "-"}
                                                </td>
                                                <td className="p-3">
                                                    <span className="font-medium text-red-600">
                                                        {lateDays > 0 ? `${lateDays} hari` : "-"}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span className="font-medium text-red-600">
                                                        {denda > 0 ? `Rp ${denda.toLocaleString("id-ID")}` : "-"}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {b.status === "ongoing" ? (
                                                        <button
                                                            onClick={() => handleReturn(b.borrow_id)}
                                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                                                        >
                                                            Kembalikan
                                                        </button>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                            {b.status === "returned" ? "Dikembalikan" : "Terlambat"}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
