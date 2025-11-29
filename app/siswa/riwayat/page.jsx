"use client";
// Import React dan hook yang dibutuhkan
import { useState, useEffect } from "react";

export default function RiwayatPage() {
    // Variabel untuk menyimpan data riwayat
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil data riwayat peminjaman dari database
    useEffect(() => {
        fetch("/api/siswa/riwayat")
            .then((res) => res.json())
            .then((data) => {
                setBorrows(data.borrows || []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Riwayat Peminjaman</h1>

            {/* Loading */}
            {loading && <p>Memuat riwayat...</p>}

            {/* Tabel Riwayat */}
            {!loading && (
                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full">
                        {/* Header Tabel */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">Buku</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Tanggal Pinjam</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Jatuh Tempo</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Tanggal Kembali</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            </tr>
                        </thead>

                        {/* Isi Tabel */}
                        <tbody>
                            {borrows.length === 0 ? (
                                // Jika tidak ada data
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        Belum ada riwayat peminjaman
                                    </td>
                                </tr>
                            ) : (
                                // Tampilkan setiap baris data
                                borrows.map((row) => (
                                    <tr key={row.id_borrow} className="border-t hover:bg-gray-50">
                                        {/* Nama Buku */}
                                        <td className="px-4 py-3 text-sm">{row.nama_buku}</td>

                                        {/* Tanggal Pinjam */}
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(row.borrow_date).toLocaleDateString("id-ID")}
                                        </td>

                                        {/* Jatuh Tempo */}
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(row.due_date).toLocaleDateString("id-ID")}
                                        </td>

                                        {/* Tanggal Kembali */}
                                        <td className="px-4 py-3 text-sm">
                                            {row.return_date
                                                ? new Date(row.return_date).toLocaleDateString("id-ID")
                                                : "-"}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${row.status === "returned"
                                                        ? "bg-green-100 text-green-700"
                                                        : row.status === "late"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {row.status === "returned"
                                                    ? "Dikembalikan"
                                                    : row.status === "late"
                                                        ? "Terlambat"
                                                        : "Dipinjam"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
