"use client";
import Image from "next/image";

export default function BookCard({ book, onBorrow }) {
    const img =
        book.gambar && book.gambar.startsWith("http")
            ? book.gambar
            : "/images/book-placeholder.svg";
    return (
        <div className="rounded-xl bg-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden">
                <Image src={img} alt={book.nama_buku} fill sizes="200px" className="object-cover" />
            </div>
            <div className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{book.nama_buku}</div>
            <button
                disabled={book.status === "dipinjam"}
                onClick={() => onBorrow(book)}
                className={`mt-auto rounded-lg px-4 py-2.5 text-sm font-medium ${book.status === "dipinjam"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-700 text-white hover:bg-indigo-800"
                    }`}
            >
                {book.status === "dipinjam" ? "Sedang Dipinjam" : "Pinjam Sekarang"}
            </button>
        </div>
    );
}
