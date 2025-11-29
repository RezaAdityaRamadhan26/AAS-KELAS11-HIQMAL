import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Jika user belum login dan akses halaman protected
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/siswa")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jika user login sebagai siswa tapi akses admin
  if (token && pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/siswa", request.url));
  }

  // Jika user login sebagai admin tapi akses siswa
  if (token && pathname.startsWith("/siswa") && token.role !== "siswa") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/siswa/:path*"],
};
