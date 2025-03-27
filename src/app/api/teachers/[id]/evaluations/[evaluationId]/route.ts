import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// 定义评价更新验证模式
const evaluationUpdateSchema = z.object({
  courseId: z.string().min(1, '课程ID不能为空').optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  evaluationDate: z.string().or(z.date()).transform(val => new Date(val)).optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendations: z.string().optional(),
})

// GET 方法：获取单个评价
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, evaluationId: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id, evaluationId } = params

    // 验证教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 获取评价信息
    const evaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId: id
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

    if (!evaluation) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 })
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('获取评价信息失败:', error)
    return NextResponse.json(
      { error: '获取评价信息失败' },
      { status: 500 }
    )
  }
}

// PATCH 方法：更新评价
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, evaluationId: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id, evaluationId } = params

    // 验证教师和评价是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    const evaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId: id
      }
    })

    if (!evaluation) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 })
    }

    // 验证用户权限
    // 只允许管理员、教职工或评价的创建者更新评价
    if (
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'STAFF' &&
      session.user.id !== evaluation.userId
    ) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 解析请求体
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = evaluationUpdateSchema.parse(body)

    // 如果更新了课程ID，验证课程是否存在
    if (validatedData.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: validatedData.courseId }
      })

      if (!course) {
        return NextResponse.json({ error: '课程不存在' }, { status: 404 })
      }
    }

    // 更新评价
    const updatedEvaluation = await prisma.teacherEvaluation.update({
      where: {
        id: evaluationId,
        teacherId: id
      },
      data: validatedData,
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

    return NextResponse.json(updatedEvaluation)
  } catch (error) {
    console.error('更新评价信息失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '更新评价信息失败' },
      { status: 500 }
    )
  }
}

// DELETE 方法：删除评价
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, evaluationId: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id, evaluationId } = params

    // 验证教师和评价是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    const evaluation = await prisma.teacherEvaluation.findUnique({
      where: {
        id: evaluationId,
        teacherId: id
      }
    })

    if (!evaluation) {
      return NextResponse.json({ error: '评价不存在' }, { status: 404 })
    }

    // 验证用户权限
    // 只允许管理员、教职工或评价的创建者删除评价
    if (
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'STAFF' &&
      session.user.id !== evaluation.userId
    ) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 删除评价
    await prisma.teacherEvaluation.delete({
      where: {
        id: evaluationId,
        teacherId: id
      }
    })

    return NextResponse.json({ message: '评价已成功删除' })
  } catch (error) {
    console.error('删除评价失败:', error)
    return NextResponse.json(
      { error: '删除评价失败' },
      { status: 500 }
    )
  }
} 