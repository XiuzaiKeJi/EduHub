import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 创建教师资质请求体验证
const createQualificationSchema = z.object({
  name: z.string().min(1, '资质名称不能为空'),
  issuer: z.string().min(1, '发证机构不能为空'),
  issueDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: '发证日期格式无效',
  }),
  expiryDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: '过期日期格式无效',
  }).optional(),
  description: z.string().optional(),
  level: z.string().optional(),
  certificateNumber: z.string().optional(),
})

// GET /api/teachers/[id]/qualifications
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const teacherId = params.id

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: '教师不存在' },
        { status: 404 }
      )
    }

    // 获取教师资质列表
    const qualifications = await prisma.teacherQualification.findMany({
      where: { teacherId },
      orderBy: { issueDate: 'desc' },
    })

    // 格式化日期
    const formattedQualifications = qualifications.map(qualification => ({
      ...qualification,
      issueDate: qualification.issueDate.toISOString(),
      expiryDate: qualification.expiryDate ? qualification.expiryDate.toISOString() : null,
      createdAt: qualification.createdAt.toISOString(),
      updatedAt: qualification.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedQualifications)
  } catch (error) {
    console.error('获取教师资质列表失败:', error)
    return NextResponse.json(
      { error: '获取教师资质列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/teachers/[id]/qualifications
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const teacherId = params.id

    // 验证当前用户是否有权限添加资质（管理员或教师本人）
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { userId: true }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: '教师不存在' },
        { status: 404 }
      )
    }

    const isAdmin = session.user.role === 'ADMIN'
    const isTeacherSelf = teacher.userId === session.user.id

    if (!isAdmin && !isTeacherSelf) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    // 验证请求数据
    const body = await request.json()
    const result = createQualificationSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const {
      name,
      issuer,
      issueDate,
      expiryDate,
      description,
      level,
      certificateNumber,
    } = result.data

    // 创建教师资质
    const qualification = await prisma.teacherQualification.create({
      data: {
        teacherId,
        name,
        issuer,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description,
        level,
        certificateNumber,
      },
    })

    return NextResponse.json(
      {
        ...qualification,
        issueDate: qualification.issueDate.toISOString(),
        expiryDate: qualification.expiryDate ? qualification.expiryDate.toISOString() : null,
        createdAt: qualification.createdAt.toISOString(),
        updatedAt: qualification.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('添加教师资质失败:', error)
    return NextResponse.json(
      { error: '添加教师资质失败' },
      { status: 500 }
    )
  }
} 