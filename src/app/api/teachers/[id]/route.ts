import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 更新教师请求体验证
const updateTeacherSchema = z.object({
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

// GET /api/teachers/[id]
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

    // 获取教师信息
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          }
        },
        qualifications: true,
        evaluations: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: '教师不存在' },
        { status: 404 }
      )
    }

    // 格式化日期
    const formattedTeacher = {
      ...teacher,
      createdAt: teacher.createdAt.toISOString(),
      updatedAt: teacher.updatedAt.toISOString(),
      qualifications: teacher.qualifications.map(qualification => ({
        ...qualification,
        issueDate: qualification.issueDate.toISOString(),
        expiryDate: qualification.expiryDate ? qualification.expiryDate.toISOString() : null,
        createdAt: qualification.createdAt.toISOString(),
        updatedAt: qualification.updatedAt.toISOString(),
      })),
      evaluations: teacher.evaluations.map(evaluation => ({
        ...evaluation,
        createdAt: evaluation.createdAt.toISOString(),
        updatedAt: evaluation.updatedAt.toISOString(),
        evaluationDate: evaluation.evaluationDate.toISOString(),
      })),
    }

    return NextResponse.json(formattedTeacher)
  } catch (error) {
    console.error('获取教师详情失败:', error)
    return NextResponse.json(
      { error: '获取教师详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/teachers/[id]
export async function PATCH(
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
    
    // 验证当前用户是否有权限更新该教师信息（管理员或自己）
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
    const result = updateTeacherSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    // 更新教师信息
    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: result.data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          }
        },
        qualifications: true,
      }
    })

    return NextResponse.json({
      ...updatedTeacher,
      createdAt: updatedTeacher.createdAt.toISOString(),
      updatedAt: updatedTeacher.updatedAt.toISOString(),
      qualifications: updatedTeacher.qualifications.map(qualification => ({
        ...qualification,
        issueDate: qualification.issueDate.toISOString(),
        expiryDate: qualification.expiryDate ? qualification.expiryDate.toISOString() : null,
        createdAt: qualification.createdAt.toISOString(),
        updatedAt: qualification.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('更新教师信息失败:', error)
    return NextResponse.json(
      { error: '更新教师信息失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/teachers/[id]
export async function DELETE(
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

    // 验证用户权限（只有管理员可以删除教师档案）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const teacherId = params.id

    // 查找教师信息
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        qualifications: true,
        evaluations: true,
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: '教师不存在' },
        { status: 404 }
      )
    }

    // 删除关联的资质和评价
    if (teacher.qualifications.length > 0) {
      await prisma.teacherQualification.deleteMany({
        where: { teacherId },
      })
    }

    if (teacher.evaluations.length > 0) {
      await prisma.teacherEvaluation.deleteMany({
        where: { teacherId },
      })
    }

    // 删除教师档案
    await prisma.teacher.delete({
      where: { id: teacherId },
    })

    return NextResponse.json(
      { message: '教师档案已成功删除' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除教师失败:', error)
    return NextResponse.json(
      { error: '删除教师失败' },
      { status: 500 }
    )
  }
} 