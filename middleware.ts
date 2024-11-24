import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth condition for protected routes
  if (!session && req.nextUrl.pathname !== '/signin') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/signin';
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in and tries to access signin page, redirect to dashboard
  if (session && req.nextUrl.pathname === '/signin') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
