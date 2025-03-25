# 技术规范文档

## 1. 技术栈

### 1.1 核心框架
- Next.js 14
- React 18
- TypeScript 5

### 1.2 数据层
- Prisma ORM
- SQLite 数据库

### 1.3 认证与安全
- NextAuth.js
- Zod 数据验证

### 1.4 样式与UI
- Tailwind CSS
- PostCSS
- Autoprefixer

## 2. 开发规范

### 2.1 代码风格
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用函数组件和 Hooks
- 遵循 React 最佳实践

### 2.2 项目结构
```
src/
├── app/                    # Next.js App Router 页面
│   ├── (auth)/            # 认证相关页面
│   │   ├── login/        # 登录页面
│   │   └── register/     # 注册页面
│   ├── (dashboard)/      # 仪表板页面
│   │   ├── tasks/       # 任务管理
│   │   ├── teaching/    # 教务管理
│   │   ├── team/        # 团队协作
│   │   └── reports/     # 数据统计
│   └── api/              # API 路由
├── components/           # React 组件
│   ├── ui/              # UI 基础组件
│   │   ├── board/      # 看板组件
│   │   ├── task/       # 任务组件
│   │   └── common/     # 通用组件
│   └── features/        # 功能组件
│       ├── teaching/   # 教务相关
│       ├── team/       # 团队相关
│       └── reports/    # 统计相关
├── lib/                  # 工具函数和共享逻辑
│   ├── auth/            # 认证相关
│   ├── db/              # 数据库相关
│   ├── teaching/        # 教务相关
│   └── utils/           # 通用工具
└── types/               # TypeScript 类型定义
    ├── task.ts         # 任务类型
    ├── teaching.ts     # 教务类型
    └── user.ts         # 用户类型
```

### 2.3 命名规范
- 组件使用 PascalCase
- 函数和变量使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 类型和接口使用 PascalCase
- 文件名使用 kebab-case

### 2.4 组件规范
- 使用函数组件
- 使用 TypeScript 类型
- 遵循单一职责原则
- 使用 React.memo 优化性能
- 使用 ErrorBoundary 处理错误

### 2.5 状态管理
- 使用 React Context 管理全局状态
- 使用 React Query 管理服务端状态
- 使用 Zustand 管理复杂状态
- 避免过度使用状态管理

### 2.6 性能优化
- 使用 Next.js 图片优化
- 实现组件懒加载
- 优化首次加载性能
- 实现增量静态再生成
- 使用 React Suspense

## 3. 数据库设计

### 3.1 用户模型
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  TEACHER
  USER
}
```

### 3.2 任务模型
```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      Status   @default(TODO)
  priority    Priority @default(MEDIUM)
  dueDate     DateTime?
  assignee    User     @relation(fields: [assigneeId], references: [id])
  assigneeId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## 4. API 设计

### 4.1 RESTful API
- 使用 HTTP 方法表示操作
- 使用复数名词表示资源
- 使用嵌套表示关系
- 使用查询参数过滤和排序

### 4.2 响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 4.3 错误处理
- 使用 HTTP 状态码
- 返回详细的错误信息
- 实现全局错误处理
- 记录错误日志

## 5. 安全规范

### 5.1 认证
- 使用 NextAuth.js
- 实现 JWT 认证
- 支持多种登录方式
- 实现会话管理

### 5.2 授权
- 基于角色的访问控制
- 实现权限中间件
- 验证用户权限
- 保护 API 路由

### 5.3 数据安全
- 使用 HTTPS
- 实现 CSRF 保护
- 加密敏感数据
- 实现速率限制

## 6. 部署规范

### 6.1 环境变量
- 使用 .env 文件
- 区分开发和生产环境
- 保护敏感信息
- 使用环境变量验证

### 6.2 构建优化
- 优化构建配置
- 实现代码分割
- 优化资源加载
- 实现缓存策略

### 6.3 监控和日志
- 实现错误监控
- 记录访问日志
- 监控性能指标
- 实现告警机制
