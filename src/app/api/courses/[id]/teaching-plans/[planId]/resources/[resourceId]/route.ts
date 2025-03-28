import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { z } from 'zod'

const prisma = new PrismaClient()

// 验证更新资源的Schema
const ResourceUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  url: z.string().optional(),
  size: z.number().optional(),
  format: z.string().optional(),
  order: z.number().optional(),
})

// GET 请求处理 - 获取单个教学计划资源
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; planId: string; resourceId: string } }
) {
  const session = await getServerSession(authOptions)
  
  // 检查用户是否已登录
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id, planId, resourceId } = params
    
    // 查询教学计划资源
    const resource = await prisma.teachingPlanResource.findUnique({
      where: {
        id: resourceId,
        planId,
      },
      include: {
        plan: {
          select: {
            courseId: true,
            title: true,
          },
        },
      },
    })
    
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    
    // 检查资源是否属于正确的课程
    if (resource.plan.courseId !== id) {
      return NextResponse.json({ error: 'Resource not found in this course' }, { status: 404 })
    }
    
    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}

// PATCH 请求处理 - 更新教学计划资源
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; planId: string; resourceId: string } }
) {
  const session = await getServerSession(authOptions)
  
  // 检查用户是否已登录
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 检查用户是否为教师或管理员
  if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  try {
    const { id, planId, resourceId } = params
    
    // 检查教学计划资源是否存在
    const existingResource = await prisma.teachingPlanResource.findUnique({
      where: {
        id: resourceId,
        planId,
      },
      include: {
        plan: {
          select: {
            courseId: true,
          },
        },
      },
    })
    
    if (!existingResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    
    // 检查资源是否属于正确的课程
    if (existingResource.plan.courseId !== id) {
      return NextResponse.json({ error: 'Resource not found in this course' }, { status: 404 })
    }
    
    // 验证数据
    const data = await request.json()
    const validatedData = ResourceUpdateSchema.parse(data)
    
    // 更新教学计划资源
    const updatedResource = await prisma.teachingPlanResource.update({
      where: {
        id: resourceId,
      },
      data: validatedData,
    })
    
    return NextResponse.json(updatedResource)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

// DELETE 请求处理 - 删除教学计划资源
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; planId: string; resourceId: string } }
) {
  const session = await getServerSession(authOptions)
  
  // 检查用户是否已登录
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 检查用户是否为教师或管理员
  if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  try {
    const { id, planId, resourceId } = params
    
    // 检查教学计划资源是否存在
    const existingResource = await prisma.teachingPlanResource.findUnique({
      where: {
        id: resourceId,
        planId,
      },
      include: {
        plan: {
          select: {
            courseId: true,
          },
        },
      },
    })
    
    if (!existingResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    
    // 检查资源是否属于正确的课程
    if (existingResource.plan.courseId !== id) {
      return NextResponse.json({ error: 'Resource not found in this course' }, { status: 404 })
    }
    
    // 删除教学计划资源
    await prisma.teachingPlanResource.delete({
      where: {
        id: resourceId,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
} 