# EduHub 开发指南

## 开发环境设置

### 前置要求
- Node.js v18+
- pnpm v10+
- Docker & Docker Compose
- Git

### 本地开发环境搭建
1. 克隆项目
```bash
git clone https://github.com/XiuzaiKeJi/EduHub.git
cd EduHub
```

2. 安装依赖
```bash
# 安装后端依赖
cd backend
pnpm install

# 安装前端依赖
cd ../frontend
pnpm install
```

3. 环境变量配置
- 复制 `.env.example` 到 `.env.development`
- 根据需要修改配置

4. 启动开发服务器
```bash
# 启动后端服务
cd backend
pnpm dev

# 启动前端服务（新终端）
cd frontend
pnpm dev
```

### 使用 Docker 开发
1. 启动开发容器
```bash
docker-compose up -d
```

2. 访问服务
- 前端：http://localhost:3000
- 后端：http://localhost:3001

## 项目结构
```
EduHub/
├── frontend/          # 前端项目
├── backend/           # 后端项目
├── config/           # 配置文件
├── scripts/          # 工具脚本
└── docs/             # 项目文档
```

## 开发规范

### Git 工作流
1. 创建功能分支
```bash
git checkout -b feature/your-feature
```

2. 提交代码
```bash
git add .
git commit -m "feat: 添加新功能"
```

3. 推送分支
```bash
git push origin feature/your-feature
```

### 代码规范
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 Vue 3 组件命名规范
- 使用 TypeScript 进行类型检查

### 提交规范
遵循 Conventional Commits 规范：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

## 测试
- 运行单元测试：`pnpm test`
- 运行端到端测试：`pnpm test:e2e`

## 构建和部署
1. 构建项目
```bash
# 构建前端
cd frontend
pnpm build

# 构建后端
cd backend
pnpm build
```

2. 生产环境部署
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 常见问题
1. 端口冲突
- 检查 3000 和 3001 端口是否被占用
- 可以通过环境变量修改端口号

2. 数据库连接问题
- 确保数据库服务正在运行
- 检查数据库连接配置

## 更多资源
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Node.js 文档](https://nodejs.org/)
