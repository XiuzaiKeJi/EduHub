import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 创建教师评价请求体验证
const createEvaluationSchema = z.object({
  courseId: z.string().min(1, '课程ID不能为空'),
  rating: z.number().min(1, '评分不能低于1').max(5, '评分不能高于5'),
  comment: z.string().optional(),
  evaluationDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: '评价日期格式无效',
  }),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendations: z.string().optional(),
})

// GET /api/teachers/[id]/evaluations
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

    // 验证权限（管理员或教师本人可以查看评价）
    const isAdmin = session.user.role === 'ADMIN'
    const isTeacherSelf = teacher.userId === session.user.id

    if (!isAdmin && !isTeacherSelf) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    // 获取教师评价列表
    const evaluations = await prisma.teacherEvaluation.findMany({
      where: { teacherId },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      },
      orderBy: { evaluationDate: 'desc' },
    })

    // 格式化日期
    const formattedEvaluations = evaluations.map(evaluation => ({
      ...evaluation,
      evaluationDate: evaluation.evaluationDate.toISOString(),
      createdAt: evaluation.createdAt.toISOString(),
      updatedAt: evaluation.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedEvaluations)
  } catch (error) {
    console.error('获取教师评价列表失败:', error)
    return NextResponse.json(
      { error: '获取教师评价列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/teachers/[id]/evaluations
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

    // 验证用户权限（只有管理员可以创建教师评价）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
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

    // 验证请求数据
    const body = await request.json()
    const result = createEvaluationSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const {
      courseId,
      rating,
      comment,
      evaluationDate,
      strengths,
      weaknesses,
      recommendations,
    } = result.data

    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      )
    }

    // 创建教师评价
    const evaluation = await prisma.teacherEvaluation.create({
      data: {
        teacherId,
        courseId,
        rating,
        comment,
        evaluationDate: new Date(evaluationDate),
        strengths,
        weaknesses,
        recommendations,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      }
    })

    return NextResponse.json(
      {
        ...evaluation,
        evaluationDate: evaluation.evaluationDate.toISOString(),
        createdAt: evaluation.createdAt.toISOString(),
        updatedAt: evaluation.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('添加教师评价失败:', error)
    return NextResponse.json(
      { error: '添加教师评价失败' },
      { status: 500 }
    )
  }
} 