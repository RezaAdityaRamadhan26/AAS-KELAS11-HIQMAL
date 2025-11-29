"use client";
import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = z.object({
    username: z.string().min(3, "Minimal 3 karakter"),
    password: z.string().min(3, "Minimal 3 karakter"),
    role: z.enum(["siswa", "admin"]),
});

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState("siswa");
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        const parsed = schema.safeParse({ ...form, role });
        if (!parsed.success) {
            setError(parsed.error.issues[0].message);
            return;
        }
        const res = await signIn("credentials", { redirect: false, ...form, role });
        if (res?.error) { setError("Username/Password salah"); return; }
        router.replace(role === 'admin' ? '/admin' : '/siswa');
    }; return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border p-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-800">StarRead</h1>
                    <p className="mt-2 text-gray-600">Login {role === 'admin' ? 'Admin' : 'Siswa'}</p>
                </div>
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setRole('siswa')} className={`flex-1 rounded-md px-3 py-2 border ${role === 'siswa' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'}`}>Login Siswa</button>
                    <button onClick={() => setRole('admin')} className={`flex-1 rounded-md px-3 py-2 border ${role === 'admin' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'}`}>Login Admin</button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm">Username</label>
                        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Enter Username" />
                    </div>
                    <div>
                        <label className="text-sm">Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Enter Password" />
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <button className="w-full rounded-md bg-indigo-700 text-white py-2 text-lg">Login</button>
                </form>
            </div>
        </div>
    );
}
