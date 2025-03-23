import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../utils/logger';

export class AuthController {
  // 用户注册
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      // 验证请求数据
      if (!username || !email || !password) {
        res.status(400).json({ message: '请提供所有必需的字段' });
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: '无效的邮箱格式' });
        return;
      }

      // 验证密码强度
      if (password.length < 6) {
        res.status(400).json({ message: '密码长度必须至少为6个字符' });
        return;
      }

      const user = await AuthService.register(username, email, password);
      res.status(201).json({ message: '注册成功', user });
    } catch (error: any) {
      logger.error('注册失败:', error);
      res.status(400).json({ message: error.message || '注册失败' });
    }
  }

  // 用户登录
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // 验证请求数据
      if (!email || !password) {
        res.status(400).json({ message: '请提供邮箱和密码' });
        return;
      }

      const result = await AuthService.login(email, password);
      res.json({ message: '登录成功', ...result });
    } catch (error: any) {
      logger.error('登录失败:', error);
      res.status(401).json({ message: error.message || '登录失败' });
    }
  }

  // 获取当前用户信息
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: '未授权' });
        return;
      }

      const user = await AuthService.getCurrentUser(userId);
      res.json({ user });
    } catch (error: any) {
      logger.error('获取用户信息失败:', error);
      res.status(400).json({ message: error.message || '获取用户信息失败' });
    }
  }
} 