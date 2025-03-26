# EduHub 开发规范

## 技术栈规范

### 前端技术
- Next.js 14.1.0
- React 18
- TypeScript 5
- Tailwind CSS
- NextAuth.js

### 后端技术
- Node.js 18+
- Prisma ORM
- SQLite 数据库

## 代码规范

### 1. TypeScript规范
- 使用严格模式 (`strict: true`)
- 明确定义类型，避免使用 `any`
- 使用接口定义数据结构
- 使用枚举定义常量

### 2. React组件规范
- 使用函数式组件
- 使用React Hooks
- 组件文件使用PascalCase命名
- 组件属性使用TypeScript接口定义

### 3. 样式规范
- 使用Tailwind CSS工具类
- 遵循移动优先原则
- 使用主题变量
- 避免内联样式

### 4. 文件组织规范
```
src/
├── app/                    # Next.js页面
│   ├── api/               # API路由
│   ├── auth/              # 认证相关
│   └── dashboard/         # 仪表板
├── components/            # React组件
│   ├── ui/               # UI组件
│   └── features/         # 功能组件
├── lib/                   # 工具函数
│   ├── auth/             # 认证相关
│   ├── db/               # 数据库
│   └── utils/            # 通用工具
└── types/                # 类型定义
```

### 5. 命名规范
- 文件名：
  - 组件：PascalCase (e.g., `TaskCard.tsx`)
  - 工具：camelCase (e.g., `formatDate.ts`)
  - 类型：PascalCase (e.g., `TaskType.ts`)
- 变量：
  - 普通变量：camelCase
  - 常量：UPPER_SNAKE_CASE
  - 接口：以I开头，PascalCase
  - 类型：以T开头，PascalCase

### 6. 注释规范
- 组件注释：
```typescript
/**
 * TaskCard组件 - 显示任务卡片
 * @param {TaskProps} props - 组件属性
 * @returns {JSX.Element} 任务卡片组件
 */
```
- 函数注释：
```typescript
/**
 * 格式化日期
 * @param {Date} date - 需要格式化的日期
 * @returns {string} 格式化后的日期字符串
 */
```

## 安全规范

### 1. 认证安全
- 使用NextAuth.js进行认证
- 实现角色基础的访问控制
- 使用HTTPS
- 实现CSRF保护

### 2. 数据安全
- 使用参数化查询
- 实现输入验证
- 避免敏感信息泄露
- 实现数据加密

### 3. API安全
- 实现速率限制
- 验证请求来源
- 限制请求大小
- 记录安全日志

## 测试规范

### 1. 单元测试
- 使用Jest和React Testing Library
- 测试覆盖率要求：80%以上
- 测试命名规范：`describe` + `it` 风格
- 使用Mock数据

### 2. 集成测试
- 测试API接口
- 测试数据流
- 测试用户流程
- 测试边界情况

### 3. E2E测试
- 使用Cypress
- 测试关键用户流程
- 测试跨浏览器兼容性
- 测试响应式设计

## 性能规范

### 1. 前端性能
- 使用静态生成
- 实现懒加载
- 优化图片加载
- 实现缓存策略

### 2. API性能
- 实现数据分页
- 优化查询性能
- 实现缓存机制
- 控制响应大小

### 3. 数据库性能
- 优化表结构
- 创建必要索引
- 优化查询语句
- 实现数据分区

## 文档规范

### 1. 代码文档
- 组件文档
- API文档
- 类型文档
- 工具函数文档

### 2. 项目文档
- README.md
- 架构文档
- API文档
- 部署文档

### 3. 版本文档
- CHANGELOG.md
- 版本说明
- 更新日志
- 迁移指南 