import { authMiddleware } from '@descope/nextjs-sdk/server'

export default authMiddleware({
  redirectUrl: '/',
  privateRoutes: ['/dashboard', '/transfer', '/admin'],
})

export const config = {
  matcher: ['/dashboard', '/transfer', '/admin'],
}
