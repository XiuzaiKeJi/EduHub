import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

// 获取任务列表
router.get('/', authenticateToken, taskController.getTasks.bind(taskController));

// 创建任务
router.post('/', authenticateToken, taskController.createTask.bind(taskController));

// 获取单个任务
router.get('/:id', authenticateToken, taskController.getTaskById.bind(taskController));

// 更新任务
router.put('/:id', authenticateToken, taskController.updateTask.bind(taskController));

// 删除任务
router.delete('/:id', authenticateToken, taskController.deleteTask.bind(taskController));

export default router; 