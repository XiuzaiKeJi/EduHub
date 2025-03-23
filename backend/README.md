# EduHub Backend

## 项目简介

EduHub后端项目采用Node.js + TypeScript开发，提供任务看板系统的核心API服务。

## 技术栈

- Node.js
- TypeScript
- Express.js
- TypeORM
- MySQL

## 项目结构

```
src/
├── config/         # 配置文件
├── controllers/    # 控制器
├── entities/       # 数据实体
├── middlewares/    # 中间件
├── migrations/     # 数据迁移
├── services/       # 业务服务
├── types/          # 类型定义
└── utils/          # 工具函数
```

## 开发指南

1. 安装依赖
```bash
pnpm install
```

2. 配置环境变量
```bash
cp .env.example .env.development
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

## 核心模块

### Task模块
任务管理的核心模块:
- 任务CRUD操作
- 任务状态管理
- 任务优先级设置
- 任务过滤和排序

### Board模块
看板管理模块:
- 看板列配置
- 任务排序
- 状态统计
- 数据导出

## 数据模型

### Task
```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Board
```typescript
interface Board {
  id: number;
  name: string;
  columns: BoardColumn[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 开发规范

### 代码规范
- 使用 TypeScript 类型注解
- 遵循 RESTful API 设计
- 使用 async/await 处理异步
- 统一错误处理

### 数据库规范
- 使用 TypeORM 装饰器
- 定义清晰的实体关系
- 合理使用索引
- 规范命名约定

### API规范
- 版本控制
- 请求参数验证
- 统一响应格式
- 合理的状态码

## 性能优化

- 数据库查询优化
- 请求缓存
- 错误日志
- 安全防护

## 开发命令

```bash
# 开发环境
pnpm dev

# 类型检查
pnpm type-check

# 数据库迁移
pnpm migration:run

# 生成迁移文件
pnpm migration:generate

# 代码检查
pnpm lint

# 单元测试
pnpm test

# 构建
pnpm build
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