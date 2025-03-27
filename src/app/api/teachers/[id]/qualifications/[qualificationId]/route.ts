import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 更新教师资质请求体验证
const updateQualificationSchema = z.object({
  name: z.string().min(1, '资质名称不能为空').optional(),
  issuer: z.string().min(1, '发证机构不能为空').optional(),
  issueDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: '发证日期格式无效',
  }).optional(),
  expiryDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: '过期日期格式无效',
  }).optional().nullable(),
  description: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  certificateNumber: z.string().optional().nullable(),
})

// GET /api/teachers/[id]/qualifications/[qualificationId]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, qualificationId: string } }
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

    const { id: teacherId, qualificationId } = params

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

    // 获取教师资质
    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId,
      },
    })

    if (!qualification) {
      return NextResponse.json(
        { error: '教师资质不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...qualification,
      issueDate: qualification.issueDate.toISOString(),
      expiryDate: qualification.expiryDate ? qualification.expiryDate.toISOString() : null,
      createdAt: qualification.createdAt.toISOString(),
      updatedAt: qualification.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('获取教师资质详情失败:', error)
    return NextResponse.json(
      { error: '获取教师资质详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/teachers/[id]/qualifications/[qualificationId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, qualificationId: string } }
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

    const { id: teacherId, qualificationId } = params

    // 验证当前用户是否有权限更新资质（管理员或教师本人）
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

    // 检查资质是否存在
    const existingQualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId,
      },
    })

    if (!existingQualification) {
      return NextResponse.json(
        { error: '教师资质不存在' },
        { status: 404 }
      )
    }

    // 验证请求数据
    const body = await request.json()
    const result = updateQualificationSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const {
      name,
      issuer,
      issueDate,
      expiryDate,
      description,
      level,
      certificateNumber,
    } = result.data

    // 创建更新数据对象
    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (issuer !== undefined) updateData.issuer = issuer
    if (issueDate !== undefined) updateData.issueDate = new Date(issueDate)
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null
    if (description !== undefined) updateData.description = description
    if (level !== undefined) updateData.level = level
    if (certificateNumber !== undefined) updateData.certificateNumber = certificateNumber

    // 更新教师资质
    const updatedQualification = await prisma.teacherQualification.update({
      where: {
        id: qualificationId,
      },
      data: updateData,
    })

    return NextResponse.json({
      ...updatedQualification,
      issueDate: updatedQualification.issueDate.toISOString(),
      expiryDate: updatedQualification.expiryDate ? updatedQualification.expiryDate.toISOString() : null,
      createdAt: updatedQualification.createdAt.toISOString(),
      updatedAt: updatedQualification.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('更新教师资质失败:', error)
    return NextResponse.json(
      { error: '更新教师资质失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/teachers/[id]/qualifications/[qualificationId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, qualificationId: string } }
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

    const { id: teacherId, qualificationId } = params

    // 验证当前用户是否有权限删除资质（管理员或教师本人）
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

    // 检查资质是否存在
    const qualification = await prisma.teacherQualification.findUnique({
      where: {
        id: qualificationId,
        teacherId,
      },
    })

    if (!qualification) {
      return NextResponse.json(
        { error: '教师资质不存在' },
        { status: 404 }
      )
    }

    // 删除教师资质
    await prisma.teacherQualification.delete({
      where: {
        id: qualificationId,
      },
    })

    return NextResponse.json(
      { message: '教师资质已成功删除' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除教师资质失败:', error)
    return NextResponse.json(
      { error: '删除教师资质失败' },
      { status: 500 }
    )
  }
} 