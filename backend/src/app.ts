import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import logger from './utils/logger';
import { initDatabase } from './config/database';
import authRoutes from './routes/auth.routes';

// 加载环境变量
dotenv.config({
  path: path.join(__dirname, '..', process.env.NODE_ENV === 'production' ? '.env' : '.env.development'),
});

// 创建Express应用
const app = express();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// 初始化数据库
initDatabase()
  .then(() => {
    logger.info('数据库初始化成功');
  })
  .catch((error) => {
    logger.error('数据库初始化失败:', error);
    process.exit(1);
  });

// 路由配置
app.use('/api/auth', authRoutes);

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('未处理的错误:', err);
  res.status(500).json({
    status: 'error',
    message: '服务器内部错误',
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`服务器正在运行，端口: ${PORT}`);
}); 