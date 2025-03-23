import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import logger from '../utils/logger';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: '未提供认证令牌' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOne({
            where: { id: decoded.id },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            return res.status(401).json({ message: '用户不存在' });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('认证失败:', error);
        res.status(401).json({ message: '认证失败' });
    }
};

export const checkPermission = (resource: string, action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: '未认证' });
            }

            const requiredPermission = `${resource}:${action}`;
            const hasPermission = req.user.roles.some(role =>
                role.permissions.some(permission => permission.name === requiredPermission)
            );

            if (!hasPermission) {
                return res.status(403).json({ message: '没有权限执行此操作' });
            }

            next();
        } catch (error) {
            logger.error('权限检查失败:', error);
            res.status(500).json({ message: '权限检查失败' });
        }
    };
};

export const checkRole = (roleNames: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: '未认证' });
            }

            const hasRole = req.user.roles.some(role => roleNames.includes(role.name));

            if (!hasRole) {
                return res.status(403).json({ message: '没有足够的角色权限' });
            }

            next();
        } catch (error) {
            logger.error('角色检查失败:', error);
            res.status(500).json({ message: '角色检查失败' });
        }
    };
}; 