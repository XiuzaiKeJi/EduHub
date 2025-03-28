import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 创建资质验证模式
const createQualificationSchema = z.object({
  name: z.string().min(1, '资质名称不能为空'),
  issuer: z.string().min(1, '颁发机构不能为空'),
  issueDate: z.string().transform((val) => new Date(val)),
  expiryDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  description: z.string().optional(),
  level: z.string().optional(),
  certificateNumber: z.string().optional(),
})

// GET 方法：获取教师资质列表
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const teacherId = params.id

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 获取教师的资质列表
    const qualifications = await prisma.teacherQualification.findMany({
      where: { teacherId },
      orderBy: { issueDate: 'desc' },
    })

    return NextResponse.json(qualifications)
  } catch (error) {
    console.error('获取教师资质失败:', error)
    return NextResponse.json({ error: '获取教师资质失败' }, { status: 500 })
  }
}

// POST 方法：创建教师资质
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const teacherId = params.id

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 检查用户权限（管理员或教师本人）
    if (session.user.role !== 'ADMIN' && session.user.id !== teacher.userId) {
      return NextResponse.json({ error: '权限不足，无法添加资质' }, { status: 403 })
    }

    // 解析请求体
    const body = await req.json()
    
    // 验证数据
    const validatedData = createQualificationSchema.parse(body)

    // 创建资质记录
    const qualification = await prisma.teacherQualification.create({
      data: {
        teacherId,
        name: validatedData.name,
        issuer: validatedData.issuer,
        issueDate: validatedData.issueDate,
        expiryDate: validatedData.expiryDate,
        description: validatedData.description,
        level: validatedData.level,
        certificateNumber: validatedData.certificateNumber,
      },
    })

    return NextResponse.json(qualification, { status: 201 })
  } catch (error) {
    console.error('创建教师资质失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '参数验证失败', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: '创建教师资质失败' }, { status: 500 })
  }
} 