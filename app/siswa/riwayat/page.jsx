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
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Riwayat Peminjaman</h1>

            {/* Loading */}
            {loading && <p>Memuat riwayat...</p>}

            {/* Tabel Riwayat */}
            {!loading && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        {/* Header Tabel */}
                        <thead className="bg-[#211C84] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Buku</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Pinjam</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Jatuh Tempo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Kembali</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Denda</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                            </tr>
                        </thead>

                        {/* Isi Tabel */}
                        <tbody>
                            {borrows.length === 0 ? (
                                // Jika tidak ada data
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada riwayat peminjaman
                                    </td>
                                </tr>
                            ) : (
                                // Tampilkan setiap baris data
                                borrows.map((row) => (
                                    <tr key={row.id_borrow} className="border-t border-gray-100 hover:bg-gray-50">
                                        {/* Nama Buku */}
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.nama_buku}</td>

                                        {/* Tanggal Pinjam */}
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {new Date(row.borrow_date).toLocaleDateString("id-ID")}
                                        </td>

                                        {/* Jatuh Tempo */}
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {new Date(row.due_date).toLocaleDateString("id-ID")}
                                        </td>

                                        {/* Tanggal Kembali */}
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {row.return_date
                                                ? new Date(row.return_date).toLocaleDateString("id-ID")
                                                : "-"}
                                        </td>

                                        {/* Denda */}
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {row.fine_amount > 0
                                                ? `Rp ${row.fine_amount.toLocaleString('id-ID')}`
                                                : "-"}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === "returned"
                                                    ? "bg-green-100 text-green-700"
                                                    : row.status === "late"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {row.status === "returned"
                                                    ? "Sudah Basar"
                                                    : row.status === "late"
                                                        ? "Belum Bayar"
                                                        : "Sedang Berjalan"}
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
