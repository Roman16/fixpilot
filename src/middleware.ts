import { NextRequest, NextResponse } from 'next/server';

const AUTH_PAGES = ['/login', '/registration'];
const PUBLIC_PAGES = ['/'];
const APP_PAGES = ['/orders'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get('token')?.value;

    const isAuthPage = AUTH_PAGES.some((path) => pathname.startsWith(path));
    const isPublicPage = PUBLIC_PAGES.includes(pathname);
    const isAppPage = APP_PAGES.some((path) => pathname.startsWith(path));

    if (token && (isAuthPage || isPublicPage)) {
        return NextResponse.redirect(new URL('/orders', request.url));
    }

    if (!token && isAppPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login/:path*',
        '/registration/:path*',
        '/orders/:path*',
    ],
};
