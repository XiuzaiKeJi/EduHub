# EduHub Frontend

基于 Vue 3 + Vite + TypeScript 的管理后台前端项目。

## 开发环境

- Node.js >= 18.20.6
- pnpm >= 10.6.5
- Vue 3.5.13
- Vite 6.2.2
- TypeScript 5.7.3

## 项目依赖

- Element Plus - UI组件库
- Pinia - 状态管理
- Vue Router - 路由管理
- Axios - HTTP客户端

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
├── api/        # API接口定义
├── assets/     # 静态资源
├── components/ # 通用组件
├── layouts/    # 布局组件
├── router/     # 路由配置
├── stores/     # 状态管理
├── styles/     # 全局样式
├── types/      # TypeScript类型
└── views/      # 页面组件
```

## 开发规范

1. 组件开发
- 使用 Composition API
- 组件名使用 PascalCase
- Props 必须声明类型

2. 样式规范
- 使用 SCSS
- BEM 命名规范
- 优先使用 Element Plus 变量

3. TypeScript
- 严格模式
- 必须声明类型
- 避免使用 any

## 环境变量

开发环境（.env.development）：
- VITE_APP_TITLE=EduHub管理系统
- VITE_APP_API_BASE_URL=http://localhost:3001/api/v1
- VITE_APP_UPLOAD_URL=http://localhost:3001/api/v1/upload

生产环境（.env.production）：
- VITE_APP_TITLE=EduHub管理系统
- VITE_APP_API_BASE_URL=https://api.eduhub.com/api/v1
- VITE_APP_UPLOAD_URL=https://api.eduhub.com/api/v1/upload

## 构建与部署

1. 开发环境：
```bash
pnpm dev --host 0.0.0.0
```

2. 测试环境：
```bash
pnpm build:test
```

3. 生产环境：
```bash
pnpm build
```
