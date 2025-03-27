import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// 定义评价创建验证模式
const evaluationCreateSchema = z.object({
  courseId: z.string().min(1, '课程ID不能为空'),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  evaluationDate: z.string().or(z.date()).transform(val => new Date(val)),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendations: z.string().optional(),
})

// GET 方法：获取教师评价列表
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

    // 获取教师的评价列表
    const evaluations = await prisma.teacherEvaluation.findMany({
      where: { teacherId: id },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: { evaluationDate: 'desc' }
    })

    return NextResponse.json(evaluations)
  } catch (error) {
    console.error('获取教师评价列表失败:', error)
    return NextResponse.json(
      { error: '获取教师评价列表失败' },
      { status: 500 }
    )
  }
}

// POST 方法：创建教师评价
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
      where: { id }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 解析请求体
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = evaluationCreateSchema.parse(body)

    // 验证课程是否存在
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId }
    })

    if (!course) {
      return NextResponse.json({ error: '课程不存在' }, { status: 404 })
    }

    // 创建评价
    const evaluation = await prisma.teacherEvaluation.create({
      data: {
        ...validatedData,
        teacherId: id,
        userId: session.user.id // 记录评价者ID
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    return NextResponse.json(evaluation, { status: 201 })
  } catch (error) {
    console.error('创建教师评价失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '创建教师评价失败' },
      { status: 500 }
    )
  }
} 