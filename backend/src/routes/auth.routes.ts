import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// 注册路由
router.post('/register', (req, res) => authController.register(req, res));

// 登录路由
router.post('/login', (req, res) => authController.login(req, res));

// 获取当前用户信息路由（需要认证）
router.get('/me', authenticate, (req, res) => authController.getCurrentUser(req, res));

export default router; 