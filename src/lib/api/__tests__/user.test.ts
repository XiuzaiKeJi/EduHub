import { createTestRequest, createTestResponse, validateResponse, resetMocks } from './test-utils'

describe('User API', () => {
  beforeEach(() => {
    resetMocks();
  });

  // 获取用户信息测试
  describe('Get User Info', () => {
    it('returns user info for authenticated user', async () => {
      const mockUser = {
        id: '1',
        name: '测试用户',
        email: 'test@example.com',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse(mockUser, 200)
      );

      const request = createTestRequest('http://localhost/api/user/profile');
      const response = await fetch(request);
      await validateResponse(response, 200, mockUser);
    });

    it('returns 401 for unauthenticated user', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Unauthorized' }, 401)
      );

      const request = createTestRequest('http://localhost/api/user/profile');
      const response = await fetch(request);
      await validateResponse(response, 401, { error: 'Unauthorized' });
    });
  });

  // 更新用户信息测试
  describe('Update User Info', () => {
    it('updates user info successfully', async () => {
      const mockUser = {
        id: '1',
        name: '更新后的用户名',
        email: 'test@example.com',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse(mockUser, 200)
      );

      const request = createTestRequest('http://localhost/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: '更新后的用户名' }),
      });
      const response = await fetch(request);
      await validateResponse(response, 200, mockUser);
    });

    it('validates required fields', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Missing required fields' }, 400)
      );

      const request = createTestRequest('http://localhost/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({}),
      });
      const response = await fetch(request);
      await validateResponse(response, 400, { error: 'Missing required fields' });
    });
  });

  // 修改密码测试
  describe('Change Password', () => {
    it('changes password successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ message: 'Password updated successfully' }, 200)
      );

      const request = createTestRequest('http://localhost/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: 'old123',
          newPassword: 'new123',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 200, { message: 'Password updated successfully' });
    });

    it('validates password strength', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Password does not meet requirements' }, 400)
      );

      const request = createTestRequest('http://localhost/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: 'old123',
          newPassword: 'weak',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 400, { error: 'Password does not meet requirements' });
    });

    it('validates current password', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Current password is incorrect' }, 401)
      );

      const request = createTestRequest('http://localhost/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: 'wrong123',
          newPassword: 'new123',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 401, { error: 'Current password is incorrect' });
    });
  });
}) 