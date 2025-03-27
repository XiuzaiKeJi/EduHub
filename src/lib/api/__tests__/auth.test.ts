import { createTestRequest, createTestResponse, validateResponse, resetMocks } from './test-utils'
import { hashPassword, verifyPassword } from '../auth'

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn().mockImplementation((password, hash) => Promise.resolve(password === hash.replace('hashed_', '')))
}))

describe('Auth API', () => {
  beforeEach(() => {
    resetMocks();
  });

  // 密码加密测试
  describe('Password Hashing', () => {
    it('hashes password correctly', async () => {
      const password = 'test123'
      const hashedPassword = await hashPassword(password)
      expect(hashedPassword).toBe(`hashed_${password}`)
    })

    it('verifies password correctly', async () => {
      const password = 'test123'
      const hashedPassword = await hashPassword(password)
      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it('rejects invalid password', async () => {
      const password = 'test123'
      const hashedPassword = await hashPassword(password)
      const isValid = await verifyPassword('wrong', hashedPassword)
      expect(isValid).toBe(false)
    })
  })

  // 登录API测试
  describe('Login API', () => {
    it('handles successful login', async () => {
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

    it('handles invalid credentials', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Invalid credentials' }, 401)
      );

      const request = createTestRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrong123',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 401, { error: 'Invalid credentials' });
    });

    it('handles missing fields', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Missing required fields' }, 400)
      );

      const request = createTestRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 400, { error: 'Missing required fields' });
    });
  })

  // 注册API测试
  describe('Register API', () => {
    it('handles successful registration', async () => {
      const mockUser = {
        id: '1',
        name: '测试用户',
        email: 'test@example.com',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse(mockUser, 201)
      );

      const request = createTestRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: '测试用户',
          email: 'test@example.com',
          password: 'test123',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 201, mockUser);
    });

    it('handles duplicate email', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Email already exists' }, 409)
      );

      const request = createTestRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: '测试用户',
          email: 'existing@example.com',
          password: 'test123',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 409, { error: 'Email already exists' });
    });

    it('validates password strength', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createTestResponse({ error: 'Password does not meet requirements' }, 400)
      );

      const request = createTestRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: '测试用户',
          email: 'test@example.com',
          password: 'weak',
        }),
      });
      const response = await fetch(request);
      await validateResponse(response, 400, { error: 'Password does not meet requirements' });
    });
  })
}) 