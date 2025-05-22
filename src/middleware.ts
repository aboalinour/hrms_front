import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization');

  const isAuth =
    token ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/forgot-password' ||
    request.nextUrl.pathname === '/reset-password';

  if (!isAuth && request.nextUrl.pathname.startsWith('/employee')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!isAuth && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!isAuth && request.nextUrl.pathname.startsWith('/hr')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!isAuth && request.nextUrl.pathname.startsWith('/manager')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// ✅ تفعيل الميدل وير لهذه المسارات فقط
export const config = {
  matcher: [
    '/employee/:path*',
    '/admin/:path*',
    '/hr/:path*',
    '/manager/:path*',
  ],
};
