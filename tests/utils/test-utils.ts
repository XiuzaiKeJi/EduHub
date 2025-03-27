import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { Request, Response } from 'node-fetch'

/**
 * 测试基类
 */
export class TestBase {
  /**
   * 渲染组件
   */
  protected renderComponent(component: ReactElement) {
    return render(component)
  }

  /**
   * 创建测试数据
   */
  protected createTestData<T>(data: T): T {
    return data
  }

  /**
   * 清理测试数据
   */
  protected async cleanupTestData() {
    // 在需要时实现清理逻辑
  }
}

// 创建测试请求
export function createTestRequest(url: string, options: RequestInit = {}) {
  return new Request(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test_token',
      ...options.headers,
    },
  })
}

// 创建测试响应
export function createTestResponse(body: any, status: number = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// 验证响应
export async function validateResponse(response: Response, expectedStatus: number, expectedBody: any) {
  expect(response.status).toBe(expectedStatus)
  const body = await response.json()
  expect(body).toEqual(expectedBody)
}

// 重置所有模拟
export function resetMocks() {
  global.fetch = jest.fn()
} 