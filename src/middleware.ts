import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const { pathname } = nextUrl;

    // Paths that require authentication
    const protectedPaths = ['/dashboard', '/challenges', '/scoreboard', '/profile', '/admin'];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    // Paths that are for guests only (login, register)
    const guestPaths = ['/login', '/register'];
    const isGuest = guestPaths.some((path) => pathname.startsWith(path));

    if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    if (isGuest && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    // Admin route protection
    // @ts-ignore
    if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
