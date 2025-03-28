import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { z } from 'zod'

const prisma = new PrismaClient()

// 验证查询参数的Schema
const QueryParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(10),
  sort: z.string().optional().default('weekNumber'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  status: z.string().optional(),
})

// 验证创建进度的Schema
const ProgressSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  weekNumber: z.number().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']).default('PLANNED'),
  completionRate: z.number().min(0).max(100).default(0),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  note: z.string().optional(),
})

// GET 请求处理 - 获取教学计划进度列表
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
    
    // 检查教学计划是否存在
    const teachingPlan = await prisma.teachingPlan.findUnique({
      where: {
        id: planId,
        courseId: id,
      },
    })
    
    if (!teachingPlan) {
      return NextResponse.json({ error: 'Teaching plan not found' }, { status: 404 })
    }
    
    // 解析查询参数
    const searchParams = new URL(request.url).searchParams
    const validatedParams = QueryParamsSchema.parse({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      sort: searchParams.get('sort'),
      order: searchParams.get('order'),
      status: searchParams.get('status'),
    })
    
    const { page, pageSize, sort, order, status } = validatedParams
    
    // 构建搜索条件
    const where = {
      planId,
      ...(status ? { status } : {}),
    }
    
    // 查询数据
    const [progress, total] = await Promise.all([
      prisma.teachingPlanProgress.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.teachingPlanProgress.count({ where }),
    ])
    
    return NextResponse.json({
      progress,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('Error fetching teaching plan progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teaching plan progress' },
      { status: 500 }
    )
  }
}

// POST 请求处理 - 创建教学计划进度
export async function POST(
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
    const teachingPlan = await prisma.teachingPlan.findUnique({
      where: {
        id: planId,
        courseId: id,
      },
    })
    
    if (!teachingPlan) {
      return NextResponse.json({ error: 'Teaching plan not found' }, { status: 404 })
    }
    
    // 验证数据
    const data = await request.json()
    const validatedData = ProgressSchema.parse(data)
    
    // 创建教学计划进度
    const progress = await prisma.teachingPlanProgress.create({
      data: {
        ...validatedData,
        planId,
      },
    })
    
    return NextResponse.json(progress, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating teaching plan progress:', error)
    return NextResponse.json(
      { error: 'Failed to create teaching plan progress' },
      { status: 500 }
    )
  }
} 