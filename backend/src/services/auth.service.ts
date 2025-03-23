import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { PasswordUtils } from '../utils/password';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { UnauthorizedError } from '../utils/errors';

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  static async register(username: string, email: string, password: string) {
    try {
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('邮箱已被注册');
      }

      const user = userRepository.create({
        username,
        email,
        password,
        isActive: true
      });

      await userRepository.save(user);

      const token = this.generateToken(user);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      };
    } catch (error) {
      logger.error('注册失败:', error);
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      const user = await userRepository.findOne({
        where: { email },
        relations: ['roles', 'roles.permissions']
      });

      if (!user) {
        throw new Error('用户不存在');
      }

      const isValid = await user.verifyPassword(password);
      if (!isValid) {
        throw new Error('密码错误');
      }

      user.lastLoginAt = new Date();
      await userRepository.save(user);

      const token = this.generateToken(user);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          roles: user.roles
        },
        token
      };
    } catch (error) {
      logger.error('登录失败:', error);
      throw error;
    }
  }

  static async getCurrentUser(userId: number) {
    try {
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.permissions']
      });

      if (!user) {
        throw new Error('用户不存在');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.roles
      };
    } catch (error) {
      logger.error('获取用户信息失败:', error);
      throw error;
    }
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  static async assignRole(userId: number, roleIds: number[]) {
    try {
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
      });

      if (!user) {
        throw new Error('用户不存在');
      }

      const roles = await roleRepository.findByIds(roleIds);
      if (roles.length !== roleIds.length) {
        throw new Error('部分角色不存在');
      }

      user.roles = roles;
      await userRepository.save(user);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.roles
      };
    } catch (error) {
      logger.error('分配角色失败:', error);
      throw error;
    }
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
} 