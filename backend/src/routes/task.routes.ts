import { Router } from 'express';
import { authenticate, checkPermission } from '../middleware/auth.middleware';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

// 所有任务路由都需要认证
router.use(authenticate);

// 获取任务列表
router.get('/', checkPermission('task', 'read'), taskController.getTasks.bind(taskController));

// 创建任务
router.post('/', checkPermission('task', 'create'), taskController.createTask.bind(taskController));

// 获取单个任务
router.get('/:id', checkPermission('task', 'read'), taskController.getTaskById.bind(taskController));

// 更新任务
router.put('/:id', checkPermission('task', 'update'), taskController.updateTask.bind(taskController));

// 删除任务
router.delete('/:id', checkPermission('task', 'delete'), taskController.deleteTask.bind(taskController));

// 批量更新任务状态
router.post('/batch/status', checkPermission('task', 'update'), taskController.batchUpdateStatus.bind(taskController));

export default router; 