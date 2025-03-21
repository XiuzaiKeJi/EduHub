import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '无效的认证令牌格式' });
    }

    const authService = new AuthService();
    const { userId } = authService.verifyToken(token);
    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: '无效的认证令牌' });
  }
}; 