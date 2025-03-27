import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 创建教师请求体验证
const createTeacherSchema = z.object({
  userId: z.string().min(1, '用户ID不能为空'),
  title: z.string().optional(),
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

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  pageSize: z.string().optional().transform(val => val ? parseInt(val) : 10),
  search: z.string().optional(),
  title: z.string().optional(),
  specialties: z.string().optional(),
  sortBy: z.enum(['name', 'title', 'createdAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
})

// GET /api/teachers
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
      title, 
      specialties, 
      sortBy, 
      sortOrder 
    } = result.data

    // 构建查询条件
    let where: any = {}
    
    if (search) {
      where = {
        OR: [
          { user: { name: { contains: search } } },
          { title: { contains: search } },
          { bio: { contains: search } },
          { specialties: { contains: search } },
          { subjects: { contains: search } },
        ],
      }
    }
    
    if (title) {
      where.title = { contains: title }
    }
    
    if (specialties) {
      where.specialties = { contains: specialties }
    }

    // 计算总数
    const total = await prisma.teacher.count({ where })
    
    // 查询教师列表
    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        qualifications: {
          select: {
            id: true,
            name: true,
            issuer: true,
            issueDate: true,
            expiryDate: true,
          }
        },
      },
      orderBy: sortBy === 'name' 
        ? { user: { name: sortOrder } } 
        : { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    // 格式化日期
    const formattedTeachers = teachers.map(teacher => ({
      ...teacher,
      createdAt: teacher.createdAt.toISOString(),
      updatedAt: teacher.updatedAt.toISOString(),
      qualifications: teacher.qualifications.map(qualification => ({
        ...qualification,
        issueDate: qualification.issueDate.toISOString(),
        expiryDate: qualification.expiryDate ? qualification.expiryDate.toISOString() : null,
      })),
    }))

    return NextResponse.json({
      teachers: formattedTeachers,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('获取教师列表失败:', error)
    return NextResponse.json(
      { error: '获取教师列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/teachers
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

    // 验证用户权限（只有管理员可以创建教师档案）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = createTeacherSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const {
      userId,
      title,
      bio,
      education,
      experience,
      specialties,
      subjects,
      achievements,
      contactInfo,
      officeHours,
      officeLocation,
    } = result.data

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 检查该用户是否已经有教师档案
    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId },
    })

    if (existingTeacher) {
      return NextResponse.json(
        { error: '该用户已有教师档案' },
        { status: 409 }
      )
    }

    // 更新用户角色为教师（如果尚未设置）
    if (user.role !== 'TEACHER') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'TEACHER' },
      })
    }

    // 创建教师档案
    const teacher = await prisma.teacher.create({
      data: {
        userId,
        title,
        bio,
        education,
        experience,
        specialties,
        subjects,
        achievements,
        contactInfo,
        officeHours,
        officeLocation,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        ...teacher,
        createdAt: teacher.createdAt.toISOString(),
        updatedAt: teacher.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('创建教师失败:', error)
    return NextResponse.json(
      { error: '创建教师失败' },
      { status: 500 }
    )
  }
} 