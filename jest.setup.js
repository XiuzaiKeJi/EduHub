import '@testing-library/jest-dom'
import { loadEnvConfig } from '@next/env'

// 加载环境变量
loadEnvConfig(process.cwd())

// Mock fetch
global.fetch = jest.fn((url, options) => {
  const { method, headers, body } = options || {}
  
  if (url === '/api/auth/register' && method === 'POST') {
    const data = JSON.parse(body)
    
    // 模拟邮箱已存在的情况
    if (data.email === 'existing@example.com') {
      return Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ error: '该邮箱已被注册' })
      })
    }
    
    // 模拟输入验证失败的情况
    if (data.email === 'invalid-email' || data.password.length < 6 || data.name.length < 2) {
      return Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ error: '输入数据验证失败' })
      })
    }
    
    // 模拟成功注册
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({
        id: '1',
        ...data,
        password: undefined
      })
    })
  }
  
  return Promise.reject(new Error(`Unhandled request: ${url}`))
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
})) 