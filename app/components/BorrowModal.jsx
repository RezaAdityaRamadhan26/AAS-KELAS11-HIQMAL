"use client";
import { useState } from "react";

export default function BorrowModal({ book, onClose, onConfirm }) {
    const [duration, setDuration] = useState(7);
    if (!book) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold">{book.nama_buku}</h2>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <div className="aspect-[3/4] w-full rounded-lg bg-gray-100" />
                    </div>
                    <div className="md:col-span-2 space-y-2 text-sm">
                        <div>By <span className="font-medium">{book.author}</span></div>
                        <div>Kategori: <span className="font-medium">{book.genre_buku}</span></div>
                        <div>Status: <span className="font-medium {book.status==='tersedia'?'text-green-600':'text-red-600'}">{book.status}</span></div>
                        <p className="mt-3 text-gray-600 whitespace-pre-wrap max-h-40 overflow-auto">{book.deskripsi || 'Tidak ada deskripsi.'}</p>
                        <div className="pt-3">
                            <label className="text-sm font-medium">Durasi Peminjaman</label>
                            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="ml-2 rounded-md border px-3 py-1">
                                <option value={7}>7 hari</option>
                                <option value={14}>14 hari</option>
                                <option value={30}>30 hari</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6">
                    <button onClick={onClose} className="rounded-md border px-4 py-2">Tutup</button>
                    <button onClick={() => onConfirm({ id_buku: book.id_buku, duration })} className="rounded-md bg-indigo-600 text-white px-4 py-2">Pinjam Sekarang</button>
                </div>
            </div>
        </div>
    );
}
