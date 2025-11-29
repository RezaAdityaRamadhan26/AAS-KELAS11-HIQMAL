import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const sql = `
    SELECT id_buku, nama_buku, author, publisher, genre_buku as genre, tahun_terbit, gambar, deskripsi, status
    FROM books
    WHERE (? = '' OR nama_buku LIKE CONCAT('%', ?, '%'))
      AND (? = '' OR genre_buku = ?)
    ORDER BY created_at DESC
    LIMIT 100`;
  const rows = await query(sql, [q, q, genre, genre]);
  return NextResponse.json({ books: rows });
}
