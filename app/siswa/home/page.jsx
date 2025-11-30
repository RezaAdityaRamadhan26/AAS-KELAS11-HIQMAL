"use client";
import { useState, useEffect } from "react";
import { BookOpen, AlertCircle } from "lucide-react";

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
        <div className="p-6 bg-white min-h-screen">
            {/* Banner Sambutan */}
            <div className="bg-gradient-to-r from-[#211C84] to-[#08061E] rounded-2xl text-white p-8 mb-8">
                <p className="text-lg">Selamat Datang!</p>
                <h1 className="text-3xl font-bold">Muhamad Hiqmal Saputra</h1>
            </div>

            {/* Header Section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Buku Tersedia</h2>

                {/* Kotak Pencarian */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Cari buku, judul, atau kategori..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                    />
                    <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Semua Kategori</button>
                </div>
            </div>

            {/* Daftar Buku */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayBooks.map((book) => (
                    <div key={book.id_buku} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: 'rgba(33, 28, 132, 0.15)' }}>
                        {/* Gambar buku (placeholder) */}
                        <div className="h-48 bg-[#D9D9D9] flex items-center justify-center">
                            <BookOpen size={64} className="text-gray-400" />
                        </div>

                        {/* Info Buku */}
                        <div className="p-4 bg-white">
                            {/* Judul */}
                            <h3 className="font-bold text-sm mb-1 text-gray-900 line-clamp-2">{book.nama_buku}</h3>

                            {/* Penulis */}
                            <p className="text-xs text-gray-700 mb-3">{book.author}</p>

                            {/* Tombol */}
                            <button
                                onClick={() => openModal(book)}
                                disabled={book.status === "dipinjam"}
                                className={`w-full py-2 rounded-lg text-sm font-semibold ${book.status === "dipinjam"
                                        ? "bg-gray-300 text-gray-600"
                                        : "bg-[#211C84] text-white hover:bg-[#1a1569]"
                                    }`}
                            >
                                {book.status === "dipinjam" ? "Sedang Dipinjam" : "Pinjam Sekarang"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Pinjam Buku */}
            {showModal && selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
                        <div className="flex gap-6">
                            {/* Book Cover */}
                            <div className="w-48 h-64 bg-[#D9D9D9] rounded-lg flex items-center justify-center flex-shrink-0">
                                <BookOpen size={80} className="text-gray-400" />
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
                                        <p className="text-sm font-semibold mb-1">Deskripsi:</p>
                                        <p className="text-sm text-gray-700">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Durasi Peminjaman:</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    >
                                        <option value={7}>7 hari</option>
                                        <option value={14}>14 hari</option>
                                        <option value={30}>30 hari</option>
                                    </select>
                                </div>

                                <div className="bg-[#FEF9C3] rounded-lg p-4 mb-6">
                                    <p className="text-sm text-black flex items-start">
                                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                                        Perhatian: Denda keterlambatan Rp 1.000 per hari. Harap kembalikan buku tepat waktu.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={pinjamBuku}
                                        className="flex-1 bg-[#211C84] text-white rounded-lg py-3 font-semibold hover:bg-[#1a1569]"
                                    >
                                        Konfirmasi Peminjaman
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
                                    >
                                        Batal
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
