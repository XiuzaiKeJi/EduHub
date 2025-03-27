import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 更新课程分类请求体验证
const updateCourseCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
})

// GET /api/course-categories/[id]
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

    // 查询课程分类
    const category = await prisma.courseCategory.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                courses: true,
              }
            }
          }
        },
        courses: {
          select: {
            id: true,
            name: true,
            code: true,
          },
          take: 10, // 限制返回的课程数量
        },
        _count: {
          select: {
            courses: true,
            children: true,
          }
        }
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: '课程分类不存在' },
        { status: 404 }
      )
    }

    // 格式化日期和计数
    const formattedCategory = {
      ...category,
      coursesCount: category._count.courses,
      childrenCount: category._count.children,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      children: category.children.map(child => ({
        ...child,
        coursesCount: child._count.courses,
        _count: undefined,
      })),
      _count: undefined,
    }

    return NextResponse.json(formattedCategory)
  } catch (error) {
    console.error('获取课程分类详情失败:', error)
    return NextResponse.json(
      { error: '获取课程分类详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/course-categories/[id]
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

    // 验证用户权限（只有管理员可以更新课程分类）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id } = params

    // 检查课程分类是否存在
    const existingCategory = await prisma.courseCategory.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: '课程分类不存在' },
        { status: 404 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = updateCourseCategorySchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const { name, description, parentId } = result.data

    // 检查是否要将分类设置为自己的子分类，这会导致循环引用
    if (parentId === id) {
      return NextResponse.json(
        { error: '分类不能设置为自己的子分类' },
        { status: 400 }
      )
    }

    // 如果更改了名称，检查是否与同级分类名称冲突
    if (name && name !== existingCategory.name) {
      const siblingWithSameName = await prisma.courseCategory.findFirst({
        where: {
          name,
          parentId: parentId !== undefined ? parentId : existingCategory.parentId,
          id: { not: id }, // 排除自身
        },
      })

      if (siblingWithSameName) {
        return NextResponse.json(
          { error: '同级分类下已存在相同名称的分类' },
          { status: 409 }
        )
      }
    }

    // 如果提供了父级ID，检查父级是否存在
    if (parentId !== undefined && parentId !== null) {
      const parentCategory = await prisma.courseCategory.findUnique({
        where: { id: parentId },
      })

      if (!parentCategory) {
        return NextResponse.json(
          { error: '父级分类不存在' },
          { status: 400 }
        )
      }

      // 检查是否会形成循环引用
      // 简单检查：确保父级的父级不是当前分类
      async function checkCircularReference(checkId: string, targetId: string): Promise<boolean> {
        if (checkId === targetId) return true;
        
        const parent = await prisma.courseCategory.findUnique({
          where: { id: checkId },
          select: { parentId: true }
        });
        
        if (!parent || !parent.parentId) return false;
        
        return checkCircularReference(parent.parentId, targetId);
      }

      if (await checkCircularReference(parentId, id)) {
        return NextResponse.json(
          { error: '不能将分类设置为其子分类的子分类，这会导致循环引用' },
          { status: 400 }
        )
      }
    }

    // 更新课程分类
    const updatedCategory = await prisma.courseCategory.update({
      where: { id },
      data: {
        name,
        description,
        parentId: parentId === null ? null : parentId, // 处理显式设置为null的情况
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
      ...updatedCategory,
      createdAt: updatedCategory.createdAt.toISOString(),
      updatedAt: updatedCategory.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedCategory)
  } catch (error) {
    console.error('更新课程分类失败:', error)
    return NextResponse.json(
      { error: '更新课程分类失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/course-categories/[id]
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

    // 验证用户权限（只有管理员可以删除课程分类）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id } = params

    // 检查课程分类是否存在
    const category = await prisma.courseCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: true,
            children: true,
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: '课程分类不存在' },
        { status: 404 }
      )
    }

    // 检查是否有关联的课程
    if (category._count.courses > 0) {
      return NextResponse.json(
        { error: '该分类下存在课程，无法删除' },
        { status: 400 }
      )
    }

    // 检查是否有子分类
    if (category._count.children > 0) {
      return NextResponse.json(
        { error: '该分类下存在子分类，无法删除' },
        { status: 400 }
      )
    }

    // 删除课程分类
    await prisma.courseCategory.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: '课程分类删除成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除课程分类失败:', error)
    return NextResponse.json(
      { error: '删除课程分类失败' },
      { status: 500 }
    )
  }
} 