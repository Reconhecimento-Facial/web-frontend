import { auth } from '@/auth'

export default auth((req) => {
  const nonProtectedRoutes = ['/login', '/account-recovery']

  if (!req.auth && !nonProtectedRoutes.includes(req.nextUrl.pathname)) {
    const newUrl = new URL('/login', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
