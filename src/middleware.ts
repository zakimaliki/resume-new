import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/api/auth/login' || path === '/api/auth/register'

  // Get the token from the Authorization header
  const token = request.headers.get('Authorization')?.split(' ')[1]

  // If it's a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If there's no token and it's not a public path, return unauthorized
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    )
    await jwtVerify(token, secret)

    // If verification is successful, allow the request
    return NextResponse.next()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If verification fails, return unauthorized
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/jobs/:path*',
    '/api/candidates/:path*',
    '/api/interviewers/:path*',
    '/api/auth/:path*',
  ],
} 