import { PrismaClient } from '@prisma/client'
import { TaskService } from '../TaskService'
import { TaskStatus, TaskPriority } from '../../types/task'
import { NotFoundError, BadRequestError } from '../../utils/errors'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

describe('TaskService', () => {
  let prisma: DeepMockProxy<PrismaClient>
  let taskService: TaskService

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>()
    taskService = new TaskService(prisma)
  })

  const mockTask = {
    id: 'task1',
    title: '完成数学作业',
    description: '完成第三章的练习题',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2024-12-31'),
    creatorId: 'user123',
    assigneeId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      prisma.task.create.mockResolvedValue(mockTask)

      const result = await taskService.createTask({
        title: mockTask.title,
        description: mockTask.description,
        status: mockTask.status,
        priority: mockTask.priority,
        dueDate: mockTask.dueDate,
        creatorId: mockTask.creatorId,
      })

      expect(result).toEqual(mockTask)
      expect(prisma.task.create).toHaveBeenCalled()
    })
  })

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask)
      prisma.task.update.mockResolvedValue({
        ...mockTask,
        title: '更新后的标题',
      })

      const result = await taskService.updateTask('task1', {
        title: '更新后的标题',
      })

      expect(result.title).toBe('更新后的标题')
      expect(prisma.task.update).toHaveBeenCalled()
    })

    it('should throw NotFoundError when task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null)

      await expect(
        taskService.updateTask('nonexistent', { title: '新标题' })
      ).rejects.toThrow(NotFoundError)
    })
  })

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask)
      prisma.task.delete.mockResolvedValue(mockTask)

      await taskService.deleteTask('task1')

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 'task1' },
      })
    })

    it('should throw NotFoundError when task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null)

      await expect(taskService.deleteTask('nonexistent')).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe('getTaskById', () => {
    it('should return task when found', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask)

      const result = await taskService.getTaskById('task1')

      expect(result).toEqual(mockTask)
    })

    it('should return null when task not found', async () => {
      prisma.task.findUnique.mockResolvedValue(null)

      const result = await taskService.getTaskById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getTasks', () => {
    it('should return filtered tasks', async () => {
      prisma.task.findMany.mockResolvedValue([mockTask])

      const result = await taskService.getTasks(
        { status: TaskStatus.TODO },
        { field: 'createdAt', direction: 'desc' }
      )

      expect(result).toEqual([mockTask])
      expect(prisma.task.findMany).toHaveBeenCalled()
    })
  })

  describe('assignTask', () => {
    const mockUser = {
      id: 'user456',
      name: '张三',
      email: 'zhangsan@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should assign task successfully', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask)
      prisma.user.findUnique.mockResolvedValue(mockUser)
      prisma.task.update.mockResolvedValue({
        ...mockTask,
        assigneeId: mockUser.id,
      })

      const result = await taskService.assignTask('task1', 'user456')

      expect(result.assigneeId).toBe('user456')
      expect(prisma.task.update).toHaveBeenCalled()
    })

    it('should throw NotFoundError when task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null)

      await expect(
        taskService.assignTask('nonexistent', 'user456')
      ).rejects.toThrow(NotFoundError)
    })

    it('should throw BadRequestError when user does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask)
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(
        taskService.assignTask('task1', 'nonexistent')
      ).rejects.toThrow(BadRequestError)
    })
  })
}) 