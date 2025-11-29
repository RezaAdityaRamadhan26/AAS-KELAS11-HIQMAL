# StarRead - Sistem Perpustakaan Digital

Aplikasi perpustakaan digital untuk SMK Taruna Bhakti, dibangun dengan Next.js 16 dan MySQL.

## 📚 Fitur

### Untuk Siswa
- ✅ Login dengan username dan password
- ✅ Melihat daftar buku tersedia
- ✅ Pencarian buku
- ✅ Peminjaman buku
- ✅ Melihat riwayat peminjaman
- ✅ Profil pengguna

### Untuk Admin
- ✅ Dashboard dengan statistik
- ✅ Manajemen buku (tambah, edit, hapus)
- ✅ Melihat daftar keterlambatan
- ✅ Pengaturan sistem

## 🛠️ Teknologi

- **Next.js 16** - Framework React untuk web app
- **React 19** - Library untuk membuat UI
- **MySQL** - Database untuk menyimpan data
- **NextAuth.js** - Authentication (login/logout)
- **Tailwind CSS** - Styling
- **Bcrypt** - Enkripsi password

## 📁 Struktur Folder

```
libraryweb/
├── app/
│   ├── api/              # API endpoints
│   │   ├── auth/         # Login/logout
│   │   ├── books/        # Data buku
│   │   ├── borrow/       # Pinjam buku
│   │   └── siswa/        # API khusus siswa
│   ├── siswa/            # Halaman siswa
│   │   ├── page.jsx      # Dashboard siswa
│   │   ├── koleksi-buku/ # Semua koleksi buku
│   │   ├── riwayat/      # Riwayat peminjaman
│   │   └── profil/       # Profil siswa
│   ├── admin/            # Halaman admin
│   │   ├── page.jsx      # Dashboard admin
│   │   ├── manajemen-buku/  # Kelola buku
│   │   ├── keterlambatan/   # Daftar terlambat
│   │   └── pengaturan/      # Pengaturan
│   ├── login/            # Halaman login
│   ├── layout.js         # Layout utama
│   └── page.js           # Halaman home
├── lib/
│   ├── db.js             # Koneksi database
│   └── auth.js           # Konfigurasi NextAuth
├── middleware.js         # Proteksi route
├── .env.local            # Environment variables
└── package.json          # Dependencies

```

## 🚀 Cara Install

### 1. Clone atau Download Project
```bash
git clone <url-repository>
cd libraryweb
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
Buat database MySQL dan jalankan SQL berikut:

```sql
CREATE DATABASE db_perpus;
USE db_perpus;

-- Tabel Users
CREATE TABLE users (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('siswa', 'admin') DEFAULT 'siswa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Books
CREATE TABLE books (
  id_buku INT PRIMARY KEY AUTO_INCREMENT,
  nama_buku VARCHAR(200) NOT NULL,
  author VARCHAR(100),
  publisher VARCHAR(100),
  genre VARCHAR(50),
  status ENUM('tersedia', 'dipinjam') DEFAULT 'tersedia',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Borrows
CREATE TABLE borrows (
  id_borrow INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT,
  id_buku INT,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE,
  status ENUM('ongoing', 'returned', 'late') DEFAULT 'ongoing',
  fine_amount DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (id_user) REFERENCES users(id_user),
  FOREIGN KEY (id_buku) REFERENCES books(id_buku)
);

-- Tabel Settings
CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value VARCHAR(255)
);

-- Insert data contoh
INSERT INTO users (username, password, name, role) VALUES
('hiqmal', '$2b$10$example', 'Muhamad Hiqmal Saputra', 'siswa'),
('admin', '$2b$10$example', 'Admin Perpustakaan', 'admin');

INSERT INTO settings (setting_key, setting_value) VALUES
('fine_per_day', '1000'),
('max_borrow_days', '14');
```

### 4. Setup Environment Variables
Buat file `.env.local` di root folder:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_perpus

# NextAuth
NEXTAUTH_SECRET=ganti-dengan-string-random-anda
NEXTAUTH_URL=http://localhost:3000
```

**PENTING:** Ganti `NEXTAUTH_SECRET` dengan string random. Bisa buka https://generate-secret.vercel.app/32

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka browser ke: http://localhost:3000

## 👤 Login Default

### Siswa
- Username: `hiqmal`
- Password: `123456`

### Admin
- Username: `admin`
- Password: `admin123`

**Note:** Password akan otomatis di-hash saat pertama login

## 📖 Penjelasan Kode (untuk Belajar)

### 1. useState
Digunakan untuk menyimpan data yang bisa berubah:
```javascript
const [books, setBooks] = useState([]);  // Variabel books, fungsi setBooks
```

### 2. useEffect
Digunakan untuk menjalankan kode saat halaman dibuka:
```javascript
useEffect(() => {
  fetch("/api/books")  // Ambil data dari API
    .then(res => res.json())
    .then(data => setBooks(data.books));
}, []);  // [] artinya cuma jalan sekali
```

### 3. fetch API
Cara mengambil atau mengirim data ke server:
```javascript
// GET (ambil data)
fetch("/api/books")

// POST (kirim data)
fetch("/api/borrow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id_buku: 1, duration: 7 })
})
```

### 4. .map()
Untuk looping dan menampilkan data:
```javascript
books.map((book) => (
  <div key={book.id_buku}>
    <h3>{book.nama_buku}</h3>
  </div>
))
```

### 5. .filter()
Untuk menyaring data:
```javascript
const hasil = books.filter((book) => {
  return book.nama_buku.includes(search);
});
```

## 🎨 Tailwind CSS Classes

Beberapa class yang sering dipakai:

- `p-6` = padding 24px
- `mb-6` = margin bottom 24px
- `flex` = display flex
- `grid` = display grid
- `rounded-lg` = border radius besar
- `bg-indigo-600` = background warna indigo
- `text-white` = teks warna putih
- `hover:bg-indigo-700` = warna saat mouse hover

## 📝 Cara Menambah Fitur

### Contoh: Tambah Halaman Baru di Siswa

1. Buat file `app/siswa/nama-halaman/page.jsx`
2. Tulis kode:
```javascript
"use client";

export default function NamaHalamanPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Judul Halaman</h1>
      {/* Isi halaman di sini */}
    </div>
  );
}
```
3. Tambahkan link di navbar (`app/siswa/layout.jsx`)

### Contoh: Tambah API Baru

1. Buat file `app/api/nama-api/route.js`
2. Tulis kode:
```javascript
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await query("SELECT * FROM nama_tabel");
  return NextResponse.json({ data: rows });
}
```

## ❓ Troubleshooting

### Error: Cannot connect to MySQL
- Pastikan MySQL sudah running
- Cek username dan password di `.env.local`
- Cek nama database sudah benar

### Error: Module not found
```bash
npm install
```

### Halaman tidak update
- Refresh browser (Ctrl + F5)
- Restart dev server (Ctrl + C, lalu `npm run dev` lagi)

### Lupa password login
- Hapus user dari database
- Insert ulang dengan password plain text
- Login sekali (akan otomatis di-hash)

## 📚 Belajar Lebih Lanjut

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MySQL Tutorial](https://www.mysqltutorial.org)

## 📞 Kontak

Jika ada pertanyaan:
- Email: muhamadhiqmalsaputra@gmail.com
- Sekolah: SMK Taruna Bhakti

---

**Dibuat dengan ❤️ untuk pembelajaran siswa SMK**
