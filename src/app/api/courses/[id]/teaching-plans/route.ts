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
  sort: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
})

// 验证创建计划的Schema
const TeachingPlanSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  objectives: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
})

// GET 请求处理 - 获取教学计划列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  // 检查用户是否已登录
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id } = params
    
    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id },
    })
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    // 解析查询参数
    const searchParams = new URL(request.url).searchParams
    const validatedParams = QueryParamsSchema.parse({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      sort: searchParams.get('sort'),
      order: searchParams.get('order'),
      search: searchParams.get('search'),
    })
    
    const { page, pageSize, sort, order, search } = validatedParams
    
    // 构建搜索条件
    const where = {
      courseId: id,
      ...(search ? {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
          { objectives: { contains: search } },
        ],
      } : {}),
    }
    
    // 查询数据
    const [plans, total] = await Promise.all([
      prisma.teachingPlan.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: {
              progress: true,
              resources: true,
            },
          },
        },
      }),
      prisma.teachingPlan.count({ where }),
    ])
    
    return NextResponse.json({
      plans,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('Error fetching teaching plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teaching plans' },
      { status: 500 }
    )
  }
}

// POST 请求处理 - 创建教学计划
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const { id } = params
    
    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id },
    })
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    // 验证数据
    const data = await request.json()
    const validatedData = TeachingPlanSchema.parse(data)
    
    // 创建教学计划
    const teachingPlan = await prisma.teachingPlan.create({
      data: {
        ...validatedData,
        courseId: id,
      },
    })
    
    return NextResponse.json(teachingPlan, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating teaching plan:', error)
    return NextResponse.json(
      { error: 'Failed to create teaching plan' },
      { status: 500 }
    )
  }
} 