import { PrismaClient, Task } from '@prisma/client'
import { CreateTaskInput, UpdateTaskInput, TaskFilters, TaskSortOptions } from '../types/task'
import { BadRequestError, NotFoundError } from '../utils/errors'

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  async createTask(data: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } })
    if (!task) {
      throw new NotFoundError('任务不存在')
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.prisma.task.findUnique({ where: { id } })
    if (!task) {
      throw new NotFoundError('任务不存在')
    }

    await this.prisma.task.delete({ where: { id } })
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        creator: true,
      },
    })
  }

  async getTasks(filters: TaskFilters, sort: TaskSortOptions): Promise<Task[]> {
    const where = {
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.creatorId && { creatorId: filters.creatorId }),
    }

    return this.prisma.task.findMany({
      where,
      orderBy: {
        [sort.field]: sort.direction,
      },
      include: {
        assignee: true,
        creator: true,
      },
    })
  }

  async assignTask(taskId: string, assigneeId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } })
    if (!task) {
      throw new NotFoundError('任务不存在')
    }

    const user = await this.prisma.user.findUnique({ where: { id: assigneeId } })
    if (!user) {
      throw new BadRequestError('指定的用户不存在')
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
      include: {
        assignee: true,
        creator: true,
      },
    })
  }
} 