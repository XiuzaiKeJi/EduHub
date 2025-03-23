import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import logger from './utils/logger';

// 加载环境变量（在其他导入之前）
const envPath = path.resolve(__dirname, '..', '..', process.env.NODE_ENV === 'production' ? '.env' : '.env.development');
dotenv.config({ path: envPath });
logger.info(`加载环境变量文件: ${envPath}`);
logger.info(`当前环境: ${process.env.NODE_ENV}`);
logger.info(`服务端口: ${process.env.PORT}`);
logger.info(`数据库配置: ${JSON.stringify({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
})}`);

// 导入其他模块
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import adminRoutes from './routes/admin.routes';
import morgan from 'morgan';

// 创建Express应用
const app = express();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({
  origin: (origin, callback) => {
    // 允许本地开发环境的请求
    if (!origin || origin.match(/^http:\/\/localhost:(5173|5174|5175)$/)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的来源'));
    }
  },
  credentials: true,
}));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

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
async function startServer() {
  try {
    // 初始化数据库连接
    await AppDataSource.initialize();
    logger.info('数据库连接初始化成功');

    // 运行迁移
    const pendingMigrations = await AppDataSource.showMigrations();
    if (pendingMigrations) {
      logger.info('正在运行数据库迁移...');
      await AppDataSource.runMigrations();
      logger.info('数据库迁移完成');
    }

    // 启动服务器
    const port = Number(process.env.PORT) || 3001;
    app.listen(port, '0.0.0.0', () => {
      logger.info(`服务器正在运行，端口: ${port}`);
    });
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer().catch(error => {
  logger.error('启动过程中发生错误:', error);
  process.exit(1);
}); 