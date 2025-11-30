import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-indigo-800">StarRead</h1>
      <p className="mt-3 text-gray-600">
        Sistem Perpustakaan SMK Taruna Bhakti
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/login"
          className="rounded-full bg-indigo-700 text-white px-6 py-3"
        >
          Login
        </Link>
        <Link href="/register" className="rounded-full border px-6 py-3">
          Register
        </Link>
      </div>
    </div>
  );
}
