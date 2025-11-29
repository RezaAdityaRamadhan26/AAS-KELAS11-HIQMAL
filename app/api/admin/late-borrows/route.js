import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const borrows = await query(
    `SELECT b.borrow_id, u.full_name as nama_siswa, u.username, bk.nama_buku as judul_buku,
            b.borrow_date as tgl_pinjam, b.due_date as tgl_jatuh_tempo, b.return_date as tgl_kembali,
            b.fine_amount, b.status
     FROM borrows b
     JOIN users u ON b.user_id = u.user_id
     JOIN books bk ON b.id_buku = bk.id_buku
     WHERE b.status IN ('late', 'ongoing', 'returned') AND (b.return_date > b.due_date OR NOW() > b.due_date OR b.status = 'ongoing')
     ORDER BY b.due_date ASC`
  );

  return NextResponse.json({ borrows });
}
