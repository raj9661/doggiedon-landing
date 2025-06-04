import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect /admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check if we're in the browser (client-side)
    if (typeof window !== 'undefined') {
      const admin = localStorage.getItem('admin')
      if (!admin) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 