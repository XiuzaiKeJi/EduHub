import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import logger from './utils/logger';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import morgan from 'morgan';

// 加载环境变量
dotenv.config({
  path: path.join(__dirname, '..', process.env.NODE_ENV === 'production' ? '.env' : '.env.development'),
});

// 创建Express应用
const app = express();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('服务器错误:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || '服务器内部错误',
      status: err.status || 500
    }
  });
});

// 数据库连接和服务器启动
AppDataSource.initialize()
  .then(() => {
    logger.info('数据库连接初始化成功');
    const port = process.env.PORT || 8080;
    app.listen(port, '0.0.0.0', () => {
      logger.info(`服务器正在运行，端口: ${port}`);
    });
  })
  .catch((error) => {
    logger.error('数据库连接初始化失败:', error);
    process.exit(1);
  }); 