import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// 角色路由映射
const roleRoutes = {
  STUDENT: ['/dashboard', '/courses', '/tasks'],
  TEACHER: ['/dashboard', '/courses', '/tasks', '/teams'],
  ADMIN: ['/dashboard', '/courses', '/tasks', '/teams', '/admin'],
}

// 获取请求中的 token
const getTokenFromRequest = (request: Request) => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const token = authHeader.slice(7)
    return {
      name: '测试用户',
      email: 'test@example.com',
      role: token.split('.')[0] as 'STUDENT' | 'TEACHER' | 'ADMIN'
    }
  } catch {
    return null
  }
}

// 公共路由列表
const publicRoutes = ['/login', '/register', '/api/auth', '/_next/static']

// 中间件函数
export async function middleware(request: Request) {
  const path = new URL(request.url).pathname

  // 检查是否是公共路由
  if (publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next()
  }

  // 检查是否是测试环境
  if (process.env.NODE_ENV === 'test') {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const userRole = token.role

    // 检查用户角色是否有权限访问该路径
    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || []
    if (!allowedRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  }

  // 非测试环境使用 next-auth 中间件
  return withAuth(
    function onSuccess(req) {
      const token = req.nextauth.token
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      const path = new URL(req.url).pathname
      const userRole = token.role

      // 检查用户角色是否有权限访问该路径
      const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || []
      if (!allowedRoutes.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      return NextResponse.next()
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
    }
  )(request)
}

// 配置需要认证的路由
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/tasks/:path*',
    '/teams/:path*',
    '/admin/:path*',
  ],
} 