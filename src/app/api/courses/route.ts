import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 创建课程请求体验证
const createCourseSchema = z.object({
  name: z.string().min(1, '课程名称不能为空'),
  description: z.string().optional(),
  code: z.string().min(1, '课程代码不能为空'),
  categoryId: z.string().min(1, '课程分类不能为空'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '无效的开始日期',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '无效的结束日期',
  }),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']).default('PLANNED'),
  maxStudents: z.number().int().min(0).optional(),
  teacherId: z.string().min(1, '教师ID不能为空'),
})

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  pageSize: z.string().optional().transform(val => val ? parseInt(val) : 10),
  search: z.string().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  categoryId: z.string().optional(),
  teacherId: z.string().optional(),
  sortBy: z.enum(['name', 'startDate', 'endDate', 'currentStudents']).optional().default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// GET /api/courses
export async function GET(request: NextRequest) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    // 解析查询参数
    const { searchParams } = request.nextUrl
    const result = querySchema.safeParse(Object.fromEntries(searchParams.entries()))
    
    if (!result.success) {
      return NextResponse.json(
        { error: '查询参数无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const { 
      page, 
      pageSize, 
      search, 
      status, 
      categoryId, 
      teacherId, 
      sortBy, 
      sortOrder 
    } = result.data

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { code: { contains: search } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (teacherId) {
      where.teacherId = teacherId
    }

    // 计算总数
    const total = await prisma.course.count({ where })
    
    // 查询课程
    const courses = await prisma.course.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    // 格式化日期
    const formattedCourses = courses.map(course => ({
      ...course,
      startDate: course.startDate.toISOString(),
      endDate: course.endDate.toISOString(),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      courses: formattedCourses,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取课程列表失败:', error)
    return NextResponse.json(
      { error: '获取课程列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/courses
export async function POST(request: NextRequest) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    // 验证用户权限（只有教师和管理员可以创建课程）
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = createCourseSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const {
      name,
      description,
      code,
      categoryId,
      startDate,
      endDate,
      status,
      maxStudents,
      teacherId,
    } = result.data

    // 检查课程代码是否已存在
    const existingCourse = await prisma.course.findUnique({
      where: { code },
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: '课程代码已存在' },
        { status: 409 }
      )
    }

    // 检查分类是否存在
    const category = await prisma.courseCategory.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: '课程分类不存在' },
        { status: 400 }
      )
    }

    // 检查教师是否存在
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
    })

    if (!teacher || teacher.role !== 'TEACHER') {
      return NextResponse.json(
        { error: '指定的教师不存在或不是教师角色' },
        { status: 400 }
      )
    }

    // 创建课程
    const course = await prisma.course.create({
      data: {
        name,
        description,
        code,
        categoryId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        maxStudents,
        teacherId,
        currentStudents: 0,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // 格式化日期
    const formattedCourse = {
      ...course,
      startDate: course.startDate.toISOString(),
      endDate: course.endDate.toISOString(),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedCourse, { status: 201 })
  } catch (error) {
    console.error('创建课程失败:', error)
    return NextResponse.json(
      { error: '创建课程失败' },
      { status: 500 }
    )
  }
} 