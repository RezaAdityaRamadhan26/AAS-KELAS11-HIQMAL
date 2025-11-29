"use client";
import Image from "next/image";

export default function BookCard({ book, onBorrow }) {
    const img = book.gambar && book.gambar.startsWith("http") ? book.gambar : "/images/book-placeholder.svg";
    return (
        <div className="rounded-xl border p-3 flex flex-col gap-3">
            <div className="relative w-full h-40 bg-gray-50 rounded-lg overflow-hidden">
                <Image src={img} alt={book.nama_buku} fill sizes="200px" className="object-cover" />
            </div>
            <div className="text-sm font-medium line-clamp-2">{book.nama_buku}</div>
            <div className="text-xs text-gray-500">{book.author}</div>
            <button
                disabled={book.status === "dipinjam"}
                onClick={() => onBorrow(book)}
                className={`mt-auto rounded-md px-3 py-2 text-sm ${book.status === "dipinjam" ? "bg-gray-200 text-gray-500" : "bg-indigo-600 text-white"}`}
            >
                {book.status === "dipinjam" ? "Sedang Dipinjam" : "Pinjam Sekarang"}
            </button>
        </div>
    );
}
