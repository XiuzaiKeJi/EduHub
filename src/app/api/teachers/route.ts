import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// 定义教师查询参数验证模式
const teacherQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  pageSize: z.string().optional().transform(Number).default('9'),
  sortBy: z.enum(['name', 'title', 'department', 'createdAt', 'updatedAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  title: z.string().optional(),
  specialties: z.string().optional(),
})

// 定义教师创建验证模式
const teacherCreateSchema = z.object({
  userId: z.string().min(1, '用户ID不能为空'),
  title: z.string().optional(),
  bio: z.string().optional(),
  department: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  specialties: z.string().optional(),
  subjects: z.string().optional(),
  achievements: z.string().optional(),
  contactInfo: z.string().optional(),
  officeHours: z.string().optional(),
  officeLocation: z.string().optional(),
})

// GET 方法：获取教师列表
export async function GET(request: NextRequest) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 解析查询参数
    const { searchParams } = new URL(request.url)
    const validatedParams = teacherQuerySchema.parse(Object.fromEntries(searchParams))
    
    const { 
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      title,
      specialties
    } = validatedParams
    
    // 构建过滤条件
    const where: any = {}
    
    // 处理搜索查询
    if (search) {
      where.OR = [
        { 
          user: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          specialties: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          subjects: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }
    
    // 处理职称筛选
    if (title) {
      where.title = {
        equals: title,
        mode: 'insensitive'
      }
    }
    
    // 处理专业领域筛选
    if (specialties) {
      where.specialties = {
        contains: specialties,
        mode: 'insensitive'
      }
    }
    
    // 处理排序
    const orderBy: any = {}
    
    // 特殊处理按姓名排序的情况（因为姓名在关联表中）
    if (sortBy === 'name') {
      orderBy.user = { name: sortOrder }
    } else {
      orderBy[sortBy] = sortOrder
    }
    
    // 查询总数
    const total = await prisma.teacher.count({ where })
    
    // 分页查询教师列表
    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            department: true,
          }
        },
        qualifications: true,
        evaluations: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    
    return NextResponse.json({
      teachers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch (error) {
    console.error('获取教师列表失败:', error)
    return NextResponse.json(
      { error: '获取教师列表失败' },
      { status: 500 }
    )
  }
}

// POST 方法：创建教师
export async function POST(request: NextRequest) {
  try {
    // 获取会话信息，验证用户是否已登录且有权限
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }
    
    // 验证用户是否有权限（管理员或教职工）
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }
    
    // 解析请求体
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = teacherCreateSchema.parse(body)
    
    // 检查用户是否存在
    const userExists = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })
    
    if (!userExists) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    
    // 检查用户是否已经是教师
    const teacherExists = await prisma.teacher.findUnique({
      where: { userId: validatedData.userId }
    })
    
    if (teacherExists) {
      return NextResponse.json({ error: '该用户已经是教师' }, { status: 409 })
    }
    
    // 创建教师记录
    const teacher = await prisma.teacher.create({
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            department: true,
          }
        }
      }
    })
    
    // 更新用户角色为教师
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: { role: 'TEACHER' }
    })
    
    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error('创建教师失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '创建教师失败' },
      { status: 500 }
    )
  }
} 