import { AppDataSource } from '../config/database';
import { Permission } from '../entities/Permission';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import logger from '../utils/logger';

export class PermissionService {
    private permissionRepository = AppDataSource.getRepository(Permission);
    private roleRepository = AppDataSource.getRepository(Role);
    private userRepository = AppDataSource.getRepository(User);

    // 检查用户是否有特定权限
    async hasPermission(userId: number, resource: string, action: string): Promise<boolean> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['roles', 'roles.permissions']
            });

            if (!user) {
                return false;
            }

            // 检查用户是否是超级管理员
            const isAdmin = user.roles.some(role => role.name === 'admin');
            if (isAdmin) {
                return true;
            }

            // 检查用户的所有角色是否有对应的权限
            return user.roles.some(role =>
                role.permissions.some(permission =>
                    permission.resource === resource && permission.action === action
                )
            );
        } catch (error) {
            logger.error('检查权限失败:', error);
            return false;
        }
    }

    // 获取用户的所有权限
    async getUserPermissions(userId: number): Promise<Permission[]> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['roles', 'roles.permissions']
            });

            if (!user) {
                return [];
            }

            // 收集所有角色的权限并去重
            const permissions = new Set<Permission>();
            user.roles.forEach(role => {
                role.permissions.forEach(permission => {
                    permissions.add(permission);
                });
            });

            return Array.from(permissions);
        } catch (error) {
            logger.error('获取用户权限失败:', error);
            return [];
        }
    }

    // 为角色分配权限
    async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<Role | null> {
        try {
            const role = await this.roleRepository.findOne({
                where: { id: roleId },
                relations: ['permissions']
            });

            if (!role) {
                return null;
            }

            const permissions = await this.permissionRepository.findByIds(permissionIds);
            role.permissions = permissions;
            await this.roleRepository.save(role);

            return role;
        } catch (error) {
            logger.error('分配权限失败:', error);
            return null;
        }
    }

    // 为用户分配角色
    async assignRolesToUser(userId: number, roleIds: number[]): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['roles']
            });

            if (!user) {
                return null;
            }

            const roles = await this.roleRepository.findByIds(roleIds);
            user.roles = roles;
            await this.userRepository.save(user);

            return user;
        } catch (error) {
            logger.error('分配角色失败:', error);
            return null;
        }
    }
} 