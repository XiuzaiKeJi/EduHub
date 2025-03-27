import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// 定义资质创建验证模式
const qualificationCreateSchema = z.object({
  name: z.string().min(1, '资质名称不能为空'),
  issuer: z.string().min(1, '发证机构不能为空'),
  issueDate: z.string().or(z.date()).transform(val => new Date(val)),
  expiryDate: z.string().or(z.date()).transform(val => new Date(val)).optional().nullable(),
  description: z.string().optional(),
  level: z.string().optional(),
  certificateNumber: z.string().optional(),
})

// GET 方法：获取教师资质列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id } = params

    // 验证教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 获取教师的资质列表
    const qualifications = await prisma.teacherQualification.findMany({
      where: { teacherId: id },
      orderBy: { issueDate: 'desc' }
    })

    return NextResponse.json(qualifications)
  } catch (error) {
    console.error('获取教师资质列表失败:', error)
    return NextResponse.json(
      { error: '获取教师资质列表失败' },
      { status: 500 }
    )
  }
}

// POST 方法：创建教师资质
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id } = params

    // 验证教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 验证用户权限
    // 只允许自己（如果是教师）、管理员或教职工添加资质
    if (
      session.user.id !== teacher.userId &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'STAFF'
    ) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 解析请求体
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = qualificationCreateSchema.parse(body)

    // 创建资质
    const qualification = await prisma.teacherQualification.create({
      data: {
        ...validatedData,
        teacherId: id
      }
    })

    return NextResponse.json(qualification, { status: 201 })
  } catch (error) {
    console.error('创建教师资质失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '创建教师资质失败' },
      { status: 500 }
    )
  }
} 