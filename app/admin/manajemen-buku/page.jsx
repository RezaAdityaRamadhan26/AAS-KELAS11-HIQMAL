"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

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

        try {
            const res = await fetch("/api/admin/books", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert(editMode ? "Buku berhasil diupdate!" : "Buku berhasil ditambahkan!");
                setShowModal(false);
                resetForm();
                loadBooks();
            } else {
                // Tampilkan error message dari server
                alert(`Gagal menyimpan buku: ${data.error || "Unknown error"}`);
                console.error("Error response:", data);
            }
        } catch (error) {
            alert("Gagal menyimpan buku: " + error.message);
            console.error("Error:", error);
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
                    <h1 className="text-2xl font-bold mb-1 text-[#211C84]">Manajemen Buku</h1>
                    <p className="text-sm text-gray-700">Kelola koleksi buku perpustakaan</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-[#211C84] hover:bg-[#1a1569] text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                    <Plus size={20} />
                    Tambah Buku
                </button>
            </div>

            {loading ? (
                <p>Memuat data...</p>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b bg-white">
                        <span className="font-semibold text-gray-900">Total Buku: {books.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-white">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-800">Judul Buku</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-800">Penulis</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-800">Penerbit</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-800">Kategori</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-800">Tahun</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-800">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-800">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {books.map((b) => (
                                    <tr key={b.id_buku} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-900">{b.nama_buku}</td>
                                        <td className="px-4 py-3 text-gray-900">{b.author}</td>
                                        <td className="px-4 py-3 text-gray-900">{b.publisher}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                                                {b.genre_buku}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">{b.tahun_terbit}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${b.status === "tersedia"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(b)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(b.id_buku)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-[#211C84]">
                            {editMode ? "Edit Buku" : "Tambah Buku Baru"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Judul Buku *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nama_buku}
                                        onChange={(e) => setFormData({ ...formData, nama_buku: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Penulis *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Penerbit *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.publisher}
                                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Genre *</label>
                                    <select
                                        required
                                        value={formData.genre_buku}
                                        onChange={(e) => setFormData({ ...formData, genre_buku: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
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
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Tahun Terbit</label>
                                    <input
                                        type="number"
                                        value={formData.tahun_terbit}
                                        onChange={(e) => setFormData({ ...formData, tahun_terbit: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                        placeholder="2024"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">URL Gambar</label>
                                    <input
                                        type="text"
                                        value={formData.gambar}
                                        onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">Deskripsi</label>
                                    <textarea
                                        rows={4}
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                                        placeholder="Deskripsi buku..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="sm:flex-1 w-full border border-gray-300 rounded-lg py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="sm:flex-1 w-full bg-[#211C84] text-white rounded-lg py-3 hover:bg-[#1a1569] font-semibold shadow-sm transition-colors"
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
