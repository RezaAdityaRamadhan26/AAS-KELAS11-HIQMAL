import { query } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, username } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nama dan email harus diisi" },
        { status: 400 }
      );
    }

    // If username provided, validate uniqueness (excluding current user)
    if (username) {
      const [existing] = await query(
        "SELECT user_id FROM users WHERE username = ? AND user_id <> ?",
        [username, session.user.id]
      );
      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: "Username sudah digunakan" },
          { status: 409 }
        );
      }
    }

    // Update user profile in database (name, email and optionally username)
    const fields = [name, email];
    let sql = "UPDATE users SET full_name = ?, email = ?";
    if (username) {
      sql += ", username = ?";
      fields.push(username);
    }
    sql += " WHERE user_id = ?";
    fields.push(session.user.id);

    const result = await query(sql, fields);

    console.log("Update result:", result);

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}
