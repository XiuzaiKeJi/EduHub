import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 创建教师验证模式
const createTeacherSchema = z.object({
  userId: z.string(),
  title: z.string().min(1, '职称不能为空'),
  department: z.string().optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  specialties: z.string().optional(),
  subjects: z.string().optional(),
  achievements: z.string().optional(),
  contactInfo: z.string().optional(),
  officeHours: z.string().optional(),
  officeLocation: z.string().optional(),
})

// 查询参数验证模式
const getTeachersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  specialties: z.string().optional(),
  sortBy: z.enum(['name', 'title', 'department', 'createdAt', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export async function GET(req: NextRequest) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 解析URL查询参数
    const url = new URL(req.url)
    const searchParams = Object.fromEntries(url.searchParams)
    
    // 验证查询参数
    const validatedParams = getTeachersQuerySchema.parse({
      ...searchParams,
      page: searchParams.page || 1,
      pageSize: searchParams.pageSize || 10,
      sortBy: searchParams.sortBy || 'name',
      sortOrder: searchParams.sortOrder || 'asc',
    })

    const { 
      page, 
      pageSize, 
      search, 
      title, 
      department, 
      specialties, 
      sortBy, 
      sortOrder 
    } = validatedParams

    // 构建查询条件
    const where: any = {}

    // 搜索条件
    if (search) {
      where.OR = [
        { 
          user: { 
            name: { contains: search, mode: 'insensitive' } 
          } 
        },
        { title: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { specialties: { contains: search, mode: 'insensitive' } },
        { subjects: { contains: search, mode: 'insensitive' } },
      ]
    }

    // 职称筛选
    if (title && title !== 'ALL') {
      where.title = { equals: title, mode: 'insensitive' }
    }

    // 部门筛选
    if (department && department !== 'ALL') {
      where.department = { equals: department, mode: 'insensitive' }
    }

    // 专业筛选
    if (specialties && specialties !== 'ALL') {
      where.specialties = { contains: specialties, mode: 'insensitive' }
    }

    // 排序设置
    const orderBy: any = {}
    
    // 特殊处理name排序，因为name在user表中
    if (sortBy === 'name') {
      orderBy.user = { name: sortOrder }
    } else {
      orderBy[sortBy] = sortOrder
    }

    // 查询教师总数
    const total = await prisma.teacher.count({ where })

    // 获取分页后的教师列表
    const teachers = await prisma.teacher.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        qualifications: {
          select: {
            id: true,
            name: true,
            issuer: true,
            issueDate: true,
            expiryDate: true,
          },
        },
        evaluations: {
          select: {
            id: true,
            rating: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // 返回教师列表和分页信息
    return NextResponse.json({
      teachers,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取教师列表失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '参数验证失败', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: '获取教师列表失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }
    
    // 检查用户权限
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足，仅管理员可创建教师' }, { status: 403 })
    }

    // 解析请求体
    const body = await req.json()
    
    // 验证数据
    const validatedData = createTeacherSchema.parse(body)

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 检查该用户是否已经是教师
    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId: validatedData.userId },
    })

    if (existingTeacher) {
      return NextResponse.json({ error: '该用户已经是教师' }, { status: 400 })
    }

    // 创建教师
    const teacher = await prisma.teacher.create({
      data: {
        userId: validatedData.userId,
        title: validatedData.title,
        department: validatedData.department,
        bio: validatedData.bio,
        education: validatedData.education,
        experience: validatedData.experience,
        specialties: validatedData.specialties,
        subjects: validatedData.subjects,
        achievements: validatedData.achievements,
        contactInfo: validatedData.contactInfo,
        officeHours: validatedData.officeHours,
        officeLocation: validatedData.officeLocation,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // 更新用户角色为TEACHER
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: { role: 'TEACHER' },
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error('创建教师失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '参数验证失败', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: '创建教师失败' }, { status: 500 })
  }
} 