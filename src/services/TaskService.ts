import { PrismaClient, Task } from '@prisma/client'
import { CreateTaskInput, UpdateTaskInput, TaskFilters, TaskSortOptions } from '@/types/task'
import { BadRequestError, NotFoundError } from '@/utils/errors'

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  async getTasks(filters: TaskFilters = {}, sort: TaskSortOptions = { field: 'createdAt', direction: 'desc' }): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: filters,
      orderBy: { [sort.field]: sort.direction },
    })
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`)
    }

    return task
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    if (!input.title) {
      throw new BadRequestError('Title is required')
    }

    return this.prisma.task.create({
      data: input,
    })
  }

  async updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`)
    }

    return this.prisma.task.update({
      where: { id },
      data: updates,
    })
  }

  async deleteTask(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`)
    }

    return this.prisma.task.delete({
      where: { id },
    })
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