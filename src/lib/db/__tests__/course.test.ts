import { PrismaClient } from '@prisma/client'
import { describe, expect, test, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals'

let prisma: PrismaClient

beforeAll(async () => {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:./test.db'
      }
    }
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Course API', () => {
  beforeEach(async () => {
    // 创建基础测试数据
    const category = await prisma.courseCategory.create({
      data: {
        name: '测试分类',
        description: '测试分类描述'
      }
    })

    const teacher = await prisma.user.create({
      data: {
        name: '测试教师',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'TEACHER'
      }
    })

    // 创建测试课程
    await prisma.course.create({
      data: {
        name: '测试课程',
        description: '测试课程描述',
        code: 'TEST001',
        categoryId: category.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        teacherId: teacher.id,
        maxStudents: 50,
        currentStudents: 0
      }
    })
  })

  afterEach(async () => {
    // 清理测试数据
    await prisma.courseResource.deleteMany()
    await prisma.courseSchedule.deleteMany()
    await prisma.course.deleteMany()
    await prisma.courseCategory.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('课程管理接口', () => {
    test('创建课程', async () => {
      const category = await prisma.courseCategory.findFirst()
      const teacher = await prisma.user.findFirst()

      const course = await prisma.course.create({
        data: {
          name: '新课程',
          description: '新课程描述',
          code: 'TEST002',
          categoryId: category!.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          teacherId: teacher!.id,
          maxStudents: 50,
          currentStudents: 0
        }
      })

      expect(course).toBeDefined()
      expect(course.name).toBe('新课程')
      expect(course.code).toBe('TEST002')
    })

    test('更新课程', async () => {
      const course = await prisma.course.findFirst()
      
      const updatedCourse = await prisma.course.update({
        where: { id: course!.id },
        data: {
          name: '更新后的课程',
          currentStudents: 1
        }
      })

      expect(updatedCourse.name).toBe('更新后的课程')
      expect(updatedCourse.currentStudents).toBe(1)
    })

    test('删除课程', async () => {
      const course = await prisma.course.findFirst()
      
      await prisma.course.delete({
        where: { id: course!.id }
      })

      const deletedCourse = await prisma.course.findUnique({
        where: { id: course!.id }
      })

      expect(deletedCourse).toBeNull()
    })
  })

  describe('课程分类接口', () => {
    test('创建子分类', async () => {
      const parentCategory = await prisma.courseCategory.findFirst()
      
      const subCategory = await prisma.courseCategory.create({
        data: {
          name: '子分类',
          description: '子分类描述',
          parentId: parentCategory!.id
        }
      })

      expect(subCategory.parentId).toBe(parentCategory!.id)
    })

    test('获取分类及其子分类', async () => {
      const parentCategory = await prisma.courseCategory.findFirst()
      
      const categoryWithChildren = await prisma.courseCategory.findUnique({
        where: { id: parentCategory!.id },
        include: { children: true }
      })

      expect(categoryWithChildren).toBeDefined()
      expect(categoryWithChildren!.children).toBeDefined()
    })
  })

  describe('课程时间表接口', () => {
    test('创建课程时间表', async () => {
      const course = await prisma.course.findFirst()
      const teacher = await prisma.user.findFirst()

      const schedule = await prisma.courseSchedule.create({
        data: {
          courseId: course!.id,
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:30',
          location: '教学楼A',
          room: '101',
          teacherId: teacher!.id
        }
      })

      expect(schedule.courseId).toBe(course!.id)
      expect(schedule.teacherId).toBe(teacher!.id)
    })
  })

  describe('课程资源接口', () => {
    test('创建课程资源', async () => {
      const course = await prisma.course.findFirst()

      const resource = await prisma.courseResource.create({
        data: {
          courseId: course!.id,
          title: '测试资源',
          type: '文档',
          url: 'https://example.com/resource'
        }
      })

      expect(resource.courseId).toBe(course!.id)
      expect(resource.type).toBe('文档')
    })
  })
}) 