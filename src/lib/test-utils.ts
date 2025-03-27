import { render } from '@testing-library/react'
import { ReactNode } from 'react'

// 简化的测试渲染函数
export function renderWithProviders(ui: ReactNode) {
  return render(ui)
}

// 简化的测试数据生成
export function createTestData(type: 'user' | 'request') {
  switch (type) {
    case 'user':
      return {
        email: 'test@example.com',
        password: 'password123'
      }
    case 'request':
      return {
        url: 'http://localhost/test',
        headers: new Headers()
      }
    default:
      return {}
  }
} 