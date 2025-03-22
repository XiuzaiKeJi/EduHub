import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import moment from 'moment';

// 加载环境变量
dotenv.config({
  path: path.join(__dirname, '..', process.env.NODE_ENV === 'production' ? '.env' : '.env.development'),
});

const app = express();
const port = Number(process.env.PORT) || 3001;
const host = '0.0.0.0'; // 添加host配置，监听所有网络接口

// 设置中文
moment.locale('zh-cn');

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'success',
    message: '后端服务运行正常',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    environment: process.env.NODE_ENV
  });
});

// 路由配置（后续添加）
app.get('/', (req, res) => {
  res.json({ message: 'EduHub API is running' });
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// 启动服务器
app.listen(port, host, () => {
  console.log(`后端服务已启动，监听地址 http://${host}:${port}`);
}); 