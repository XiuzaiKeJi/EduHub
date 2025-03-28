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
  sort: z.string().optional().default('order'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  type: z.string().optional(),
})

// 验证创建资源的Schema
const ResourceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  url: z.string(),
  size: z.number().optional(),
  format: z.string().optional(),
  order: z.number().optional().default(0),
})

// GET 请求处理 - 获取教学计划资源列表
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
      type: searchParams.get('type'),
    })
    
    const { page, pageSize, sort, order, type } = validatedParams
    
    // 构建搜索条件
    const where = {
      planId,
      ...(type ? { type } : {}),
    }
    
    // 查询数据
    const [resources, total] = await Promise.all([
      prisma.teachingPlanResource.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.teachingPlanResource.count({ where }),
    ])
    
    return NextResponse.json({
      resources,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('Error fetching teaching plan resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teaching plan resources' },
      { status: 500 }
    )
  }
}

// POST 请求处理 - 创建教学计划资源
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
    const validatedData = ResourceSchema.parse(data)
    
    // 创建教学计划资源
    const resource = await prisma.teachingPlanResource.create({
      data: {
        ...validatedData,
        planId,
      },
    })
    
    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating teaching plan resource:', error)
    return NextResponse.json(
      { error: 'Failed to create teaching plan resource' },
      { status: 500 }
    )
  }
} 