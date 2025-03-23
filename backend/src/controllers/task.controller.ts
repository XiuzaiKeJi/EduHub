import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Task, TaskStatus, TaskPriority } from '../entities/Task';
import logger from '../utils/logger';

export class TaskController {
    private taskRepository = AppDataSource.getRepository(Task);

    // 获取任务列表
    getTasks = async (req: Request, res: Response) => {
        try {
            const { status, priority, isArchived, page = 1, limit = 10 } = req.query;
            const queryBuilder = this.taskRepository.createQueryBuilder('task')
                .where('task.userId = :userId', { userId: req.user?.id });

            // 添加筛选条件
            if (status) {
                queryBuilder.andWhere('task.status = :status', { status });
            }
            if (priority) {
                queryBuilder.andWhere('task.priority = :priority', { priority });
            }
            if (isArchived !== undefined) {
                queryBuilder.andWhere('task.isArchived = :isArchived', { isArchived });
            }

            // 添加排序
            queryBuilder.orderBy('task.createdAt', 'DESC');

            // 添加分页
            const skip = (Number(page) - 1) * Number(limit);
            queryBuilder.skip(skip).take(Number(limit));

            // 执行查询
            const [tasks, total] = await queryBuilder.getManyAndCount();

            res.json({
                tasks,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error) {
            logger.error('获取任务列表失败:', error);
            res.status(500).json({ message: '获取任务列表失败' });
        }
    };

    // 创建任务
    createTask = async (req: Request, res: Response) => {
        try {
            const {
                title,
                description,
                status = TaskStatus.PENDING,
                priority = TaskPriority.MEDIUM,
                dueDate,
                isArchived = false
            } = req.body;

            const task = this.taskRepository.create({
                title,
                description,
                status,
                priority,
                dueDate,
                isArchived,
                userId: req.user?.id
            });

            await this.taskRepository.save(task);
            res.status(201).json(task);
        } catch (error) {
            logger.error('创建任务失败:', error);
            res.status(500).json({ message: '创建任务失败' });
        }
    };

    // 获取单个任务
    getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await this.taskRepository.findOne({
                where: { 
                    id: parseInt(req.params.id),
                    userId: req.user?.id
                }
            });
            if (!task) {
                return res.status(404).json({ message: '任务不存在' });
            }
            res.json(task);
        } catch (error) {
            logger.error('获取任务详情失败:', error);
            res.status(500).json({ message: '获取任务详情失败' });
        }
    };

    // 更新任务
    updateTask = async (req: Request, res: Response) => {
        try {
            const {
                title,
                description,
                status,
                priority,
                dueDate,
                isArchived
            } = req.body;

            const task = await this.taskRepository.findOne({
                where: { 
                    id: parseInt(req.params.id),
                    userId: req.user?.id
                }
            });
            
            if (!task) {
                return res.status(404).json({ message: '任务不存在' });
            }

            // 更新任务状态时，如果是完成状态，设置完成时间
            if (status === TaskStatus.COMPLETED) {
                task.completedAt = new Date();
            } else if (task.status === TaskStatus.COMPLETED && status !== TaskStatus.COMPLETED) {
                task.completedAt = null;
            }

            // 更新任务字段
            Object.assign(task, {
                title: title || task.title,
                description: description || task.description,
                status: status || task.status,
                priority: priority || task.priority,
                dueDate: dueDate || task.dueDate,
                isArchived: isArchived !== undefined ? isArchived : task.isArchived
            });
            
            await this.taskRepository.save(task);
            res.json(task);
        } catch (error) {
            logger.error('更新任务失败:', error);
            res.status(500).json({ message: '更新任务失败' });
        }
    };

    // 删除任务
    deleteTask = async (req: Request, res: Response) => {
        try {
            const task = await this.taskRepository.findOne({
                where: { 
                    id: parseInt(req.params.id),
                    userId: req.user?.id
                }
            });
            
            if (!task) {
                return res.status(404).json({ message: '任务不存在' });
            }

            await this.taskRepository.remove(task);
            res.status(204).send();
        } catch (error) {
            logger.error('删除任务失败:', error);
            res.status(500).json({ message: '删除任务失败' });
        }
    };

    // 批量更新任务状态
    batchUpdateStatus = async (req: Request, res: Response) => {
        try {
            const { taskIds, status } = req.body;
            
            if (!Array.isArray(taskIds) || !status) {
                return res.status(400).json({ message: '无效的请求参数' });
            }

            const tasks = await this.taskRepository.findByIds(taskIds);
            const updatedTasks = tasks.map(task => {
                if (status === TaskStatus.COMPLETED) {
                    task.completedAt = new Date();
                } else if (task.status === TaskStatus.COMPLETED && status !== TaskStatus.COMPLETED) {
                    task.completedAt = null;
                }
                task.status = status;
                return task;
            });

            await this.taskRepository.save(updatedTasks);
            res.json(updatedTasks);
        } catch (error) {
            logger.error('批量更新任务状态失败:', error);
            res.status(500).json({ message: '批量更新任务状态失败' });
        }
    };
} 