"use client";
import { useState, useEffect } from "react";

export default function StudentHomePage() {
    // Variabel untuk menyimpan data
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [duration, setDuration] = useState(7);

    // Ambil data buku dari database
    useEffect(() => {
        fetch("/api/books")
            .then((response) => response.json())
            .then((data) => {
                if (data.books) {
                    setBooks(data.books);
                }
            });
    }, []);

    // Filter buku berdasarkan pencarian
    const displayBooks = books.filter((book) => {
        return book.nama_buku.toLowerCase().includes(search.toLowerCase());
    });

    // Fungsi untuk buka modal
    function openModal(book) {
        setSelectedBook(book);
        setShowModal(true);
    }

    // Fungsi untuk tutup modal
    function closeModal() {
        setShowModal(false);
        setSelectedBook(null);
    }

    // Fungsi untuk pinjam buku
    async function pinjamBuku() {
        const response = await fetch("/api/borrow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_buku: selectedBook.id_buku,
                duration: duration,
            }),
        });

        if (response.ok) {
            alert("Buku berhasil dipinjam!");
            closeModal();
            // Refresh data buku
            window.location.reload();
        } else {
            alert("Gagal meminjam buku");
        }
    }

    return (
        <div className="p-6">
            {/* Banner Sambutan */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-xl text-white p-8 mb-6">
                <p className="text-lg">Selamat Datang!</p>
                <h1 className="text-3xl font-bold">Muhamad Hiqmal Saputra</h1>
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

            {/* Daftar Buku */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayBooks.map((book) => (
                    <div key={book.id_buku} className="border rounded-lg p-4 bg-white">
                        {/* Gambar buku (placeholder) */}
                        <div className="h-40 bg-gray-200 rounded mb-3"></div>

                        {/* Judul */}
                        <h3 className="font-bold text-sm mb-1">{book.nama_buku}</h3>

                        {/* Penulis */}
                        <p className="text-xs text-gray-600 mb-3">{book.author}</p>

                        {/* Tombol */}
                        <button
                            onClick={() => openModal(book)}
                            disabled={book.status === "dipinjam"}
                            className={`w-full py-2 rounded text-sm ${book.status === "dipinjam"
                                    ? "bg-gray-300 text-gray-600"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                        >
                            {book.status === "dipinjam" ? "Sedang Dipinjam" : "Pinjam"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal Pinjam Buku */}
            {showModal && selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedBook.nama_buku}</h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600">Penulis</p>
                            <p className="font-medium">{selectedBook.author}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600">Penerbit</p>
                            <p className="font-medium">{selectedBook.publisher}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Durasi Peminjaman
                            </label>
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

                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 border rounded py-2 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={pinjamBuku}
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
