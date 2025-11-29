"use client";
import { useState, useEffect } from "react";

export default function ManajemenBukuPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id_buku: "",
        nama_buku: "",
        author: "",
        publisher: "",
        genre_buku: "",
        tahun_terbit: "",
        gambar: "",
        deskripsi: "",
    });

    // Load data buku
    useEffect(() => {
        loadBooks();
    }, []);

    async function loadBooks() {
        const res = await fetch("/api/admin/books");
        const data = await res.json();
        setBooks(data.books || []);
        setLoading(false);
    }

    // Tambah/Edit buku
    async function handleSubmit(e) {
        e.preventDefault();
        const method = editMode ? "PUT" : "POST";

        const res = await fetch("/api/admin/books", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert(editMode ? "Buku berhasil diupdate!" : "Buku berhasil ditambahkan!");
            setShowModal(false);
            resetForm();
            loadBooks();
        } else {
            alert("Gagal menyimpan buku");
        }
    }

    // Hapus buku
    async function handleDelete(id_buku) {
        if (!confirm("Yakin ingin menghapus buku ini?")) return;

        const res = await fetch(`/api/admin/books?id=${id_buku}`, {
            method: "DELETE",
        });

        if (res.ok) {
            alert("Buku berhasil dihapus!");
            loadBooks();
        } else {
            const data = await res.json();
            alert(data.error || "Gagal menghapus buku");
        }
    }

    // Edit buku
    function handleEdit(book) {
        setFormData({
            id_buku: book.id_buku,
            nama_buku: book.nama_buku,
            author: book.author,
            publisher: book.publisher,
            genre_buku: book.genre_buku,
            tahun_terbit: book.tahun_terbit || "",
            gambar: book.gambar || "",
            deskripsi: book.deskripsi || "",
        });
        setEditMode(true);
        setShowModal(true);
    }

    function resetForm() {
        setFormData({
            id_buku: "",
            nama_buku: "",
            author: "",
            publisher: "",
            genre_buku: "",
            tahun_terbit: "",
            gambar: "",
            deskripsi: "",
        });
        setEditMode(false);
    }

    function openAddModal() {
        resetForm();
        setShowModal(true);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Manajemen Buku</h1>
                    <p className="text-sm text-gray-600">Kelola koleksi buku perpustakaan</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2.5 rounded-lg text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Tambah Buku
                </button>
            </div>

            {loading ? (
                <p>Memuat data...</p>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="p-4 border-b">
                        <span className="font-medium">Total Buku: {books.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-3 font-medium">Judul Buku</th>
                                    <th className="text-left p-3 font-medium">Penulis</th>
                                    <th className="text-left p-3 font-medium">Penerbit</th>
                                    <th className="text-left p-3 font-medium">Kategori</th>
                                    <th className="text-left p-3 font-medium">Tahun</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((b) => (
                                    <tr key={b.id_buku} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{b.nama_buku}</td>
                                        <td className="p-3">{b.author}</td>
                                        <td className="p-3">{b.publisher}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                                {b.genre_buku}
                                            </span>
                                        </td>
                                        <td className="p-3">{b.tahun_terbit}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${b.status === "tersedia"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(b)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(b.id_buku)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Hapus"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Tambah/Edit Buku */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editMode ? "Edit Buku" : "Tambah Buku Baru"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Judul Buku *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nama_buku}
                                        onChange={(e) => setFormData({ ...formData, nama_buku: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Penulis *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Penerbit *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.publisher}
                                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Genre *</label>
                                    <select
                                        required
                                        value={formData.genre_buku}
                                        onChange={(e) => setFormData({ ...formData, genre_buku: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Pilih Genre</option>
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

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tahun Terbit</label>
                                    <input
                                        type="number"
                                        value={formData.tahun_terbit}
                                        onChange={(e) => setFormData({ ...formData, tahun_terbit: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="2024"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">URL Gambar</label>
                                    <input
                                        type="text"
                                        value={formData.gambar}
                                        onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                                    <textarea
                                        rows={3}
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Deskripsi buku..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border rounded py-2 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700"
                                >
                                    {editMode ? "Update" : "Tambah"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
