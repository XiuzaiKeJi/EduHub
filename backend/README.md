# EduHub Backend

基于 Node.js + Express + TypeScript 的管理后台后端项目。

## 开发环境

- Node.js >= 18.20.6
- pnpm >= 10.6.5
- TypeScript 5.8.2
- Express 4.21.2

## 项目依赖

- Express - Web框架
- SQLite3 - 数据库
- JWT - 身份认证
- CORS - 跨域支持
- dotenv - 环境变量管理

## 快速开始

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
pnpm dev
```

3. 构建生产版本：
```bash
pnpm build
```

## 项目结构

```
src/
├── controllers/ # 控制器
├── models/      # 数据模型
├── routes/      # 路由定义
├── services/    # 业务逻辑
└── utils/       # 工具函数
```

## API文档

### 认证相关
- POST /api/v1/auth/login - 用户登录
- POST /api/v1/auth/register - 用户注册
- POST /api/v1/auth/logout - 用户登出

### 用户管理
- GET /api/v1/users - 获取用户列表
- GET /api/v1/users/:id - 获取用户详情
- PUT /api/v1/users/:id - 更新用户信息
- DELETE /api/v1/users/:id - 删除用户

## 开发规范

1. API设计
- RESTful风格
- 版本控制
- 统一响应格式
- 错误处理标准化

2. 代码规范
- 使用TypeScript严格模式
- 异步操作使用async/await
- 错误处理使用try/catch
- 使用依赖注入模式

3. 数据库
- 使用TypeORM
- 遵循数据库设计规范
- 必要时使用事务
- 定期备份数据

## 环境变量

开发环境（.env.development）：
- PORT=3001
- NODE_ENV=development
- API_SECRET=your_dev_api_secret
- JWT_SECRET=your_dev_jwt_secret
- DB_PATH=./data/dev.sqlite
- CORS_ORIGIN=http://localhost:3000

生产环境（.env.production）：
- PORT=3001
- NODE_ENV=production
- API_SECRET=your_prod_api_secret
- JWT_SECRET=your_prod_jwt_secret
- DB_PATH=./data/prod.sqlite
- CORS_ORIGIN=https://eduhub.com

## 部署指南

1. 构建项目：
```bash
pnpm build
```

2. 启动服务：
```bash
pnpm start
```

3. 使用PM2部署：
```bash
pm2 start dist/main.js --name eduhub-backend
``` 