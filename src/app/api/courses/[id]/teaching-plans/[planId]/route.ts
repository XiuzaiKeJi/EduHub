import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { z } from 'zod'

const prisma = new PrismaClient()

// 验证更新计划的Schema
const TeachingPlanUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  objectives: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
})

// GET 请求处理 - 获取单个教学计划
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; planId: string } }
) {
  const session = await getServerSession(authOptions)
  
  // 检查用户是否已登录
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id, planId } = params
    
    // 查询教学计划
    const teachingPlan = await prisma.teachingPlan.findUnique({
      where: {
        id: planId,
        courseId: id,
      },
      include: {
        progress: {
          orderBy: {
            weekNumber: 'asc',
          },
        },
        resources: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })
    
    if (!teachingPlan) {
      return NextResponse.json({ error: 'Teaching plan not found' }, { status: 404 })
    }
    
    return NextResponse.json(teachingPlan)
  } catch (error) {
    console.error('Error fetching teaching plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teaching plan' },
      { status: 500 }
    )
  }
}

// PATCH 请求处理 - 更新教学计划
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; planId: string } }
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
    const { id, planId } = params
    
    // 检查教学计划是否存在
    const existingPlan = await prisma.teachingPlan.findUnique({
      where: {
        id: planId,
        courseId: id,
      },
    })
    
    if (!existingPlan) {
      return NextResponse.json({ error: 'Teaching plan not found' }, { status: 404 })
    }
    
    // 验证数据
    const data = await request.json()
    const validatedData = TeachingPlanUpdateSchema.parse(data)
    
    // 更新教学计划
    const updatedPlan = await prisma.teachingPlan.update({
      where: {
        id: planId,
      },
      data: validatedData,
    })
    
    return NextResponse.json(updatedPlan)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating teaching plan:', error)
    return NextResponse.json(
      { error: 'Failed to update teaching plan' },
      { status: 500 }
    )
  }
}

// DELETE 请求处理 - 删除教学计划
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; planId: string } }
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
    const { id, planId } = params
    
    // 检查教学计划是否存在
    const existingPlan = await prisma.teachingPlan.findUnique({
      where: {
        id: planId,
        courseId: id,
      },
    })
    
    if (!existingPlan) {
      return NextResponse.json({ error: 'Teaching plan not found' }, { status: 404 })
    }
    
    // 删除教学计划
    await prisma.teachingPlan.delete({
      where: {
        id: planId,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting teaching plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete teaching plan' },
      { status: 500 }
    )
  }
} 