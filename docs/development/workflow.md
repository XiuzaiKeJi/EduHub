# Cursor Agent 开发工作流程

## 开发环境设置

### 必需工具
- Node.js 18+
- pnpm 8+
- Git
- Cursor IDE

### 环境配置
1. 克隆项目
```bash
git clone git@github.com:XiuzaiKeJi/EduHub.git
cd EduHub
```

2. 安装依赖
```bash
pnpm install
```

3. 设置环境变量
```bash
cp .env.example .env
```

## 开发流程

### 1. 分支管理
- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于开发集成
- `feature/*`: 功能分支，用于新功能开发
- `bugfix/*`: 修复分支，用于修复问题
- `release/*`: 发布分支，用于版本发布

### 2. 功能开发流程
1. 从 `develop` 分支创建功能分支
```bash
git checkout -b feature/new-feature develop
```

2. 在功能分支上进行开发
3. 提交代码时遵循提交规范
4. 完成开发后合并回 `develop` 分支

### 3. 代码提交规范
提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- build: 构建相关
- ci: CI配置
- chore: 其他修改

### 4. 代码审查流程
1. 创建Pull Request
2. 等待代码审查
3. 解决审查意见
4. 合并代码

## Cursor IDE 开发规范

### 1. 文件组织
```
src/
├── app/                 # Next.js App Router 页面
├── components/          # React 组件
├── lib/                # 工具函数和共享逻辑
└── types/              # TypeScript 类型定义
```

### 2. 组件开发规范
- 使用函数式组件
- 使用TypeScript类型
- 遵循React Hooks规范
- 使用Tailwind CSS样式

### 3. 代码质量要求
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 保持代码注释完整
- 编写单元测试

### 4. 文档维护
- 及时更新API文档
- 记录重要的技术决策
- 更新开发进度
- 维护使用说明

## 发布流程

### 1. 版本发布
1. 从 `develop` 创建发布分支
2. 进行版本测试
3. 修复问题
4. 合并到 `main` 和 `develop`
5. 打标签发布

### 2. 部署流程
1. 构建项目
```bash
pnpm build
```

2. 运行测试
```bash
pnpm test
```

3. 部署到生产环境

## 问题处理流程

### 1. Bug修复
1. 创建Issue
2. 从 `develop` 创建修复分支
3. 修复并测试
4. 提交Pull Request

### 2. 功能改进
1. 提出改进建议
2. 讨论可行性
3. 按功能开发流程执行

## 持续集成/持续部署

### 1. CI流程
- 代码提交触发构建
- 运行自动化测试
- 代码质量检查
- 生成测试报告

### 2. CD流程
- 自动部署到测试环境
- 运行集成测试
- 人工确认部署
- 自动部署到生产环境 