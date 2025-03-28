import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 更新评价验证模式
const updateEvaluationSchema = z.object({
  courseId: z.string().min(1, '课程ID不能为空').optional(),
  rating: z.number().min(1, '评分不能低于1').max(5, '评分不能高于5').optional(),
  evaluationDate: z.string().transform((val) => new Date(val)).optional(),
  comment: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendations: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; evaluationId: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id: teacherId, evaluationId } = params

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 获取评价详情
    const evaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId,
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

    if (!evaluation) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 })
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('获取评价详情失败:', error)
    return NextResponse.json({ error: '获取评价详情失败' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; evaluationId: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id: teacherId, evaluationId } = params

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 检查评价是否存在
    const evaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId,
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 })
    }

    // 检查用户权限（管理员或评价创建者）
    if (session.user.role !== 'ADMIN' && session.user.id !== evaluation.userId) {
      return NextResponse.json({ error: '权限不足，无法更新此评价' }, { status: 403 })
    }

    // 解析请求体
    const body = await req.json()
    
    // 验证数据
    const validatedData = updateEvaluationSchema.parse(body)

    // 如果更新了课程ID，检查课程是否存在
    if (validatedData.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: validatedData.courseId },
      })

      if (!course) {
        return NextResponse.json({ error: '课程不存在' }, { status: 404 })
      }
    }

    // 更新评价
    const updatedEvaluation = await prisma.teacherEvaluation.update({
      where: {
        id: evaluationId,
        teacherId,
      },
      data: validatedData,
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

    return NextResponse.json(updatedEvaluation)
  } catch (error) {
    console.error('更新评价失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '参数验证失败', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: '更新评价失败' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; evaluationId: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id: teacherId, evaluationId } = params

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 检查评价是否存在
    const evaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId,
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 })
    }

    // 检查用户权限（管理员或评价创建者）
    if (session.user.role !== 'ADMIN' && session.user.id !== evaluation.userId) {
      return NextResponse.json({ error: '权限不足，无法删除此评价' }, { status: 403 })
    }

    // 删除评价
    await prisma.teacherEvaluation.delete({
      where: {
        id: evaluationId,
        teacherId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除评价失败:', error)
    return NextResponse.json({ error: '删除评价失败' }, { status: 500 })
  }
} 