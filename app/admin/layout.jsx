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
                <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Cari buku, siswa atau transaksi..."
                            className="w-96 rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#211C84] focus:border-[#211C84]"
                        />
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        </div>
                    </div>
                </header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
