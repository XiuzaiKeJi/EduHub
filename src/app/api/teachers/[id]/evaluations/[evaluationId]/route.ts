import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 更新教师评价请求体验证
const updateEvaluationSchema = z.object({
  rating: z.number().min(1, '评分不能低于1').max(5, '评分不能高于5').optional(),
  comment: z.string().optional().nullable(),
  evaluationDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: '评价日期格式无效',
  }).optional(),
  strengths: z.string().optional().nullable(),
  weaknesses: z.string().optional().nullable(),
  recommendations: z.string().optional().nullable(),
})

// GET /api/teachers/[id]/evaluations/[evaluationId]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, evaluationId: string } }
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

    const { id: teacherId, evaluationId } = params

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

    // 获取教师评价
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
          }
        }
      }
    })

    if (!evaluation) {
      return NextResponse.json(
        { error: '教师评价不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...evaluation,
      evaluationDate: evaluation.evaluationDate.toISOString(),
      createdAt: evaluation.createdAt.toISOString(),
      updatedAt: evaluation.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('获取教师评价详情失败:', error)
    return NextResponse.json(
      { error: '获取教师评价详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/teachers/[id]/evaluations/[evaluationId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, evaluationId: string } }
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

    // 验证用户权限（只有管理员可以更新教师评价）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id: teacherId, evaluationId } = params

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

    // 检查评价是否存在
    const existingEvaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId,
      },
    })

    if (!existingEvaluation) {
      return NextResponse.json(
        { error: '教师评价不存在' },
        { status: 404 }
      )
    }

    // 验证请求数据
    const body = await request.json()
    const result = updateEvaluationSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const {
      rating,
      comment,
      evaluationDate,
      strengths,
      weaknesses,
      recommendations,
    } = result.data

    // 创建更新数据对象
    const updateData: any = {}

    if (rating !== undefined) updateData.rating = rating
    if (comment !== undefined) updateData.comment = comment
    if (evaluationDate !== undefined) updateData.evaluationDate = new Date(evaluationDate)
    if (strengths !== undefined) updateData.strengths = strengths
    if (weaknesses !== undefined) updateData.weaknesses = weaknesses
    if (recommendations !== undefined) updateData.recommendations = recommendations

    // 更新教师评价
    const updatedEvaluation = await prisma.teacherEvaluation.update({
      where: {
        id: evaluationId,
      },
      data: updateData,
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

    return NextResponse.json({
      ...updatedEvaluation,
      evaluationDate: updatedEvaluation.evaluationDate.toISOString(),
      createdAt: updatedEvaluation.createdAt.toISOString(),
      updatedAt: updatedEvaluation.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('更新教师评价失败:', error)
    return NextResponse.json(
      { error: '更新教师评价失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/teachers/[id]/evaluations/[evaluationId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, evaluationId: string } }
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

    // 验证用户权限（只有管理员可以删除教师评价）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id: teacherId, evaluationId } = params

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

    // 检查评价是否存在
    const evaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId,
      },
    })

    if (!evaluation) {
      return NextResponse.json(
        { error: '教师评价不存在' },
        { status: 404 }
      )
    }

    // 删除教师评价
    await prisma.teacherEvaluation.delete({
      where: {
        id: evaluationId,
      },
    })

    return NextResponse.json(
      { message: '教师评价已成功删除' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除教师评价失败:', error)
    return NextResponse.json(
      { error: '删除教师评价失败' },
      { status: 500 }
    )
  }
} 