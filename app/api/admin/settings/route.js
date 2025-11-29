import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

// GET - Ambil pengaturan
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [settings] = await query("SELECT * FROM settings LIMIT 1");

  return NextResponse.json({ settings });
}

// PUT - Update pengaturan
export async function PUT(request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fine_per_day, max_borrow_days, max_books_per_user } =
    await request.json();

  await query(
    `UPDATE settings 
     SET fine_per_day=?, max_borrow_days=?, max_books_per_user=?
     WHERE id=1`,
    [fine_per_day, max_borrow_days, max_books_per_user]
  );

  return NextResponse.json({ success: true });
}
