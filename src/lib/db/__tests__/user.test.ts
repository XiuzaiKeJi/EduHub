import { prisma } from '../index'
import { UserRole } from '../../../types'

describe('User Model', () => {
  const testUser = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
    role: UserRole.STUDENT
  }

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a new user', async () => {
    const user = await prisma.user.create({
      data: testUser
    })

    expect(user).toBeDefined()
    expect(user.email).toBe(testUser.email)
    expect(user.name).toBe(testUser.name)
    expect(user.role).toBe(testUser.role)
    expect(user.password).toBe(testUser.password)
    expect(user.createdAt).toBeDefined()
    expect(user.updatedAt).toBeDefined()
  })

  it('should not create user with duplicate email', async () => {
    await prisma.user.create({
      data: testUser
    })

    await expect(
      prisma.user.create({
        data: testUser
      })
    ).rejects.toThrow()
  })

  it('should update user', async () => {
    const user = await prisma.user.create({
      data: testUser
    })

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: 'Updated Name' }
    })

    expect(updatedUser.name).toBe('Updated Name')
    expect(updatedUser.updatedAt).not.toBe(user.updatedAt)
  })

  it('should delete user', async () => {
    const user = await prisma.user.create({
      data: testUser
    })

    await prisma.user.delete({
      where: { id: user.id }
    })

    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    expect(deletedUser).toBeNull()
  })
}) 