"use client";
import { useState } from "react";
import Image from "next/image";

export default function BorrowModal({ book, onClose, onConfirm }) {
    const [duration, setDuration] = useState(7);
    if (!book) return null;

    // Handle image path: remove /public prefix if exists, or use placeholder
    let img = "/images/book-placeholder.svg";
    if (book.gambar) {
        if (book.gambar.startsWith("http")) {
            img = book.gambar;
        } else if (book.gambar.startsWith("/public/")) {
            img = book.gambar.replace("/public", "");
        } else if (book.gambar.startsWith("/images/")) {
            img = book.gambar;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-8 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6">{book.nama_buku}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Book Cover */}
                    <div className="md:col-span-1">
                        <div className="relative aspect-[3/4] w-full rounded-xl bg-gray-100 overflow-hidden">
                            <Image src={img} alt={book.nama_buku} fill className="object-cover" />
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="md:col-span-2 space-y-3">
                        <div className="text-sm">
                            <span className="text-gray-600">By </span>
                            <span className="font-medium">{book.author}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600">Penerbit : </span>
                            <span className="font-medium">{book.publisher}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600">Tahun Terbit : </span>
                            <span className="font-medium">{book.tahun_terbit}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600">Kategori : </span>
                            <span className="font-medium">{book.genre_buku}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600">Status: </span>
                            <span
                                className={`font-medium ${book.status === "tersedia" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {book.status === "tersedia" ? "Tersedia" : "Dipinjam"}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="pt-2">
                            <div className="text-sm font-medium text-gray-900 mb-1">Deskripsi:</div>
                            <p className="text-sm text-gray-600 leading-relaxed max-h-32 overflow-auto">
                                {book.deskripsi || "Tidak ada deskripsi."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Duration Selection & Actions */}
                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Durasi Peminjaman:</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value={7}>7 hari</option>
                            <option value={14}>14 hari</option>
                            <option value={30}>30 hari</option>
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={() => onConfirm({ id_buku: book.id_buku, duration })}
                            className="rounded-lg bg-indigo-700 text-white px-6 py-2 text-sm hover:bg-indigo-800"
                        >
                            Pinjam Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
