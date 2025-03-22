# EduHub 后端项目

## 技术栈

- Node.js - JavaScript 运行时
- Express - Web 应用框架
- TypeScript - 类型安全的 JavaScript 超集
- SQLite - 轻量级关系型数据库
- JWT - 用户认证
- Winston - 日志管理
- Socket.IO - 实时通信

## 项目结构

```
src/
├── config/         # 配置文件
│   ├── board/     # 看板控制器
│   ├── task/      # 任务控制器
│   └── user/      # 用户控制器
├── middlewares/    # 中间件
│   ├── auth/      # 认证中间件
│   ├── role/      # 角色中间件
│   └── validate/  # 验证中间件
├── models/         # 数据模型
│   ├── Board.ts   # 看板模型
│   ├── Task.ts    # 任务模型
│   └── User.ts    # 用户模型
├── routes/         # 路由定义
├── services/       # 业务逻辑
│   ├── board/     # 看板服务
│   ├── task/      # 任务服务
│   └── user/      # 用户服务
├── types/          # TypeScript 类型
├── utils/          # 工具函数
└── app.ts          # 应用入口
```

## 开发指南

### 环境要求
- Node.js 18.x 或更高版本
- pnpm 10.x 或更高版本
- SQLite 3.x

### 安装依赖
```bash
pnpm install
```

### 开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 代码检查
```bash
pnpm lint
```

### 代码格式化
```bash
pnpm format
```

### 运行测试
```bash
pnpm test
```

## API 文档

### 认证接口

#### 登录
```typescript
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string",
    "department": "string"
  }
}
```

### 看板接口

#### 获取看板列表
```typescript
GET /api/v1/boards
Authorization: Bearer <token>

Response:
{
  "boards": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "department": "string",
      "createdBy": "string",
      "createdAt": "string"
    }
  ],
  "total": number
}
```

### 任务接口

#### 获取任务列表
```typescript
GET /api/v1/boards/:boardId/tasks
Authorization: Bearer <token>

Response:
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "priority": "string",
      "assignee": "string",
      "dueDate": "string",
      "createdAt": "string"
    }
  ],
  "total": number
}
```

## 开发规范

### 代码规范
- 使用 ESLint 和 Prettier
- 遵循 TypeScript 最佳实践
- 使用异步/await 处理异步操作
- 统一错误处理
- 实时操作使用 Socket.IO

### API 规范
- RESTful API 设计
- 版本控制
- 统一响应格式
- 参数验证
- 实时更新推送

### 数据库规范
- 使用 TypeORM
- 遵循数据库设计最佳实践
- 合理使用索引
- 事务处理
- 并发控制

### 日志规范
- 使用 Winston 日志库
- 分级日志
- 日志轮转
- 错误追踪
- 操作审计

## 数据库

### 表结构
```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT,
  department TEXT,
  created_at DATETIME,
  updated_at DATETIME
);

-- 看板表
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  department TEXT,
  created_by TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 任务表
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  board_id TEXT,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  assignee TEXT,
  due_date DATETIME,
  created_by TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (board_id) REFERENCES boards(id),
  FOREIGN KEY (assignee) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 任务评论表
CREATE TABLE task_comments (
  id TEXT PRIMARY KEY,
  task_id TEXT,
  user_id TEXT,
  content TEXT,
  created_at DATETIME,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 部署说明

### Docker 部署
```bash
# 构建镜像
docker build -t eduhub-backend .

# 运行容器
docker run -d -p 3001:3001 eduhub-backend
```

### 环境变量
```env
NODE_ENV=production
PORT=3001
DB_PATH=/data/eduhub.db
JWT_SECRET=your-secret-key
LOG_LEVEL=info
SOCKET_PATH=/socket.io
```

## 常见问题

### 开发问题
1. 数据库连接失败
   - 检查数据库路径
   - 确保权限正确
   - 验证 SQLite 版本

2. 实时更新不生效
   - 检查 Socket.IO 配置
   - 验证连接状态
   - 确认事件订阅

3. 并发操作冲突
   - 检查锁机制
   - 验证事务隔离级别
   - 实现乐观锁控制

## 更多资源
- [Node.js 文档](https://nodejs.org/)
- [Express 文档](https://expressjs.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [SQLite 文档](https://www.sqlite.org/)
- [Socket.IO 文档](https://socket.io/) 