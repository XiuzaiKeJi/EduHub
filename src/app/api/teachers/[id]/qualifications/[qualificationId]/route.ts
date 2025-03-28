import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// 更新资质验证模式
const updateQualificationSchema = z.object({
  name: z.string().min(1, '资质名称不能为空').optional(),
  issuer: z.string().min(1, '颁发机构不能为空').optional(),
  issueDate: z.string().transform((val) => new Date(val)).optional(),
  expiryDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  description: z.string().optional(),
  level: z.string().optional(),
  certificateNumber: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; qualificationId: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id: teacherId, qualificationId } = params

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 获取资质详情
    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId,
      },
    })

    if (!qualification) {
      return NextResponse.json({ error: '资质不存在' }, { status: 404 })
    }

    return NextResponse.json(qualification)
  } catch (error) {
    console.error('获取资质详情失败:', error)
    return NextResponse.json({ error: '获取资质详情失败' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; qualificationId: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id: teacherId, qualificationId } = params

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 检查资质是否存在
    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId,
      },
    })

    if (!qualification) {
      return NextResponse.json({ error: '资质不存在' }, { status: 404 })
    }

    // 检查用户权限（管理员或教师本人）
    if (session.user.role !== 'ADMIN' && session.user.id !== teacher.userId) {
      return NextResponse.json({ error: '权限不足，无法更新此资质' }, { status: 403 })
    }

    // 解析请求体
    const body = await req.json()
    
    // 验证数据
    const validatedData = updateQualificationSchema.parse(body)

    // 更新资质
    const updatedQualification = await prisma.teacherQualification.update({
      where: {
        id: qualificationId,
        teacherId,
      },
      data: validatedData,
    })

    return NextResponse.json(updatedQualification)
  } catch (error) {
    console.error('更新资质失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '参数验证失败', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: '更新资质失败' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; qualificationId: string } }
) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id: teacherId, qualificationId } = params

    // 检查教师是否存在
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json({ error: '教师不存在' }, { status: 404 })
    }

    // 检查资质是否存在
    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId,
      },
    })

    if (!qualification) {
      return NextResponse.json({ error: '资质不存在' }, { status: 404 })
    }

    // 检查用户权限（管理员或教师本人）
    if (session.user.role !== 'ADMIN' && session.user.id !== teacher.userId) {
      return NextResponse.json({ error: '权限不足，无法删除此资质' }, { status: 403 })
    }

    // 删除资质
    await prisma.teacherQualification.delete({
      where: {
        id: qualificationId,
        teacherId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除资质失败:', error)
    return NextResponse.json({ error: '删除资质失败' }, { status: 500 })
  }
} 