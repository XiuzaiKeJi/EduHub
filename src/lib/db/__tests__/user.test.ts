import { PrismaClient, UserRole } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockDeep<PrismaClient>()),
  UserRole: {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN'
  }
}))

const prismaMock = mockDeep<PrismaClient>()

describe('User Database Operations', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  it('creates a new user', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: '测试用户',
      password: 'hashedPassword',
      role: UserRole.STUDENT,
    }

    prismaMock.user.create.mockResolvedValue(mockUser)

    const user = await prismaMock.user.create({
      data: {
        email: 'test@example.com',
        name: '测试用户',
        password: 'hashedPassword',
        role: UserRole.STUDENT,
      },
    })

    expect(user).toEqual(mockUser)
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        name: '测试用户',
        password: 'hashedPassword',
        role: UserRole.STUDENT,
      },
    })
  })

  it('finds user by email', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: '测试用户',
      password: 'hashedPassword',
      role: UserRole.STUDENT,
    }

    prismaMock.user.findUnique.mockResolvedValue(mockUser)

    const user = await prismaMock.user.findUnique({
      where: { email: 'test@example.com' },
    })

    expect(user).toEqual(mockUser)
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    })
  })

  it('updates user information', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: '更新后的用户',
      password: 'hashedPassword',
      role: UserRole.TEACHER,
    }

    prismaMock.user.update.mockResolvedValue(mockUser)

    const updatedUser = await prismaMock.user.update({
      where: { id: '1' },
      data: {
        name: '更新后的用户',
        role: UserRole.TEACHER,
      },
    })

    expect(updatedUser).toEqual(mockUser)
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        name: '更新后的用户',
        role: UserRole.TEACHER,
      },
    })
  })

  it('deletes user', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: '测试用户',
      password: 'hashedPassword',
      role: UserRole.STUDENT,
    }

    prismaMock.user.delete.mockResolvedValue(mockUser)
    prismaMock.user.findUnique.mockResolvedValue(null)

    await prismaMock.user.delete({
      where: { id: '1' },
    })

    const deletedUser = await prismaMock.user.findUnique({
      where: { id: '1' },
    })

    expect(deletedUser).toBeNull()
    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    })
  })
}) 