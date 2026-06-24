import { NextRequest, NextResponse } from 'next/server';

const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest): NextResponse {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Protected routes (everything matched below that isn't an auth route):
  // redirect to /login when there's no token.
  if (!isAuthRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Auth routes: redirect to /dashboard when already authenticated.
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Add future protected sections here (e.g. '/inventory/:path*').
  matcher: ['/dashboard/:path*', '/protected/:path*', '/login', '/register'],
};
