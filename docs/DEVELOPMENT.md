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

# 开发规范文档

## 项目定位
EduHub是一个基于任务看板的小学智慧管理系统,区别于传统的教育管理系统。系统以任务管理为核心,支持小学日常教学和管理工作。

## Agent Rules

### 1. 项目定位规则
- 始终牢记项目是基于任务看板的小学智慧管理系统
- 所有功能设计必须围绕任务管理展开
- 避免引入传统教育管理系统的复杂功能
- 保持系统轻量级、高效、易维护

### 2. 技术栈规则
- 严格遵循已确定的技术栈
- 禁止引入规定以外的技术
- 如需使用新技术必须获得明确许可
- 保持技术栈的稳定性

### 3. 开发流程规则
- 每次对话开始时确认项目定位和技术栈
- 提出建议前检查是否符合项目规范
- 保持技术栈稳定性,避免频繁变更
- 遵循渐进式开发原则

### 4. 代码规范规则
- 严格遵循TypeScript规范
- 保持代码简洁清晰
- 注重代码可维护性
- 编写清晰的注释和文档

### 5. 功能开发规则
- 以任务管理为核心
- 功能设计要符合小学实际需求
- 避免过度设计
- 保持功能简单直观

## 技术栈规范

### 后端技术栈
- Node.js + TypeScript
- Express.js
- TypeORM
- MySQL
- JWT认证
- Winston日志

### 前端技术栈
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia

## 开发流程

### 1. 需求分析
- 明确需求来源和背景
- 分析需求可行性
- 评估技术实现方案
- 确认是否符合项目定位

### 2. 技术方案
- 遵循既定技术栈
- 评估技术风险
- 制定实现计划
- 确认是否需要引入新技术

### 3. 编码实现
- 遵循TypeScript规范
- 保持代码简洁清晰
- 注重代码可维护性
- 编写单元测试

### 4. 代码审查
- 检查代码规范
- 评估代码质量
- 确认功能完整性
- 验证测试覆盖率

### 5. 部署上线
- 环境配置检查
- 性能测试
- 安全测试
- 部署文档更新

## 禁止事项
1. 不允许自行安装使用规定以外的架构、插件、技术
2. 如需使用新技术必须获得许可并更新技术方案
3. 严格按照技术方案执行
4. 避免引入不必要的依赖
5. 禁止使用过时或不安全的技术

## 文档规范
1. 及时更新文档
2. 保持文档准确性
3. 编写清晰的注释
4. 维护API文档
5. 记录重要决策

## 版本控制
1. 遵循语义化版本
2. 编写清晰的提交信息
3. 保持分支整洁
4. 定期合并主分支
5. 及时处理冲突
