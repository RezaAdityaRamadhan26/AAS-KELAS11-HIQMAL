"use client";
// Import React dan hook yang dibutuhkan
import { useState, useEffect } from "react";

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Koleksi Buku</h1>

            {/* Filter Pencarian */}
            <div className="flex gap-4 mb-6">
                {/* Input Pencarian */}
                <input
                    type="text"
                    placeholder="Cari judul buku..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-4 py-2 flex-1"
                />

                {/* Select Genre */}
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="border rounded px-4 py-2"
                >
                    <option value="">Semua Genre</option>
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredBooks.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">Tidak ada buku ditemukan</p>
                    ) : (
                        filteredBooks.map((book) => (
                            <div key={book.id_buku} className="border rounded-lg p-4 bg-white shadow">
                                {/* Gambar Buku */}
                                <div className="h-48 bg-gray-200 rounded mb-3 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>

                                {/* Info Buku */}
                                <h3 className="font-bold text-sm mb-1">{book.nama_buku}</h3>
                                <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                                <p className="text-xs text-indigo-600 mb-3">{book.genre}</p>

                                {/* Tombol */}
                                <button
                                    onClick={() => setSelectedBook(book)}
                                    disabled={book.status === "dipinjam"}
                                    className={`w-full py-2 rounded text-sm ${book.status === "dipinjam"
                                            ? "bg-gray-300 text-gray-600"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        }`}
                                >
                                    {book.status === "dipinjam" ? "Dipinjam" : "Pinjam"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal Pinjam Buku */}
            {selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedBook.nama_buku}</h2>

                        {/* Info Detail Buku */}
                        <div className="mb-3">
                            <p className="text-sm text-gray-600">Penulis</p>
                            <p>{selectedBook.author}</p>
                        </div>

                        <div className="mb-3">
                            <p className="text-sm text-gray-600">Penerbit</p>
                            <p>{selectedBook.publisher}</p>
                        </div>

                        {/* Pilih Durasi Peminjaman */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Durasi</label>
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
                                className="flex-1 border rounded py-2"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBorrow}
                                className="flex-1 bg-indigo-600 text-white rounded py-2"
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
