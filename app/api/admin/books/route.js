import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

// GET - Ambil semua buku
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const books = await query(
    `SELECT id_buku, nama_buku, author, publisher, genre_buku, tahun_terbit, 
            gambar, deskripsi, status,
            (SELECT COUNT(*) FROM borrows WHERE id_buku=books.id_buku AND status='ongoing') as borrowed_count
     FROM books 
     ORDER BY created_at DESC`
  );

  return NextResponse.json({ books });
}

// POST - Tambah buku baru
export async function POST(request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const {
    nama_buku,
    author,
    publisher,
    genre_buku,
    tahun_terbit,
    gambar,
    deskripsi,
  } = data;

  if (!nama_buku || !author || !publisher || !genre_buku) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const result = await query(
    `INSERT INTO books (nama_buku, author, publisher, genre_buku, tahun_terbit, gambar, deskripsi, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'tersedia')`,
    [
      nama_buku,
      author,
      publisher,
      genre_buku,
      tahun_terbit || null,
      gambar || null,
      deskripsi || null,
    ]
  );

  return NextResponse.json({ success: true, id: result.insertId });
}

// PUT - Update buku
export async function PUT(request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const {
    id_buku,
    nama_buku,
    author,
    publisher,
    genre_buku,
    tahun_terbit,
    gambar,
    deskripsi,
  } = data;

  if (!id_buku) {
    return NextResponse.json({ error: "Missing id_buku" }, { status: 400 });
  }

  await query(
    `UPDATE books 
     SET nama_buku=?, author=?, publisher=?, genre_buku=?, tahun_terbit=?, gambar=?, deskripsi=?
     WHERE id_buku=?`,
    [
      nama_buku,
      author,
      publisher,
      genre_buku,
      tahun_terbit,
      gambar,
      deskripsi,
      id_buku,
    ]
  );

  return NextResponse.json({ success: true });
}

// DELETE - Hapus buku
export async function DELETE(request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id_buku = searchParams.get("id");

  if (!id_buku) {
    return NextResponse.json({ error: "Missing id_buku" }, { status: 400 });
  }

  // Cek apakah buku sedang dipinjam
  const [book] = await query(
    "SELECT COUNT(*) as count FROM borrows WHERE id_buku=? AND status='ongoing'",
    [id_buku]
  );

  if (book.count > 0) {
    return NextResponse.json(
      { error: "Tidak bisa menghapus buku yang sedang dipinjam" },
      { status: 409 }
    );
  }

  await query("DELETE FROM books WHERE id_buku=?", [id_buku]);

  return NextResponse.json({ success: true });
}
