import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 更新课程时间表请求体验证
const updateCourseScheduleSchema = z.object({
  dayOfWeek: z.number().int().min(1, '星期几必须在1-7之间').max(7, '星期几必须在1-7之间').optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '开始时间格式必须为HH:MM').optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '结束时间格式必须为HH:MM').optional(),
  location: z.string().optional(),
  room: z.string().optional(),
  teacherId: z.string().min(1, '教师ID不能为空').optional()
}).refine(data => {
  // 如果同时提供了开始时间和结束时间，验证结束时间必须晚于开始时间
  if (data.startTime && data.endTime) {
    const start = data.startTime.split(':').map(Number);
    const end = data.endTime.split(':').map(Number);
    
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    return endMinutes > startMinutes;
  }
  return true;
}, {
  message: '结束时间必须晚于开始时间',
  path: ['endTime']
});

// GET /api/courses/[id]/schedules/[scheduleId]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, scheduleId: string } }
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

    const { id, scheduleId } = params

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
    const schedule = await prisma.courseSchedule.findUnique({
      where: { 
        id: scheduleId,
        courseId: id
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      }
    })

    if (!schedule) {
      return NextResponse.json(
        { error: '课程时间表不存在' },
        { status: 404 }
      )
    }

    // 格式化日期
    const formattedSchedule = {
      ...schedule,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedSchedule)
  } catch (error) {
    console.error('获取课程时间表详情失败:', error)
    return NextResponse.json(
      { error: '获取课程时间表详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/courses/[id]/schedules/[scheduleId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string, scheduleId: string } }
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

    // 验证用户权限（只有教师和管理员可以更新课程时间表）
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id, scheduleId } = params

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
        { error: '只能更新自己教授的课程的时间表' },
        { status: 403 }
      )
    }

    // 检查课程时间表是否存在
    const existingSchedule = await prisma.courseSchedule.findUnique({
      where: {
        id: scheduleId,
        courseId: id
      }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: '课程时间表不存在' },
        { status: 404 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const result = updateCourseScheduleSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: result.error.format() },
        { status: 400 }
      )
    }

    const updateData = result.data

    // 如果更新了教师，检查教师是否存在
    if (updateData.teacherId) {
      const teacher = await prisma.user.findUnique({
        where: { id: updateData.teacherId },
      })

      if (!teacher || teacher.role !== 'TEACHER') {
        return NextResponse.json(
          { error: '指定的教师不存在或不是教师角色' },
          { status: 400 }
        )
      }
    }

    // 计算要用于检查冲突的数据
    const dayOfWeek = updateData.dayOfWeek ?? existingSchedule.dayOfWeek
    const startTime = updateData.startTime ?? existingSchedule.startTime
    const endTime = updateData.endTime ?? existingSchedule.endTime
    const teacherId = updateData.teacherId ?? existingSchedule.teacherId

    // 检查时间冲突，排除当前记录
    if (updateData.dayOfWeek || updateData.startTime || updateData.endTime || updateData.teacherId) {
      const teacherConflict = await prisma.courseSchedule.findFirst({
        where: {
          id: { not: scheduleId }, // 排除当前记录
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
    }

    // 更新课程时间表
    const updatedSchedule = await prisma.courseSchedule.update({
      where: {
        id: scheduleId,
      },
      data: updateData,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      }
    })

    // 格式化日期
    const formattedSchedule = {
      ...updatedSchedule,
      createdAt: updatedSchedule.createdAt.toISOString(),
      updatedAt: updatedSchedule.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedSchedule)
  } catch (error) {
    console.error('更新课程时间表失败:', error)
    return NextResponse.json(
      { error: '更新课程时间表失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id]/schedules/[scheduleId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, scheduleId: string } }
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

    // 验证用户权限（只有教师和管理员可以删除课程时间表）
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { id, scheduleId } = params

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
        { error: '只能删除自己教授的课程的时间表' },
        { status: 403 }
      )
    }

    // 检查课程时间表是否存在
    const schedule = await prisma.courseSchedule.findUnique({
      where: {
        id: scheduleId,
        courseId: id
      }
    })

    if (!schedule) {
      return NextResponse.json(
        { error: '课程时间表不存在' },
        { status: 404 }
      )
    }

    // 删除课程时间表
    await prisma.courseSchedule.delete({
      where: { id: scheduleId }
    })

    return NextResponse.json(
      { message: '课程时间表删除成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除课程时间表失败:', error)
    return NextResponse.json(
      { error: '删除课程时间表失败' },
      { status: 500 }
    )
  }
} 