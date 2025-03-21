# EduHub 开发指南 - 项目初始模板

本文档提供了 EduHub 智慧校园任务管理系统初始模板的开发指南。

## 开发环境设置

### 必需工具
- Node.js >= 18
- pnpm >= 8
- Git
- VSCode（推荐）

### 推荐的 VSCode 插件
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- GitLens

## Git 工作流

### 分支命名规范
- 主分支：`main`
- 功能分支：`feature/功能名称`
- 修复分支：`fix/问题描述`
- 发布分支：`release/版本号`

### 提交信息规范
遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

示例：
```bash
git commit -m "feat: 添加用户认证功能"
git commit -m "fix: 修复任务列表分页问题"
```

## 代码规范

### TypeScript
- 使用 TypeScript 严格模式
- 定义清晰的类型和接口
- 避免使用 any 类型

### Vue 3 组件
- 使用 Composition API
- 遵循 Vue 3 组件命名规范
- 组件文件使用 PascalCase 命名

### 目录结构规范

```
src/
├── assets/          # 静态资源
├── components/      # 通用组件
├── views/          # 页面组件
├── router/         # 路由配置
├── store/          # 状态管理
├── utils/          # 工具函数
├── api/            # API 接口
└── types/          # TypeScript 类型定义
```

## 开发流程

### 1. 克隆模板并安装依赖
```bash
git clone https://github.com/XiuzaiKeJi/EduHub.git
cd EduHub
```

### 2. 前端开发
```bash
cd frontend
pnpm install
pnpm dev
```

### 3. 后端开发
```bash
cd backend
pnpm install
pnpm dev
```

### 4. 测试
- 编写单元测试（Jest）
- 运行测试：`pnpm test`
- 检查测试覆盖率：`pnpm test:coverage`

### 5. 代码检查
```bash
# 运行 ESLint 检查
pnpm lint

# 运行 Prettier 格式化
pnpm format
```

## 调试指南

### 前端调试
- 使用 Vue DevTools
- 使用浏览器开发者工具
- 配置 VSCode 调试

### 后端调试
- 使用 VSCode Debugger
- 使用 Postman 测试 API
- 查看日志文件

## 部署

### 开发环境
- 前端：`pnpm dev`
- 后端：`pnpm dev`

### 生产环境
- 构建：`pnpm build`
- 使用 Docker（可选）：`docker-compose up -d`

## 注意事项

1. 始终保持依赖包的更新
2. 定期同步主分支的更新
3. 遵循代码审查流程
4. 保持文档的同步更新

## 常见问题

### 1. 端口冲突
- 前端默认端口：3000
- 后端默认端口：3001
- 可通过环境变量修改

### 2. 依赖安装问题
```bash
# 清除依赖缓存
pnpm store prune
# 重新安装依赖
pnpm install
```

### 3. 数据库连接问题
- 检查环境变量配置
- 确保数据库服务正常运行

## 资源链接

- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Node.js 文档](https://nodejs.org/)
