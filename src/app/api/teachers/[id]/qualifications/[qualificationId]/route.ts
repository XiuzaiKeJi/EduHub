import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// 定义资质更新验证模式
const qualificationUpdateSchema = z.object({
  name: z.string().min(1, '资质名称不能为空').optional(),
  issuer: z.string().min(1, '发证机构不能为空').optional(),
  issueDate: z.string().or(z.date()).transform(val => new Date(val)).optional(),
  expiryDate: z.string().or(z.date()).transform(val => new Date(val)).optional().nullable(),
  description: z.string().optional(),
  level: z.string().optional(),
  certificateNumber: z.string().optional(),
})

// GET 方法：获取单个资质
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, qualificationId: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id, qualificationId } = params

    // 验证教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 获取资质信息
    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId: id
      }
    })

    if (!qualification) {
      return NextResponse.json({ error: '资质不存在' }, { status: 404 })
    }

    return NextResponse.json(qualification)
  } catch (error) {
    console.error('获取资质信息失败:', error)
    return NextResponse.json(
      { error: '获取资质信息失败' },
      { status: 500 }
    )
  }
}

// PATCH 方法：更新资质
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, qualificationId: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id, qualificationId } = params

    // 验证教师和资质是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId: id
      }
    })

    if (!qualification) {
      return NextResponse.json({ error: '资质不存在' }, { status: 404 })
    }

    // 验证用户权限
    // 只允许自己（如果是教师）、管理员或教职工更新资质
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
    const validatedData = qualificationUpdateSchema.parse(body)

    // 更新资质
    const updatedQualification = await prisma.teacherQualification.update({
      where: {
        id: qualificationId,
        teacherId: id
      },
      data: validatedData
    })

    return NextResponse.json(updatedQualification)
  } catch (error) {
    console.error('更新资质信息失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '更新资质信息失败' },
      { status: 500 }
    )
  }
}

// DELETE 方法：删除资质
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, qualificationId: string } }
) {
  try {
    // 获取会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id, qualificationId } = params

    // 验证教师和资质是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId: id
      }
    })

    if (!qualification) {
      return NextResponse.json({ error: '资质不存在' }, { status: 404 })
    }

    // 验证用户权限
    // 只允许自己（如果是教师）、管理员或教职工删除资质
    if (
      session.user.id !== teacher.userId &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'STAFF'
    ) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 删除资质
    await prisma.teacherQualification.delete({
      where: {
        id: qualificationId,
        teacherId: id
      }
    })

    return NextResponse.json({ message: '资质已成功删除' })
  } catch (error) {
    console.error('删除资质失败:', error)
    return NextResponse.json(
      { error: '删除资质失败' },
      { status: 500 }
    )
  }
} 