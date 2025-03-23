import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Role } from '../entities/Role';
import logger from '../utils/logger';

export class RoleController {
    private roleRepository = AppDataSource.getRepository(Role);

    // 获取角色列表
    getRoles = async (req: Request, res: Response) => {
        try {
            const roles = await this.roleRepository.find({
                relations: ['permissions']
            });
            res.json(roles);
        } catch (error) {
            logger.error('获取角色列表失败:', error);
            res.status(500).json({ message: '获取角色列表失败' });
        }
    };

    // 创建角色
    createRole = async (req: Request, res: Response) => {
        try {
            const { name, description, permissions } = req.body;
            const role = this.roleRepository.create({
                name,
                description,
                permissions
            });
            await this.roleRepository.save(role);
            res.status(201).json(role);
        } catch (error) {
            logger.error('创建角色失败:', error);
            res.status(500).json({ message: '创建角色失败' });
        }
    };

    // 更新角色
    updateRole = async (req: Request, res: Response) => {
        try {
            const { name, description, permissions } = req.body;
            const role = await this.roleRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ['permissions']
            });

            if (!role) {
                return res.status(404).json({ message: '角色不存在' });
            }

            role.name = name || role.name;
            role.description = description || role.description;
            if (permissions) {
                role.permissions = permissions;
            }

            await this.roleRepository.save(role);
            res.json(role);
        } catch (error) {
            logger.error('更新角色失败:', error);
            res.status(500).json({ message: '更新角色失败' });
        }
    };

    // 删除角色
    deleteRole = async (req: Request, res: Response) => {
        try {
            const role = await this.roleRepository.findOne({
                where: { id: parseInt(req.params.id) }
            });

            if (!role) {
                return res.status(404).json({ message: '角色不存在' });
            }

            await this.roleRepository.remove(role);
            res.status(204).send();
        } catch (error) {
            logger.error('删除角色失败:', error);
            res.status(500).json({ message: '删除角色失败' });
        }
    };
} 