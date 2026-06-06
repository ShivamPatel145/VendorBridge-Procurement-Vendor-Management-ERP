import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/'];

const ROLE_ROUTES: Record<string, string[]> = {
  VENDOR: ['/vendor-portal'],
  ADMIN: ['/dashboard', '/vendors', '/rfqs', '/quotations', '/approvals', '/purchase-orders', '/invoices', '/reports', '/settings'],
  PROCUREMENT_OFFICER: ['/dashboard', '/vendors', '/rfqs', '/quotations', '/purchase-orders', '/invoices', '/reports'],
  MANAGER: ['/dashboard', '/quotations', '/approvals', '/purchase-orders', '/invoices'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Check for auth token in cookie
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Vendor can only access vendor-portal
  if (role === 'VENDOR' && !pathname.startsWith('/vendor-portal')) {
    return NextResponse.redirect(new URL('/vendor-portal/rfqs', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
