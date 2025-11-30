"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        class: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registrasi gagal');
                setLoading(false);
                return;
            }

            alert('Registrasi berhasil! Silakan login.');
            router.push('/login');
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md px-6">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-[#211C84]">StarRead</h1>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg">
                    <h2 className="text-2xl font-bold text-center mb-2">
                        Register Siswa
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Masuk ke dasboard siswa
                    </p>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#211C84] outline-none text-black"
                                    placeholder="Enter Username"
                                    required
                                    minLength={3}
                                />
                            </div>
                        </div>

                        {/* Class */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Class</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.class}
                                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#211C84] outline-none text-black"
                                    placeholder="Enter Your Class"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#211C84] outline-none text-black"
                                    placeholder="Enter Your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-[#211C84] outline-none text-black"
                                    placeholder="Enter Password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-left">
                            <Link href="#" className="text-sm text-[#211C84] hover:underline">
                                Forgot Password ?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#211C84] text-white py-3 rounded-lg font-semibold hover:bg-[#1a1569] transition-colors disabled:bg-gray-400"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>

                        {/* Login Link */}
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="text-[#211C84] font-semibold hover:underline">
                                    Login Sekarang
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
