import { Router } from 'express'
import { TaskController } from '../controllers/TaskController'
import { TaskService } from '../services/TaskService'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../middleware/auth'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
const prisma = new PrismaClient()
const taskService = new TaskService(prisma)
const taskController = new TaskController(taskService)

// 所有任务路由都需要认证
router.use(authenticateUser)

// 任务CRUD路由
router.post('/', asyncHandler(taskController.createTask))
router.put('/:id', asyncHandler(taskController.updateTask))
router.delete('/:id', asyncHandler(taskController.deleteTask))
router.get('/:id', asyncHandler(taskController.getTask))
router.get('/', asyncHandler(taskController.getTasks))

// 任务分配路由
router.post('/:id/assign', asyncHandler(taskController.assignTask))

export default router 