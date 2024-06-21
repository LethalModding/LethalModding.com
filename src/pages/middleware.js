import { NextResponse } from 'next/server'

// the list of all allowed origins
const allowedOrigins = [
  'http://localhost:9000',
  'http://wails.localhost:34115',
  'https://lethalmodding.com',
]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function middleware(req)
{
  // retrieve the current response
  const res = NextResponse.next()
  const origin = req.headers.get('origin')
  if (allowedOrigins.includes(origin))
  {
    res.headers.append('Access-Control-Allow-Origin', origin)
  }

  // add the CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', 'true')
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date'
  )

  return res
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: '/api/:path*',
}
