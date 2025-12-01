"use client";
// Import React dan hook yang dibutuhkan
import { useState, useEffect } from "react";
import { BookOpen, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function KoleksiPage() {
    // Variabel untuk menyimpan data
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Variabel untuk filter
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");

    // Variabel untuk modal
    const [selectedBook, setSelectedBook] = useState(null);
    const [duration, setDuration] = useState(7);

    // Ambil data buku dari database
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

    // Filter buku berdasarkan pencarian dan genre
    const filteredBooks = books.filter((book) => {
        const matchSearch = book.nama_buku.toLowerCase().includes(search.toLowerCase());
        const matchGenre = genre ? book.genre === genre : true;
        return matchSearch && matchGenre;
    });

    // Fungsi pinjam buku
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
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Koleksi Buku</h1>

            {/* Filter Pencarian */}
            <div className="flex gap-4 mb-6">
                {/* Input Pencarian */}
                <input
                    type="text"
                    placeholder="Cari Buku..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                />

                {/* Select Genre */}
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]">
                    <option value="">Semua Kategori</option>
                    <option value="Self-Improvement">Self-Improvement</option>
                    <option value="Programming">Programming</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Finance">Finance</option>
                    <option value="Business">Business</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                </select>
            </div>

            {/* Loading */}
            {loading && <p>Memuat data buku...</p>}

            {/* Daftar Buku */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredBooks.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">Tidak ada buku ditemukan</p>
                    ) : (
                        filteredBooks.map((book) => {
                            // Handle image path
                            let bookImage = "/images/book-placeholder.svg";
                            if (book.gambar) {
                                if (book.gambar.startsWith("http")) {
                                    bookImage = book.gambar;
                                } else if (book.gambar.startsWith("/public/")) {
                                    bookImage = book.gambar.replace("/public", "");
                                } else if (book.gambar.startsWith("/images/")) {
                                    bookImage = book.gambar;
                                }
                            }

                            return (
                                <div key={book.id_buku} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: 'rgba(33, 28, 132, 0.15)' }}>
                                    {/* Gambar Buku */}
                                    <div className="relative h-48 bg-[#D9D9D9] overflow-hidden">
                                        <Image
                                            src={bookImage}
                                            alt={book.nama_buku}
                                            fill
                                            sizes="300px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info Buku */}
                                    <div className="p-4 bg-white">
                                        <h3 className="font-bold text-sm mb-1 text-gray-900 line-clamp-2">{book.nama_buku}</h3>
                                        <p className="text-xs text-gray-700 mb-1">{book.author}</p>
                                        <p className="text-xs text-[#211C84] font-semibold mb-3">{book.genre}</p>

                                        {/* Tombol */}
                                        <button
                                            onClick={() => setSelectedBook(book)}
                                            disabled={book.status === "dipinjam"}
                                            className={`w-full py-2 rounded-lg text-sm font-semibold ${book.status === "dipinjam"
                                                ? "bg-gray-300 text-gray-600"
                                                : "bg-[#211C84] text-white hover:bg-[#1a1569]"
                                                }`}
                                        >
                                            {book.status === "dipinjam" ? "Dipinjam" : "Pinjam Sekarang"}
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {/* Modal Pinjam Buku */}
            {selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
                        <div className="flex gap-6">
                            {/* Book Cover */}
                            <div className="relative w-48 h-64 bg-[#D9D9D9] rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={
                                        selectedBook.gambar
                                            ? selectedBook.gambar.startsWith("http")
                                                ? selectedBook.gambar
                                                : selectedBook.gambar.startsWith("/public/")
                                                    ? selectedBook.gambar.replace("/public", "")
                                                    : selectedBook.gambar.startsWith("/images/")
                                                        ? selectedBook.gambar
                                                        : "/images/book-placeholder.svg"
                                            : "/images/book-placeholder.svg"
                                    }
                                    alt={selectedBook.nama_buku}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Book Details */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{selectedBook.nama_buku}</h2>

                                <div className="space-y-3 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-800">By {selectedBook.author}</p>
                                        <p className="text-sm text-gray-800">Penerbit: {selectedBook.publisher}</p>
                                        <p className="text-sm text-gray-800">Tahun Terbit: {selectedBook.year || 'N/A'}</p>
                                        <p className="text-sm text-gray-800">Kategori: {selectedBook.genre || 'Non Fiksi'}</p>
                                        <p className="text-sm text-green-700 font-semibold">Status: Tersedia</p>
                                        <p className="text-sm text-gray-800">Stok Tersedia: {selectedBook.stock || 8}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold mb-1 text-gray-900">Deskripsi:</p>
                                        <p className="text-sm text-gray-800">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold mb-2 text-gray-900">Durasi Peminjaman:</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    >
                                        <option value={7}>7 hari</option>
                                        <option value={14}>14 hari</option>
                                        <option value={30}>30 hari</option>
                                    </select>
                                </div>

                                <div className="bg-[#FEF9C3] rounded-lg p-4 mb-6">
                                    <p className="text-sm text-gray-900 flex items-start font-medium">
                                        <AlertCircle size={20} className="mr-2 flex-shrink-0 text-gray-800" />
                                        Perhatian: Denda keterlambatan Rp 1.000 per hari. Harap kembalikan buku tepat waktu.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleBorrow}
                                        className="flex-1 bg-[#211C84] text-white rounded-lg py-3 font-semibold hover:bg-[#1a1569] transition-colors"
                                    >
                                        Konfirmasi Peminjaman
                                    </button>
                                    <button
                                        onClick={() => setSelectedBook(null)}
                                        className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
