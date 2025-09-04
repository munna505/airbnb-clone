import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token) {
        // Not authenticated - redirect to admin login
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      
      // Check if user has admin role
      if (token.role !== 'ADMIN') {
        // Not admin - redirect to regular login
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Regular protected routes
    const protectedRoutes = ['/orders', '/profile', '/payment'];
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!token) {
        // Not authenticated - redirect to login
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        const publicRoutes = [
          '/',
          '/login',
          '/register',
          '/contact',
          '/services',
          '/book',
          '/confirmation',
          '/admin/login',
          '/api/auth',
          '/api/contact',
          '/api/pricing',
          '/api/payment',
          '/api/payment/confirm',
          '/api/bookings',
          '/api/notify',
          '/api/test',
          '/api/test-confirm',
          '/flappy-bird',
          '/test-console'
        ];

        // Allow access to public routes
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // For all other routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
