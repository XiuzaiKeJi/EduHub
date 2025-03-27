import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 更新课程请求体验证
const updateCourseSchema = z.object({
  name: z.string().min(1, '课程名称不能为空').optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, '课程分类不能为空').optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '无效的开始日期',
  }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '无效的结束日期',
  }).optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  maxStudents: z.number().int().min(0).optional(),
  teacherId: z.string().min(1, '教师ID不能为空').optional(),
})

// GET /api/courses/[id]
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

    const { id } = params

    // 查询课程
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        schedules: true,
        resources: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      )
    }

    // 格式化日期
    const formattedCourse = {
      ...course,
      startDate: course.startDate.toISOString(),
      endDate: course.endDate.toISOString(),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      schedules: course.schedules.map(schedule => ({
        ...schedule,
        createdAt: schedule.createdAt.toISOString(),
        updatedAt: schedule.updatedAt.toISOString(),
      })),
      resources: course.resources.map(resource => ({
        ...resource,
        createdAt: resource.createdAt.toISOString(),
        updatedAt: resource.updatedAt.toISOString(),
      })),
    }

    return NextResponse.json(formattedCourse)
  } catch (error) {
    console.error('获取课程详情失败:', error)
    return NextResponse.json(
      { error: '获取课程详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/courses/[id]
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

    // 验证用户权限（只有教师和管理员可以更新课程）
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id } = params

    // 检查课程是否存在
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      )
    }

    // 如果当前用户是教师，检查是否是课程的教师
    if (
      session.user.role === 'TEACHER' &&
      existingCourse.teacherId !== session.user.id
    ) {
      return NextResponse.json(
        { error: '只能更新自己教授的课程' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = updateCourseSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const updateData = result.data

    // 验证逻辑
    if (updateData.categoryId) {
      // 检查分类是否存在
      const category = await prisma.courseCategory.findUnique({
        where: { id: updateData.categoryId },
      })

      if (!category) {
        return NextResponse.json(
          { error: '课程分类不存在' },
          { status: 400 }
        )
      }
    }

    if (updateData.teacherId) {
      // 检查教师是否存在
      const teacher = await prisma.user.findUnique({
        where: { id: updateData.teacherId },
      })

      if (!teacher || teacher.role !== 'TEACHER') {
        return NextResponse.json(
          { error: '指定的教师不存在或不是教师角色' },
          { status: 400 }
        )
      }
    }

    // 转换日期
    const data: any = { ...updateData }
    if (data.startDate) {
      data.startDate = new Date(data.startDate)
    }
    if (data.endDate) {
      data.endDate = new Date(data.endDate)
    }

    // 更新课程
    const updatedCourse = await prisma.course.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // 格式化日期
    const formattedCourse = {
      ...updatedCourse,
      startDate: updatedCourse.startDate.toISOString(),
      endDate: updatedCourse.endDate.toISOString(),
      createdAt: updatedCourse.createdAt.toISOString(),
      updatedAt: updatedCourse.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedCourse)
  } catch (error) {
    console.error('更新课程失败:', error)
    return NextResponse.json(
      { error: '更新课程失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id]
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

    // 验证用户权限（只有管理员可以删除课程）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id } = params

    // 检查课程是否存在
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      )
    }

    // 删除课程
    await prisma.course.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: '课程删除成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除课程失败:', error)
    return NextResponse.json(
      { error: '删除课程失败' },
      { status: 500 }
    )
  }
} 