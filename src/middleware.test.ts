import { NextRequest, NextResponse } from 'next/server'
import { middleware } from './middleware'
import { encode } from 'next-auth/jwt'

// Mock NextResponse
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server')
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      redirect: jest.fn().mockImplementation((url) => {
        const headers = new Headers()
        headers.set('location', url.pathname)
        return {
          status: 302,
          headers
        }
      }),
      next: jest.fn().mockImplementation(() => {
        const headers = new Headers()
        return {
          status: 200,
          headers
        }
      })
    }
  }
})

// Mock next-auth/jwt
jest.mock('next-auth/jwt', () => ({
  encode: jest.fn(),
  decode: jest.fn(),
  getToken: jest.fn()
}))

type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

// 模拟 NextAuth 的 token
const mockToken = async (role: UserRole) => {
  const token = {
    name: '测试用户',
    email: 'test@example.com',
    role,
  }
  return `${role}.${JSON.stringify(token)}`
}

// 创建模拟请求
const createMockRequest = async (path: string, role?: UserRole) => {
  const headers = new Headers()
  if (role) {
    const token = await mockToken(role)
    headers.set('Authorization', `Bearer ${token}`)
  }
  return new NextRequest(new URL(path, 'http://localhost'), {
    headers,
  })
}

describe('Middleware', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test'
    process.env.NEXTAUTH_SECRET = 'test-secret'
  })

  afterAll(() => {
    process.env.NODE_ENV = 'development'
    delete process.env.NEXTAUTH_SECRET
  })

  it('redirects to login page when not authenticated', async () => {
    const request = await createMockRequest('/dashboard')
    const response = await middleware(request)
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/login')
  })

  it('allows access to public routes', async () => {
    const request = await createMockRequest('/login')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })

  it('allows student access to student routes', async () => {
    const request = await createMockRequest('/dashboard', 'STUDENT')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })

  it('allows teacher access to teacher routes', async () => {
    const request = await createMockRequest('/teams', 'TEACHER')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })

  it('allows admin access to admin routes', async () => {
    const request = await createMockRequest('/admin', 'ADMIN')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })

  it('redirects to login page when accessing unauthorized routes', async () => {
    const request = await createMockRequest('/admin', 'STUDENT')
    const response = await middleware(request)
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/login')
  })

  it('handles API routes correctly', async () => {
    const request = await createMockRequest('/api/auth/session')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })

  it('handles static files correctly', async () => {
    const request = await createMockRequest('/_next/static/test.js')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })
}) 