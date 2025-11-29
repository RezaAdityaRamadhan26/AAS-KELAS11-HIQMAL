"use client";
import useSWR from "swr";
import { useState } from "react";
import BookCard from "@/app/components/BookCard";
import BorrowModal from "@/app/components/BorrowModal";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
    const [q, setQ] = useState("");
    const [genre, setGenre] = useState("");
    const [selected, setSelected] = useState(null);
    const { data, isLoading, mutate } = useSWR(`/api/books?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}`, fetcher);

    const onBorrow = (book) => setSelected(book);
    const confirmBorrow = async ({ id_buku, duration }) => {
        await fetch('/api/borrow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_buku, duration }) });
        setSelected(null);
        mutate();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-indigo-600 text-white p-8 mb-8">
                <h1 className="text-2xl">Selamat Datang!</h1>
                <p className="text-3xl font-semibold">StarRead</p>
            </div>
            <div className="flex flex-wrap gap-3 items-center mb-6">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari Buku..." className="rounded-md border px-4 py-2 w-64" />
                <select value={genre} onChange={(e) => setGenre(e.target.value)} className="rounded-md border px-3 py-2">
                    <option value="">Semua Kategori</option>
                    <option>Self-Improvement</option>
                    <option>Programming</option>
                    <option>Computer Science</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Fiction</option>
                    <option>Finance</option>
                    <option>Business</option>
                    <option>Psychology</option>
                    <option>Education</option>
                    <option>Technology</option>
                </select>
            </div>
            {isLoading && <div>Memuat...</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {data?.books?.map((b) => (
                    <BookCard key={b.id_buku} book={b} onBorrow={onBorrow} />
                ))}
            </div>
            <div className="flex justify-center pt-8">
                <button className="rounded-full border px-5 py-2">Lihat Semua Buku</button>
            </div>
            <BorrowModal book={selected} onClose={() => setSelected(null)} onConfirm={confirmBorrow} />
        </div>
    );
}
