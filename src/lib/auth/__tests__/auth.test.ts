import { hashPassword, verifyPassword } from '../index'
import { UserRole } from '../../../types'

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'test123'
      const hashedPassword = await hashPassword(password)
      
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/)
    })
  })

  describe('verifyPassword', () => {
    it('should verify password correctly', async () => {
      const password = 'test123'
      const hashedPassword = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
      
      const isInvalid = await verifyPassword('wrongpassword', hashedPassword)
      expect(isInvalid).toBe(false)
    })
  })
})

describe('Auth API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
    role: 'STUDENT' as UserRole
  }

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      })

      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id')
      expect(data.email).toBe(testUser.email)
      expect(data.name).toBe(testUser.name)
      expect(data.role).toBe(testUser.role)
    })

    it('should not register user with existing email', async () => {
      const existingUser = {
        ...testUser,
        email: 'existing@example.com'
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(existingUser)
      })

      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.error).toBe('该邮箱已被注册')
    })

    it('should validate input data', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: '123', // too short
        name: 'T', // too short
        role: 'INVALID_ROLE'
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidUser)
      })

      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })
  })
}) 