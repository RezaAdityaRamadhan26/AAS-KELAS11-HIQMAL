import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

// POST /api/register - Register siswa baru
export async function POST(request) {
  try {
    const {
      username,
      class: className,
      email,
      password,
    } = await request.json();

    // Validasi input
    if (!username || !className || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { message: "Username minimal 3 karakter" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cek apakah username sudah ada
    const [existingUsers] = await pool.query(
      "SELECT user_id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah ada
    const [existingEmails] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingEmails.length > 0) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const [result] = await pool.query(
      `INSERT INTO users (username, full_name, email, password, role, class, created_at) 
             VALUES (?, ?, ?, ?, 'siswa', ?, NOW())`,
      [username, username, email, hashedPassword, className]
    );

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        userId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
