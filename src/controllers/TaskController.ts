import { Request, Response } from 'express'
import { TaskService } from '../services/TaskService'
import { TaskSchema, TaskStatus, TaskPriority } from '../types/task'
import { validateRequest } from '../middleware/validateRequest'

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (req: Request, res: Response) => {
    const validatedData = validateRequest(TaskSchema, req.body)
    const task = await this.taskService.createTask({
      ...validatedData,
      creatorId: req.user!.id,
    })
    res.status(201).json(task)
  }

  updateTask = async (req: Request, res: Response) => {
    const { id } = req.params
    const validatedData = validateRequest(TaskSchema.partial(), req.body)
    const task = await this.taskService.updateTask(id, validatedData)
    res.json(task)
  }

  deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params
    await this.taskService.deleteTask(id)
    res.status(204).send()
  }

  getTask = async (req: Request, res: Response) => {
    const { id } = req.params
    const task = await this.taskService.getTaskById(id)
    if (!task) {
      res.status(404).json({ message: '任务不存在' })
      return
    }
    res.json(task)
  }

  getTasks = async (req: Request, res: Response) => {
    const {
      status,
      priority,
      assigneeId,
      creatorId,
      sortField = 'createdAt',
      sortDirection = 'desc',
    } = req.query

    const filters = {
      ...(status && { status: status as TaskStatus }),
      ...(priority && { priority: priority as TaskPriority }),
      ...(assigneeId && { assigneeId: assigneeId as string }),
      ...(creatorId && { creatorId: creatorId as string }),
    }

    const sort = {
      field: sortField as string,
      direction: sortDirection as 'asc' | 'desc',
    }

    const tasks = await this.taskService.getTasks(filters, sort)
    res.json(tasks)
  }

  assignTask = async (req: Request, res: Response) => {
    const { id } = req.params
    const { assigneeId } = req.body

    if (!assigneeId) {
      res.status(400).json({ message: '缺少assigneeId参数' })
      return
    }

    const task = await this.taskService.assignTask(id, assigneeId)
    res.json(task)
  }
} 