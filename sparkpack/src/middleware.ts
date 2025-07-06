import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        if (req.nextUrl.pathname.startsWith('/api/auth')) {
          return true;
        }

        // Protect API routes
        if (req.nextUrl.pathname.startsWith('/api')) {
          return !!token;
        }

        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/api/:path', '/admin/:path', '/dashboard/:path*'],
};