import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id_buku, duration = 7 } = await request.json();
  if (!id_buku)
    return NextResponse.json({ error: "Missing id_buku" }, { status: 400 });

  // Compute due_date
  const [due] = await query(
    "SELECT DATE_ADD(NOW(), INTERVAL ? DAY) AS due_date",
    [duration]
  );
  const due_date = due.due_date;

  // Create borrow and update book status if available
  const [book] = await query("SELECT status FROM books WHERE id_buku=?", [
    id_buku,
  ]);
  if (!book)
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  if (book.status === "dipinjam")
    return NextResponse.json(
      { error: "Book already borrowed" },
      { status: 409 }
    );

  await query(
    "INSERT INTO borrows (user_id, id_buku, borrow_duration, due_date) VALUES (?,?,?,?)",
    [Number(session.user.id), id_buku, duration, due_date]
  );
  await query("UPDATE books SET status='dipinjam' WHERE id_buku=?", [id_buku]);

  return NextResponse.json({ ok: true });
}
