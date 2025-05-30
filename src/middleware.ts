import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://resume-app-psi.vercel.app',
  'https://resume-app-git-main-enoram.vercel.app'
]

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/api/auth/login' || path === '/api/auth/register'

  // Get the origin from the request headers
  const origin = request.headers.get('origin') || allowedOrigins[0]
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin)
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
      },
    })
  }

  // Get the token from either Authorization header or cookie
  const authHeader = request.headers.get('Authorization')
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  const tokenFromCookie = request.cookies.get('token')?.value
  const token = tokenFromHeader || tokenFromCookie

  // If it's a public path, allow the request with CORS headers
  if (isPublicPath) {
    const response = NextResponse.next()
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0])
    return response
  }

  // If there's no token and it's not a public path, return unauthorized
  if (!token) {
    const response = NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0])
    return response
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    )
    await jwtVerify(token, secret)

    // If verification is successful, allow the request with CORS headers
    const response = NextResponse.next()
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0])
    return response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If verification fails, return unauthorized with CORS headers
    const response = NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0])
    return response
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