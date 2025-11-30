"use client";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
                <AlertTriangle size={24} className="text-red-600" />
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
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                        <h2 className="font-semibold text-black">Riwayat Keterlambatan Pengembalian</h2>
                        <span className="text-xs text-gray-600">Denda keterlambatan: Rp 1.000 per hari</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#211C84] text-white">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold">Nama Siswa</th>
                                    <th className="text-left px-4 py-3 font-semibold">NIS</th>
                                    <th className="text-left px-4 py-3 font-semibold">Judul Buku</th>
                                    <th className="text-left px-4 py-3 font-semibold">Tgl Pinjam</th>
                                    <th className="text-left px-4 py-3 font-semibold">Tgl Jatuh Tempo</th>
                                    <th className="text-left px-4 py-3 font-semibold">Tgl Kembali</th>
                                    <th className="text-left px-4 py-3 font-semibold">Hari Terlambat</th>
                                    <th className="text-left px-4 py-3 font-semibold">Denda</th>
                                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lateBorrows.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
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
                                            <tr key={b.borrow_id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-black">{b.nama_siswa}</td>
                                                <td className="px-4 py-3 text-gray-700">{b.username}</td>
                                                <td className="px-4 py-3 text-gray-700">{b.judul_buku}</td>
                                                <td className="px-4 py-3 text-gray-700">{new Date(b.tgl_pinjam).toLocaleDateString("id-ID")}</td>
                                                <td className="px-4 py-3 text-gray-700">{new Date(b.tgl_jatuh_tempo).toLocaleDateString("id-ID")}</td>
                                                <td className="px-4 py-3 text-gray-700">
                                                    {b.tgl_kembali ? new Date(b.tgl_kembali).toLocaleDateString("id-ID") : "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-semibold text-red-600">
                                                        {lateDays > 0 ? `${lateDays} hari` : "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-semibold text-red-600">
                                                        {denda > 0 ? `Rp ${denda.toLocaleString("id-ID")}` : "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        {b.status === "ongoing" ? (
                                                            <button
                                                                onClick={() => handleReturn(b.borrow_id)}
                                                                className="w-32 px-4 py-2 bg-[#211C84] hover:bg-[#1a1569] text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                                                            >
                                                                Konfirmasi
                                                            </button>
                                                        ) : (
                                                            <span
                                                                className={`w-32 text-center px-4 py-2 rounded-full text-xs font-semibold inline-block ${b.status === "returned"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"}`}
                                                            >
                                                                {b.status === "returned" ? "Sudah Bayar" : "Belum Bayar"}
                                                            </span>
                                                        )}
                                                    </div>
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
