import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Permission } from '../entities/Permission';
import logger from '../utils/logger';

export class PermissionController {
    private permissionRepository = AppDataSource.getRepository(Permission);

    // 获取所有权限
    async getPermissions(req: Request, res: Response) {
        try {
            const permissions = await this.permissionRepository.find();
            res.json(permissions);
        } catch (error) {
            logger.error('获取权限列表失败:', error);
            res.status(500).json({ message: '获取权限列表失败' });
        }
    }

    // 创建权限
    async createPermission(req: Request, res: Response) {
        try {
            const { name, description, resource, action } = req.body;

            // 验证权限名是否已存在
            const existingPermission = await this.permissionRepository.findOne({ where: { name } });
            if (existingPermission) {
                return res.status(400).json({ message: '权限名已存在' });
            }

            // 创建新权限
            const permission = this.permissionRepository.create({
                name,
                description,
                resource,
                action
            });

            await this.permissionRepository.save(permission);
            res.status(201).json(permission);
        } catch (error) {
            logger.error('创建权限失败:', error);
            res.status(500).json({ message: '创建权限失败' });
        }
    }

    // 更新权限
    async updatePermission(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, resource, action } = req.body;

            const permission = await this.permissionRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!permission) {
                return res.status(404).json({ message: '权限不存在' });
            }

            // 如果要更改权限名，检查是否与其他权限冲突
            if (name && name !== permission.name) {
                const existingPermission = await this.permissionRepository.findOne({ where: { name } });
                if (existingPermission) {
                    return res.status(400).json({ message: '权限名已存在' });
                }
                permission.name = name;
            }

            if (description) permission.description = description;
            if (resource) permission.resource = resource;
            if (action) permission.action = action;

            await this.permissionRepository.save(permission);
            res.json(permission);
        } catch (error) {
            logger.error('更新权限失败:', error);
            res.status(500).json({ message: '更新权限失败' });
        }
    }

    // 删除权限
    async deletePermission(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const permission = await this.permissionRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!permission) {
                return res.status(404).json({ message: '权限不存在' });
            }

            // 检查是否是系统预设权限
            if (permission.name.startsWith('system:')) {
                return res.status(403).json({ message: '不能删除系统预设权限' });
            }

            await this.permissionRepository.remove(permission);
            res.status(204).send();
        } catch (error) {
            logger.error('删除权限失败:', error);
            res.status(500).json({ message: '删除权限失败' });
        }
    }
} 