import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 创建课程分类请求体验证
const createCourseCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空'),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

// 查询参数验证
const querySchema = z.object({
  search: z.string().optional(),
  parentId: z.string().optional(),
  includeChildren: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
})

// GET /api/course-categories
export async function GET(request: NextRequest) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    // 解析查询参数
    const { searchParams } = request.nextUrl
    const result = querySchema.safeParse(Object.fromEntries(searchParams.entries()))
    
    if (!result.success) {
      return NextResponse.json(
        { error: '查询参数无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const { search, parentId, includeChildren } = result.data

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (parentId !== undefined) {
      where.parentId = parentId || null
    }

    // 查询课程分类
    const categories = await prisma.courseCategory.findMany({
      where,
      include: {
        parent: includeChildren ? {
          select: {
            id: true,
            name: true,
          }
        } : false,
        children: includeChildren ? {
          select: {
            id: true,
            name: true,
          }
        } : false,
        _count: {
          select: {
            courses: true,
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    })

    // 格式化日期
    const formattedCategories = categories.map(category => ({
      ...category,
      coursesCount: category._count.courses,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      _count: undefined
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('获取课程分类列表失败:', error)
    return NextResponse.json(
      { error: '获取课程分类列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/course-categories
export async function POST(request: NextRequest) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    // 验证用户权限（只有管理员可以创建课程分类）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = createCourseCategorySchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const { name, description, parentId } = result.data

    // 检查分类名称是否已存在于同级
    const existingCategory = await prisma.courseCategory.findFirst({
      where: {
        name,
        parentId: parentId || null,
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: '同级分类下已存在相同名称的分类' },
        { status: 409 }
      )
    }

    // 如果提供了父级ID，检查父级是否存在
    if (parentId) {
      const parentCategory = await prisma.courseCategory.findUnique({
        where: { id: parentId },
      })

      if (!parentCategory) {
        return NextResponse.json(
          { error: '父级分类不存在' },
          { status: 400 }
        )
      }
    }

    // 创建课程分类
    const category = await prisma.courseCategory.create({
      data: {
        name,
        description,
        parentId,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          }
        },
      },
    })

    // 格式化日期
    const formattedCategory = {
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedCategory, { status: 201 })
  } catch (error) {
    console.error('创建课程分类失败:', error)
    return NextResponse.json(
      { error: '创建课程分类失败' },
      { status: 500 }
    )
  }
} 