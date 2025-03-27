import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 创建课程资源请求体验证
const createCourseResourceSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  description: z.string().optional(),
  type: z.string().min(1, '资源类型不能为空'),
  url: z.string().url('URL格式不正确'),
  size: z.number().optional(),
  format: z.string().optional(),
  order: z.number().optional()
});

// GET /api/courses/[id]/resources
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
    const resources = await prisma.courseResource.findMany({
      where: { courseId: id },
      orderBy: [
        { order: 'asc' },
        { title: 'asc' }
      ],
    })

    // 格式化日期
    const formattedResources = resources.map(resource => ({
      ...resource,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedResources)
  } catch (error) {
    console.error('获取课程资源失败:', error)
    return NextResponse.json(
      { error: '获取课程资源失败' },
      { status: 500 }
    )
  }
}

// POST /api/courses/[id]/resources
export async function POST(
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

    // 验证用户权限（只有教师和管理员可以创建课程资源）
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id } = params

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
        { error: '只能为自己教授的课程添加资源' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = createCourseResourceSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const { title, description, type, url, size, format, order = 0 } = result.data

    // 创建课程资源
    const resource = await prisma.courseResource.create({
      data: {
        courseId: id,
        title,
        description,
        type,
        url,
        size,
        format,
        order
      }
    })

    return NextResponse.json(
      {
        ...resource,
        createdAt: resource.createdAt.toISOString(),
        updatedAt: resource.updatedAt.toISOString()
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('创建课程资源失败:', error)
    return NextResponse.json(
      { error: '创建课程资源失败' },
      { status: 500 }
    )
  }
} 