import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

// POST - Kembalikan buku
export async function POST(request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { borrow_id } = await request.json();

  if (!borrow_id) {
    return NextResponse.json({ error: "Missing borrow_id" }, { status: 400 });
  }

  // Ambil data peminjaman
  const [borrow] = await query(
    "SELECT id_buku, due_date FROM borrows WHERE borrow_id=?",
    [borrow_id]
  );

  if (!borrow) {
    return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
  }

  // Hitung denda jika terlambat
  const now = new Date();
  const dueDate = new Date(borrow.due_date);
  const lateDays = Math.max(
    0,
    Math.floor((now - dueDate) / (1000 * 60 * 60 * 24))
  );
  const fineAmount = lateDays * 1000; // Rp 1.000 per hari

  // Update status peminjaman
  const status = lateDays > 0 ? "late" : "returned";

  await query(
    `UPDATE borrows 
     SET return_date=NOW(), status=?, fine_amount=?
     WHERE borrow_id=?`,
    [status, fineAmount, borrow_id]
  );

  // Update status buku menjadi tersedia
  await query("UPDATE books SET status='tersedia' WHERE id_buku=?", [
    borrow.id_buku,
  ]);

  return NextResponse.json({
    success: true,
    fine_amount: fineAmount,
    late_days: lateDays,
  });
}
