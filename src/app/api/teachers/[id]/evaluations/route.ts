import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 创建评价验证模式
const createEvaluationSchema = z.object({
  courseId: z.string().min(1, '课程ID不能为空'),
  rating: z.number().min(1, '评分不能低于1').max(5, '评分不能高于5'),
  evaluationDate: z.string().transform((val) => new Date(val)),
  comment: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendations: z.string().optional(),
})

// GET 方法：获取教师评价列表
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

    // 获取教师的评价列表
    const evaluations = await prisma.teacherEvaluation.findMany({
      where: { teacherId },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: { evaluationDate: 'desc' },
    })

    return NextResponse.json(evaluations)
  } catch (error) {
    console.error('获取教师评价失败:', error)
    return NextResponse.json({ error: '获取教师评价失败' }, { status: 500 })
  }
}

// POST 方法：创建教师评价
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

    // 解析请求体
    const body = await req.json()
    
    // 验证数据
    const validatedData = createEvaluationSchema.parse(body)

    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
    })

    if (!course) {
      return NextResponse.json({ error: '课程不存在' }, { status: 404 })
    }

    // 创建评价记录
    const evaluation = await prisma.teacherEvaluation.create({
      data: {
        teacherId,
        courseId: validatedData.courseId,
        userId: session.user.id, // 记录评价的用户
        rating: validatedData.rating,
        evaluationDate: validatedData.evaluationDate,
        comment: validatedData.comment,
        strengths: validatedData.strengths,
        weaknesses: validatedData.weaknesses,
        recommendations: validatedData.recommendations,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
    })

    return NextResponse.json(evaluation, { status: 201 })
  } catch (error) {
    console.error('创建教师评价失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '参数验证失败', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: '创建教师评价失败' }, { status: 500 })
  }
} 