import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({ children }) {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (session.user.role !== "admin") redirect("/siswa");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 ml-60">
                <header className="bg-white border-b px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Cari buku,siswa atau transaksi..."
                            className="w-96 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        />
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
