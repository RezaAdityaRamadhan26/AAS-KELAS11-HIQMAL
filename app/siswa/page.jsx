"use client";
// Import React dan hook yang dibutuhkan
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SiswaPage() {
    // Variabel untuk menyimpan data buku
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Variabel untuk pencarian
    const [search, setSearch] = useState("");

    // Variabel untuk modal peminjaman
    const [selectedBook, setSelectedBook] = useState(null);
    const [duration, setDuration] = useState(7);

    // Ambil data buku dari database saat halaman pertama dibuka
    useEffect(() => {
        fetch("/api/books")
            .then((res) => res.json())
            .then((data) => {
                setBooks(data.books || []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // Filter buku berdasarkan pencarian
    const filteredBooks = books.filter((book) => {
        return book.nama_buku.toLowerCase().includes(search.toLowerCase());
    });

    // Fungsi untuk pinjam buku
    async function handleBorrow() {
        const res = await fetch("/api/borrow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_buku: selectedBook.id_buku,
                duration,
            }),
        });

        if (res.ok) {
            alert("Buku berhasil dipinjam!");
            setSelectedBook(null);
            window.location.reload();
        } else {
            alert("Gagal meminjam buku");
        }
    }

    return (
        <div className="p-6">
            {/* Banner Sambutan */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white rounded-xl p-8 mb-6">
                <p className="text-lg">Selamat Datang!</p>
                <h1 className="text-3xl font-bold">Perpustakaan StarRead</h1>
                <p className="mt-2">Temukan buku favoritmu dan pinjam sekarang</p>
            </div>

            {/* Kotak Pencarian */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Cari buku..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-full max-w-md"
                />
            </div>

            {/* Loading */}
            {loading && <p>Memuat data buku...</p>}

            {/* Daftar Buku */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredBooks.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">Tidak ada buku ditemukan</p>
                    ) : (
                        filteredBooks.slice(0, 8).map((book) => {
                            // Get image path
                            const getImagePath = () => {
                                if (!book.gambar) return "/images/book-placeholder.svg";
                                if (book.gambar.startsWith("http")) return book.gambar;
                                return book.gambar.replace("/public", "");
                            };

                            return (
                                <div key={book.id_buku} className="border rounded-lg p-4 bg-white shadow">
                                    {/* Gambar buku */}
                                    <div className="relative h-48 bg-gray-200 rounded mb-3 overflow-hidden">
                                        <Image
                                            src={getImagePath()}
                                            alt={book.nama_buku}
                                            fill
                                            sizes="300px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Judul Buku */}
                                    <h3 className="font-bold text-sm mb-1">{book.nama_buku}</h3>

                                    {/* Nama Penulis */}
                                    <p className="text-xs text-gray-600 mb-1">{book.author}</p>

                                    {/* Genre */}
                                    <p className="text-xs text-indigo-600 mb-3">{book.genre}</p>

                                    {/* Tombol Pinjam */}
                                    <button
                                        onClick={() => setSelectedBook(book)}
                                        disabled={book.status === "dipinjam"}
                                        className={`w-full py-2 rounded text-sm ${book.status === "dipinjam"
                                            ? "bg-gray-300 text-gray-600"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                            }`}
                                    >
                                        {book.status === "dipinjam" ? "Sedang Dipinjam" : "Pinjam"}
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {/* Modal untuk Pinjam Buku */}
            {selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        {/* Gambar Buku di Modal */}
                        <div className="relative h-64 bg-gray-200 rounded mb-4 overflow-hidden">
                            <Image
                                src={
                                    selectedBook.gambar
                                        ? selectedBook.gambar.startsWith("http")
                                            ? selectedBook.gambar
                                            : selectedBook.gambar.replace("/public", "")
                                        : "/images/book-placeholder.svg"
                                }
                                alt={selectedBook.nama_buku}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <h2 className="text-xl font-bold mb-4">{selectedBook.nama_buku}</h2>

                        {/* Info Buku */}
                        <div className="mb-3">
                            <p className="text-sm text-gray-600">Penulis</p>
                            <p>{selectedBook.author}</p>
                        </div>

                        <div className="mb-3">
                            <p className="text-sm text-gray-600">Penerbit</p>
                            <p>{selectedBook.publisher}</p>
                        </div>

                        <div className="mb-3">
                            <p className="text-sm text-gray-600">Genre</p>
                            <p>{selectedBook.genre}</p>
                        </div>

                        {/* Pilih Durasi */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Durasi Peminjaman</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="border rounded px-3 py-2 w-full"
                            >
                                <option value={7}>7 hari</option>
                                <option value={14}>14 hari</option>
                                <option value={30}>30 hari</option>
                            </select>
                        </div>

                        {/* Tombol Modal */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedBook(null)}
                                className="flex-1 border rounded py-2 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBorrow}
                                className="flex-1 bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700"
                            >
                                Pinjam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
