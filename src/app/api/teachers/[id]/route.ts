import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// 定义教师更新验证模式
const teacherUpdateSchema = z.object({
  title: z.string().optional(),
  bio: z.string().optional(),
  department: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  specialties: z.string().optional(),
  subjects: z.string().optional(),
  achievements: z.string().optional(),
  contactInfo: z.string().optional(),
  officeHours: z.string().optional(),
  officeLocation: z.string().optional(),
})

// GET 方法：获取单个教师
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

    // 查询教师信息
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
                code: true
              }
            }
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('获取教师信息失败:', error)
    return NextResponse.json(
      { error: '获取教师信息失败' },
      { status: 500 }
    )
  }
}

// PATCH 方法：更新教师
export async function PATCH(
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
    // 只允许自己（如果是教师）、管理员或教职工更新教师信息
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
    const validatedData = teacherUpdateSchema.parse(body)

    // 更新教师信息
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            department: true,
          }
        }
      }
    })

    return NextResponse.json(updatedTeacher)
  } catch (error) {
    console.error('更新教师信息失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '更新教师信息失败' },
      { status: 500 }
    )
  }
}

// DELETE 方法：删除教师
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 验证用户权限（只有管理员可以删除教师）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
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

    // 使用事务删除教师及相关数据
    await prisma.$transaction([
      // 删除教师的资质
      prisma.teacherQualification.deleteMany({
        where: { teacherId: id }
      }),
      // 删除教师的评价
      prisma.teacherEvaluation.deleteMany({
        where: { teacherId: id }
      }),
      // 删除教师记录
      prisma.teacher.delete({
        where: { id }
      }),
      // 更新用户角色
      prisma.user.update({
        where: { id: teacher.userId },
        data: { role: 'USER' }
      })
    ])

    return NextResponse.json({ message: '教师已成功删除' })
  } catch (error) {
    console.error('删除教师失败:', error)
    return NextResponse.json(
      { error: '删除教师失败' },
      { status: 500 }
    )
  }
} 