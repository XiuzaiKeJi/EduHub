import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { z } from 'zod'

const prisma = new PrismaClient()

// 验证更新进度的Schema
const ProgressUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  weekNumber: z.number().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  completionRate: z.number().min(0).max(100).optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  note: z.string().optional(),
})

// GET 请求处理 - 获取单个教学计划进度
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; planId: string; progressId: string } }
) {
  const session = await getServerSession(authOptions)
  
  // 检查用户是否已登录
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id, planId, progressId } = params
    
    // 查询教学计划进度
    const progress = await prisma.teachingPlanProgress.findUnique({
      where: {
        id: progressId,
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
    
    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }
    
    // 检查进度是否属于正确的课程
    if (progress.plan.courseId !== id) {
      return NextResponse.json({ error: 'Progress not found in this course' }, { status: 404 })
    }
    
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// PATCH 请求处理 - 更新教学计划进度
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; planId: string; progressId: string } }
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
    const { id, planId, progressId } = params
    
    // 检查教学计划进度是否存在
    const existingProgress = await prisma.teachingPlanProgress.findUnique({
      where: {
        id: progressId,
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
    
    if (!existingProgress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }
    
    // 检查进度是否属于正确的课程
    if (existingProgress.plan.courseId !== id) {
      return NextResponse.json({ error: 'Progress not found in this course' }, { status: 404 })
    }
    
    // 验证数据
    const data = await request.json()
    const validatedData = ProgressUpdateSchema.parse(data)
    
    // 更新教学计划进度
    const updatedProgress = await prisma.teachingPlanProgress.update({
      where: {
        id: progressId,
      },
      data: validatedData,
    })
    
    return NextResponse.json(updatedProgress)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

// DELETE 请求处理 - 删除教学计划进度
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; planId: string; progressId: string } }
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
    const { id, planId, progressId } = params
    
    // 检查教学计划进度是否存在
    const existingProgress = await prisma.teachingPlanProgress.findUnique({
      where: {
        id: progressId,
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
    
    if (!existingProgress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }
    
    // 检查进度是否属于正确的课程
    if (existingProgress.plan.courseId !== id) {
      return NextResponse.json({ error: 'Progress not found in this course' }, { status: 404 })
    }
    
    // 删除教学计划进度
    await prisma.teachingPlanProgress.delete({
      where: {
        id: progressId,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting progress:', error)
    return NextResponse.json(
      { error: 'Failed to delete progress' },
      { status: 500 }
    )
  }
} 