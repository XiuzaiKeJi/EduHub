# EduHub 教务中心任务看板系统 （仅仅只是一个测试系统，没有完整实现）

基于 Cursor Agent 全自动开发的任务看板系统，专注于小学教务中心日常办公任务管理。

## 项目简介

EduHub 是一个基于 Cursor Agent 全自动开发的任务看板（教务中心）系统，以任务管理为核心，支持小学日常办公任务管理工作。系统设计轻量级、高效、易维护，区别于传统的教育管理系统。

## 核心功能

### 任务看板管理
- 教务任务分配与跟踪
- 任务状态可视化
- 任务优先级管理
- 任务截止时间管理
- 任务依赖关系

### 教务管理
- 课程任务管理
- 教学计划跟踪
- 教学质量评估
- 教学资源管理
- 教务通知发布

### 团队协作
- 教务团队管理
- 任务分配与转交
- 团队进度追踪
- 协作通知
- 工作反馈

### 数据统计
- 任务完成率统计
- 教学质量分析
- 教学进度报表
- 教师工作量统计
- 学生学习情况

## 技术栈

- Next.js 14
- React 18
- TypeScript 5
- Prisma + SQLite
- NextAuth.js
- Tailwind CSS
- Zod

## 开发环境要求

- Node.js 18+
- pnpm 8+
- Git
- Cursor IDE

## 项目结构

```
.
├── src/                    # 源代码目录
│   ├── app/               # Next.js App Router 页面
│   │   ├── (auth)/       # 认证相关页面（路由组）
│   │   ├── api/          # API 路由
│   │   ├── courses/      # 课程相关页面
│   │   ├── __tests__/    # 页面测试
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 首页
│   │   └── globals.css   # 全局样式
│   ├── components/       # React 组件
│   │   ├── ui/          # UI 基础组件
│   │   ├── layout/      # 布局组件
│   │   └── features/    # 功能组件
│   ├── lib/             # 工具函数和共享逻辑
│   │   ├── auth/       # 认证相关
│   │   ├── db/         # 数据库相关
│   │   └── utils/      # 通用工具
│   ├── types/          # TypeScript 类型定义
│   ├── __mocks__/      # 测试模拟
│   ├── middleware.ts   # Next.js 中间件
│   └── middleware.test.ts # 中间件测试
├── docs/                # 文档目录
│   ├── development/    # 开发相关文档
│   │   ├── api.md     # API 文档
│   │   ├── components.md # 组件文档
│   │   ├── database.md # 数据库设计文档
│   │   ├── testing.md # 测试指南
│   │   ├── ai-development.md # AI 开发指南
│   │   ├── version-plan.md # 版本规划
│   │   ├── workflow.md # 工作流程指南
│   │   ├── cursor-guidelines.md # Cursor IDE 使用指南
│   │   └── tasks/     # 开发任务分解
│   │       ├── v0.1.0-tasks.md # 基础架构任务
│   │       ├── v0.2.0-tasks.md # 任务管理功能
│   │       ├── v0.3.0-tasks.md # 教务管理功能
│   │       ├── v0.4.0-tasks.md # 团队协作功能
│   │       ├── v0.5.0-tasks.md # 数据统计功能
│   │       └── v0.6.0-tasks.md # 系统优化完善
│   ├── product/       # 产品相关文档
│   │   ├── guide.md  # 产品文档规范
│   │   └── prd/      # 产品需求文档
│   │       ├── product-design.md # 产品设计
│   │       ├── data-model.md # 数据模型
│   │       └── user-stories.md # 用户故事
│   ├── test-reports/ # 测试相关文档
│   │   └── guide.md # 测试文档规范
│   └── meeting-notes/ # 会议记录
│       └── guide.md # 会议记录规范
├── prisma/             # Prisma 数据库配置
├── public/            # 静态资源
├── .next/             # Next.js 构建输出
├── coverage/          # 测试覆盖率报告
├── node_modules/      # 依赖包
├── .husky/           # Git 钩子配置
├── .cursor/          # Cursor IDE 配置
├── .swc/             # SWC 编译器缓存
├── .env              # 环境变量
├── .env.test         # 测试环境变量
├── .env.example      # 环境变量示例
├── .editorconfig     # 编辑器配置
├── .gitignore        # Git 忽略配置
├── .gitflow          # Git 工作流配置
├── .prettierrc       # Prettier 配置
├── .commitlintrc.json # Commit 消息规范
├── eslint.config.js  # ESLint 配置
├── jest.config.js    # Jest 测试配置
├── jest.setup.js     # Jest 测试设置
├── next.config.js    # Next.js 配置
├── postcss.config.js # PostCSS 配置
├── tailwind.config.js # Tailwind CSS 配置
├── tsconfig.json     # TypeScript 配置
├── pnpm-lock.yaml    # pnpm 依赖锁定
├── pnpm-workspace.yaml # pnpm 工作区配置
└── LICENSE           # 许可证
```

## 快速开始

1. 安装依赖
```bash
pnpm install
```

2. 启动开发服务器
```bash
pnpm dev
```

3. 构建生产版本
```bash
pnpm build
```

4. 启动生产服务器
```bash
pnpm start
```

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 生成文档
pnpm docs:generate
```

## 开发规范

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 Next.js 最佳实践
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 Git 提交规范

### 文档规范
- 所有文档使用 Markdown 格式
- 文档必须包含最后更新时间
- 重要文档需要经过评审
- 文档变更需要记录在版本控制中

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例修改
- chore: 其他修改

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
