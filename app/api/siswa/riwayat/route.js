import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const borrows = await query(
    `SELECT b.borrow_id, bk.nama_buku, b.borrow_date, b.due_date, b.return_date, b.status, b.fine_amount
     FROM borrows b
     JOIN books bk ON b.id_buku = bk.id_buku
     WHERE b.user_id = ?
     ORDER BY b.borrow_date DESC`,
    [session.user.id]
  );

  return NextResponse.json({ borrows });
}
