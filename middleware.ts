// import { NextRequest, NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value

//   if (!token) {
//     return NextResponse.redirect(new URL('/auth/login', request.url))
//   }

//   try {
//     jwt.verify(token, process.env.JWT_SECRET!)
//     return NextResponse.next()
//   } catch (error) {
//     return NextResponse.redirect(new URL('/auth/login', request.url))
//   }
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/api/todos/:path*'],
// }


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard'],
}
