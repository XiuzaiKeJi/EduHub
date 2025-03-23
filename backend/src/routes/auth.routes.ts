import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// 注册路由
router.post('/register', authController.register.bind(authController));

// 登录路由
router.post('/login', authController.login.bind(authController));

// 获取当前用户信息路由（需要认证）
router.get('/me', authenticateToken, authController.getCurrentUser.bind(authController));

export default router; 