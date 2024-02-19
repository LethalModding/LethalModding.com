import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest): Promise<unknown> {
  console.log('middleware.ts', req.nextUrl.pathname)

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}
