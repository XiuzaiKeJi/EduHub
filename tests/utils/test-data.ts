/**
 * 测试数据管理
 */
export class TestData {
  /**
   * 创建测试用户
   */
  static createUser() {
    return {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
      role: 'STUDENT'
    }
  }

  /**
   * 创建测试请求
   */
  static createRequest(path: string, method = 'GET', body?: any) {
    return {
      url: new URL(path, 'http://localhost'),
      method,
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: body ? JSON.stringify(body) : undefined
    }
  }
} 