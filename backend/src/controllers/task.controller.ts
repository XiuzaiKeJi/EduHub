import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Task } from '../entities/Task';
import logger from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';

export class TaskController {
    private taskRepository = AppDataSource.getRepository(Task);

    // 获取任务列表
    getTasks = async (req: AuthRequest, res: Response) => {
        try {
            const tasks = await this.taskRepository.find({
                where: { userId: req.user?.id },
                order: { createdAt: 'DESC' }
            });
            res.json(tasks);
        } catch (error) {
            logger.error('获取任务列表失败:', error);
            res.status(500).json({ message: '获取任务列表失败' });
        }
    };

    // 创建任务
    createTask = async (req: AuthRequest, res: Response) => {
        try {
            const { title, description, status = 'pending' } = req.body;
            const task = this.taskRepository.create({
                title,
                description,
                status,
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
    getTaskById = async (req: AuthRequest, res: Response) => {
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
    updateTask = async (req: AuthRequest, res: Response) => {
        try {
            const { title, description, status } = req.body;
            const task = await this.taskRepository.findOne({
                where: { 
                    id: parseInt(req.params.id),
                    userId: req.user?.id
                }
            });
            
            if (!task) {
                return res.status(404).json({ message: '任务不存在' });
            }

            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;
            
            await this.taskRepository.save(task);
            res.json(task);
        } catch (error) {
            logger.error('更新任务失败:', error);
            res.status(500).json({ message: '更新任务失败' });
        }
    };

    // 删除任务
    deleteTask = async (req: AuthRequest, res: Response) => {
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
} 