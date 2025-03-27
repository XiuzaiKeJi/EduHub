import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 更新课程资源请求体验证
const updateCourseResourceSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符').optional(),
  description: z.string().optional().nullable(),
  type: z.string().min(1, '资源类型不能为空').optional(),
  url: z.string().url('URL格式不正确').optional(),
  size: z.number().optional().nullable(),
  format: z.string().optional().nullable(),
  order: z.number().optional()
});

// GET /api/courses/[id]/resources/[resourceId]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, resourceId: string } }
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

    const { id, resourceId } = params

    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id },
    })

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      )
    }

    // 查询课程资源
    const resource = await prisma.courseResource.findUnique({
      where: { 
        id: resourceId,
        courseId: id
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

    if (!resource) {
      return NextResponse.json(
        { error: '课程资源不存在' },
        { status: 404 }
      )
    }

    // 格式化日期
    const formattedResource = {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedResource)
  } catch (error) {
    console.error('获取课程资源详情失败:', error)
    return NextResponse.json(
      { error: '获取课程资源详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/courses/[id]/resources/[resourceId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, resourceId: string } }
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

    // 验证用户权限（只有教师和管理员可以更新课程资源）
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id, resourceId } = params

    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id },
    })

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      )
    }

    // 如果当前用户是教师，检查是否是课程的教师
    if (
      session.user.role === 'TEACHER' &&
      course.teacherId !== session.user.id
    ) {
      return NextResponse.json(
        { error: '只能更新自己教授的课程的资源' },
        { status: 403 }
      )
    }

    // 检查课程资源是否存在
    const existingResource = await prisma.courseResource.findUnique({
      where: {
        id: resourceId,
        courseId: id
      }
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: '课程资源不存在' },
        { status: 404 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = updateCourseResourceSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const updateData = result.data

    // 更新课程资源
    const updatedResource = await prisma.courseResource.update({
      where: {
        id: resourceId,
      },
      data: updateData
    })

    return NextResponse.json({
      ...updatedResource,
      createdAt: updatedResource.createdAt.toISOString(),
      updatedAt: updatedResource.updatedAt.toISOString()
    })
  } catch (error) {
    console.error('更新课程资源失败:', error)
    return NextResponse.json(
      { error: '更新课程资源失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id]/resources/[resourceId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, resourceId: string } }
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

    // 验证用户权限（只有教师和管理员可以删除课程资源）
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id, resourceId } = params

    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id },
    })

    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      )
    }

    // 如果当前用户是教师，检查是否是课程的教师
    if (
      session.user.role === 'TEACHER' &&
      course.teacherId !== session.user.id
    ) {
      return NextResponse.json(
        { error: '只能删除自己教授的课程的资源' },
        { status: 403 }
      )
    }

    // 检查课程资源是否存在
    const resource = await prisma.courseResource.findUnique({
      where: {
        id: resourceId,
        courseId: id
      }
    })

    if (!resource) {
      return NextResponse.json(
        { error: '课程资源不存在' },
        { status: 404 }
      )
    }

    // 删除课程资源
    await prisma.courseResource.delete({
      where: {
        id: resourceId
      }
    })

    return NextResponse.json(
      { message: '课程资源删除成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除课程资源失败:', error)
    return NextResponse.json(
      { error: '删除课程资源失败' },
      { status: 500 }
    )
  }
} 