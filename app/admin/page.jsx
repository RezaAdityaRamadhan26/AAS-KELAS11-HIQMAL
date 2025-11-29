import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

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

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Stat title="Total Buku" value={summary.total_books} />
                <Stat title="Siswa Aktif" value={summary.total_siswa} />
                <Stat title="Peminjaman Aktif" value={summary.active_borrows} />
                <Stat title="Tersedia" value={summary.books_available} />
                <Stat title="Admin" value={summary.total_admin} />
            </div>
            <section className="bg-white rounded-xl border">
                <div className="p-4 border-b font-medium">Manajemen Buku</div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <Th>Judul Buku</Th>
                                <Th>Penulis</Th>
                                <Th>Kategori</Th>
                                <Th>Tahun</Th>
                                <Th>Status</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((b) => (
                                <tr key={b.id_buku} className="border-t">
                                    <Td>{b.nama_buku}</Td>
                                    <Td>{b.author}</Td>
                                    <Td>{b.genre_buku}</Td>
                                    <Td>{b.tahun_terbit}</Td>
                                    <Td className={b.status === 'tersedia' ? 'text-green-600' : 'text-amber-600'}>{b.status}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
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
function Th({ children }) { return <th className="text-left p-3">{children}</th>; }
function Td({ children, className = '' }) { return <td className={`p-3 ${className}`}>{children}</td>; }
