import { createTestRequest, createTestResponse, validateResponse, resetMocks } from '../utils/test-utils';

describe('Auth API', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('POST /api/auth/login', () => {
    it('登录成功', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ token: 'test_token' }, 200)
      );

      const request = createTestRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 200, { token: 'test_token' });
    });

    it('登录失败 - 密码错误', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: '密码错误' }, 401)
      );

      const request = createTestRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrong123',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 401, { error: '密码错误' });
    });
  });

  describe('POST /api/auth/register', () => {
    it('注册成功', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ message: '注册成功' }, 201)
      );

      const request = createTestRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'new@example.com',
          password: 'test123',
          name: '测试用户',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 201, { message: '注册成功' });
    });

    it('注册失败 - 邮箱已存在', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: '邮箱已存在' }, 400)
      );

      const request = createTestRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'test123',
          name: '测试用户',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 400, { error: '邮箱已存在' });
    });
  });
}); 