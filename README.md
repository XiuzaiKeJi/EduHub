# EduHub 任务看板系统

## 项目简介

EduHub是一个简单易用的任务看板系统，专注于提供基础的任务管理功能。采用直观的界面设计，帮助用户轻松管理和追踪任务进度。

## 核心功能

- 任务管理
  - 创建和编辑任务
  - 拖拽式任务状态更新
  - 任务优先级设置
  - 任务截止日期提醒

- 看板视图
  - 简洁的看板界面
  - 自定义任务状态列
  - 任务筛选和排序
  - 任务进度统计

## 技术栈

### 后端
- Node.js
- TypeScript
- Express.js
- TypeORM
- MySQL
- Winston (日志系统)

### 前端
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia

## 系统要求

- Node.js >= 18.x
- MySQL >= 8.0
- pnpm >= 8.x

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-org/eduhub.git
cd eduhub
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env.development
```

4. 启动服务
```bash
# 开发环境
pnpm dev

# 生产环境
pnpm build
pnpm start
```

## 项目结构

```
eduhub/
├── frontend/          # 前端项目
├── backend/           # 后端项目
├── docs/             # 项目文档
└── scripts/          # 脚本文件
```

## 文档

- [开发规范](./docs/development.md)
- [部署指南](./docs/deploy.md)
- [API文档](./docs/api.md)

## 开源协议

MIT License 