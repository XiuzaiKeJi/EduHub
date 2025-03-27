import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 创建课程时间表请求体验证
const createCourseScheduleSchema = z.object({
  dayOfWeek: z.number().int().min(1, '星期几必须在1-7之间').max(7, '星期几必须在1-7之间'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '开始时间格式必须为HH:MM'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '结束时间格式必须为HH:MM'),
  location: z.string().optional(),
  room: z.string().optional(),
  teacherId: z.string().min(1, '教师ID不能为空')
}).refine(data => {
  // 验证结束时间必须晚于开始时间
  const start = data.startTime.split(':').map(Number);
  const end = data.endTime.split(':').map(Number);
  
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  
  return endMinutes > startMinutes;
}, {
  message: '结束时间必须晚于开始时间',
  path: ['endTime']
});

// GET /api/courses/[id]/schedules
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

    // 查询课程时间表
    const schedules = await prisma.courseSchedule.findMany({
      where: { courseId: id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ],
    })

    // 格式化日期
    const formattedSchedules = schedules.map(schedule => ({
      ...schedule,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error('获取课程时间表失败:', error)
    return NextResponse.json(
      { error: '获取课程时间表失败' },
      { status: 500 }
    )
  }
}

// POST /api/courses/[id]/schedules
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

    // 验证用户权限（只有教师和管理员可以创建课程时间表）
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
        { error: '只能为自己教授的课程创建时间表' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = createCourseScheduleSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const { dayOfWeek, startTime, endTime, location, room, teacherId } = result.data

    // 检查教师是否存在
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
    })

    if (!teacher || teacher.role !== 'TEACHER') {
      return NextResponse.json(
        { error: '指定的教师不存在或不是教师角色' },
        { status: 400 }
      )
    }

    // 检查时间冲突
    // 1. 检查该教师在同一时间段是否有其他课程
    const teacherConflict = await prisma.courseSchedule.findFirst({
      where: {
        teacherId,
        dayOfWeek,
        OR: [
          // 开始时间在现有时间段内
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          // 结束时间在现有时间段内
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          // 时间段完全包含现有时间段
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
        ],
      },
      include: {
        course: {
          select: {
            name: true,
          },
        },
      },
    })

    if (teacherConflict) {
      return NextResponse.json({
        error: '时间冲突',
        details: `教师在所选时间已有课程安排：${teacherConflict.course.name}`,
      }, { status: 409 })
    }

    // 创建课程时间表
    const schedule = await prisma.courseSchedule.create({
      data: {
        courseId: id,
        dayOfWeek,
        startTime,
        endTime,
        location,
        room,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // 格式化日期
    const formattedSchedule = {
      ...schedule,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedSchedule, { status: 201 })
  } catch (error) {
    console.error('创建课程时间表失败:', error)
    return NextResponse.json(
      { error: '创建课程时间表失败' },
      { status: 500 }
    )
  }
} 