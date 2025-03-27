import { NextRequest } from 'next/server'
import { middleware } from './middleware'
import { createTestData } from '@/lib/test-utils'

// 简化的NextResponse mock
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn().mockImplementation((url) => ({
      status: 302,
      headers: new Headers({ location: url })
    })),
    next: jest.fn().mockImplementation(() => ({
      status: 200,
      headers: new Headers()
    }))
  }
}))

describe('Middleware', () => {
  // 单元测试：测试未认证访问
  it('redirects unauthenticated access', async () => {
    const { url, headers } = createTestData('request')
    const request = new NextRequest(new URL(url), {
      method: 'GET',
      headers
    })
    
    const response = await middleware(request)
    expect(response.status).toBe(302)
  })

  // 集成测试：测试认证访问
  it('allows authenticated access', async () => {
    const { url, headers } = createTestData('request')
    headers.set('Authorization', 'Bearer mock-token')
    
    const request = new NextRequest(new URL(url), {
      method: 'GET',
      headers
    })
    
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })
}) 