import { query } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, Users, BookCopy, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        return <div className="max-w-6xl mx-auto p-6">Akses ditolak.</div>;
    }

    const [summary] = await query(
        `SELECT 
      (SELECT COUNT(*) FROM users WHERE role='siswa') as total_siswa,
      (SELECT COUNT(*) FROM users WHERE role='admin') as total_admin,
      (SELECT COUNT(*) FROM books) as total_books,
      (SELECT COUNT(*) FROM books WHERE status='tersedia') as books_available,
      (SELECT COUNT(*) FROM borrows WHERE status='ongoing') as active_borrows`
    );
    const books = await query(
        "SELECT id_buku, nama_buku, author, genre_buku, tahun_terbit, status FROM books ORDER BY created_at DESC LIMIT 10"
    );

    // Get recent borrows for notifications
    const recentBorrows = await query(
        `SELECT b.borrow_id, b.borrow_date, u.full_name as siswa_name, u.username, bk.nama_buku, b.status
         FROM borrows b
         JOIN users u ON b.user_id = u.user_id
         JOIN books bk ON b.id_buku = bk.id_buku
         WHERE b.status = 'ongoing'
         ORDER BY b.borrow_date DESC
         LIMIT 5`
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-black">Dashboard Admin</h1>
                    <p className="text-gray-600 mt-1">Sistem Manajemen Perpustakaan Sekolah</p>
                </div>
                <input
                    type="text"
                    placeholder="Cari buku,siswa,atau transaksi..."
                    className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#211C84]"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard title="Total Buku" value={summary.total_books} icon={<BookOpen size={32} />} bgColor="bg-blue-50" textColor="text-blue-600" subtext="+20 buku baru" />
                <StatCard title="Siswa Aktif" value={summary.total_siswa} icon={<Users size={32} />} bgColor="bg-green-50" textColor="text-green-600" subtext="+8 siswa baru" />
                <StatCard title="Peminjaman Bulan Ini" value={summary.active_borrows} icon={<BookCopy size={32} />} bgColor="bg-purple-50" textColor="text-purple-600" subtext="+15% dari bulan lalu" />
                <StatCard title="Keterlambatan" value="5" icon={<Clock size={32} />} bgColor="bg-red-50" textColor="text-red-600" subtext="Total denda Rp 11.000" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notifikasi Peminjaman Terbaru */}
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-lg mb-4 text-gray-900">Peminjaman Terbaru</h2>
                    <div className="space-y-3">
                        {recentBorrows.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Belum ada peminjaman baru</p>
                        ) : (
                            recentBorrows.map((borrow) => (
                                <div key={borrow.borrow_id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{borrow.siswa_name}</p>
                                            <p className="text-xs text-gray-600 mt-0.5">@{borrow.username}</p>
                                            <p className="text-xs text-gray-700 mt-1">meminjam: {borrow.nama_buku}</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {new Date(borrow.borrow_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">Baru</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Statistik Peminjaman Chart */}
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-lg mb-4 text-gray-900">Statistik Peminjaman</h2>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Chart akan ditampilkan di sini</p>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Riwayat Keterlambatan Pengembalian */}
                <section className="bg-white rounded-xl border border-gray-200">
                    <div className="p-4 border-b font-semibold text-gray-900">Riwayat Keterlambatan Pengembalian</div>
                    <div className="p-4">
                        <p className="text-sm text-gray-600 mb-2">Denda keterlambatan: Rp 1.000 per hari</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-sm font-medium text-gray-900">Budi Santoso - Dilan 1990</p>
                                <p className="text-xs text-gray-700">Terlambat 10 hari - Rp 10.000</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-sm font-medium text-gray-900">Eki Sulaiman - Laskar Pelangi</p>
                                <p className="text-xs text-gray-700">Terlambat 3 hari - Rp 3.000</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Manajemen Buku Table */}
            <section className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold text-black">Manajemen Buku</h2>
                    <Link
                        href="/admin/manajemen-buku"
                        className="text-sm text-[#211C84] hover:underline font-medium">
                        Lihat Semua
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <Th>Judul Buku</Th>
                                <Th>Penulis</Th>
                                <Th>Penerbit</Th>
                                <Th>Kategori</Th>
                                <Th>Tahun</Th>
                                <Th>Stok</Th>
                                <Th>Tersedia</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((b) => (
                                <tr key={b.id_buku} className="border-t hover:bg-gray-50">
                                    <Td className="font-medium text-black">{b.nama_buku}</Td>
                                    <Td>{b.author}</Td>
                                    <Td>{b.publisher || '-'}</Td>
                                    <Td>
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                            {b.genre_buku}
                                        </span>
                                    </Td>
                                    <Td>{b.tahun_terbit}</Td>
                                    <Td>{b.stock || 0}</Td>
                                    <Td>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'tersedia'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {b.status === 'tersedia' ? '12' : '0'}
                                        </span>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function StatCard({ title, value, icon, bgColor, textColor, subtext }) {
    return (
        <div className={`rounded-xl ${bgColor} p-6`}>
            <div className="flex items-center justify-between mb-2">
                <span className={textColor}>{icon}</span>
                <span className={`text-3xl font-bold ${textColor}`}>{value}</span>
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
            <div className="text-xs text-gray-500">{subtext}</div>
        </div>
    );
}

function Stat({ title, value }) {
    return (
        <div className="rounded-xl border p-4">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
}
function Th({ children }) { return <th className="text-left p-4 font-semibold text-gray-700">{children}</th>; }
function Td({ children, className = '' }) { return <td className={`p-4 text-gray-700 ${className}`}>{children}</td>; }
