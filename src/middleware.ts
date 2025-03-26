import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { UserRole } from './types'

// 定义角色权限路由映射
const roleRoutes: Record<UserRole, string[]> = {
  STUDENT: [
    '/dashboard',
    '/courses',
    '/tasks',
  ],
  TEACHER: [
    '/dashboard',
    '/courses',
    '/tasks',
    '/teams',
  ],
  ADMIN: [
    '/dashboard',
    '/courses',
    '/tasks',
    '/teams',
    '/admin',
  ],
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 检查用户角色权限
    if (token?.role) {
      const userRole = token.role as UserRole
      const allowedRoutes = roleRoutes[userRole] || []

      // 如果用户没有权限访问该路由，重定向到登录页面
      if (!allowedRoutes.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },
  }
)

// 配置需要进行认证检查的路由
export const config = {
  matcher: [
    /*
     * 匹配所有需要认证的路由:
     * - `/dashboard` 和其子路由
     * - `/courses` 和其子路由
     * - `/tasks` 和其子路由
     * - `/teams` 和其子路由
     * - `/admin` 和其子路由
     */
    '/dashboard/:path*',
    '/courses/:path*',
    '/tasks/:path*',
    '/teams/:path*',
    '/admin/:path*',
  ],
} 