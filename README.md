# EduHub 管理后台开发环境

本项目提供了一个精简但完整的管理后台开发环境，使用 Cursor + 远程服务器 + Docker 的开发方案。

## 技术栈

### 前端
- Vue 3.5.13 + Vite 6.2.2（核心框架）
- Pinia（状态管理）
- Vue Router（路由管理）
- Element Plus 2.9.7（UI组件库）
- TypeScript 5.7.3（类型支持）
- Axios 1.8.4（HTTP客户端）

### 后端
- Node.js 18.20.6 + Express 4.21.2（API服务）
- SQLite3 5.1.7（轻量级数据库）
- JWT 9.0.2（身份认证）
- TypeScript 5.8.2（类型支持）

### 开发工具
- pnpm 10.6.5（包管理器）
- ESLint + Prettier（代码规范）
- Vitest（单元测试）
- Docker（容器化）

## 目录结构

```
eduhub/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── api/           # API 接口定义
│   │   ├── assets/        # 静态资源
│   │   ├── components/    # 通用组件
│   │   ├── layouts/       # 布局组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # 状态管理
│   │   ├── styles/        # 全局样式
│   │   ├── types/         # TypeScript 类型
│   │   └── views/         # 页面组件
│   └── tests/             # 测试文件
├── backend/                # 后端项目
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由定义
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   └── tests/             # 测试文件
├── config/                # 配置文件
│   ├── nginx/            # Nginx 配置
│   └── docker-compose.yml # Docker 编排
├── scripts/              # 工具脚本
├── Dockerfile            # Docker 构建文件
├── .dockerignore         # Docker 忽略文件
└── README.md            # 项目文档

## 快速开始

1. 克隆项目：
```bash
git clone https://github.com/your-username/eduhub.git
cd eduhub
```

2. 启动开发环境：
```bash
docker-compose up -d
```

3. 安装依赖：
```bash
# 前端依赖
cd frontend && pnpm install
# 后端依赖
cd backend && pnpm install
```

4. 启动开发服务：
```bash
# 前端开发服务器
pnpm dev --host 0.0.0.0

# 后端开发服务器
pnpm start:dev
```

## 开发规范

### 代码风格
- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件使用 Composition API

### Git 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

### API 规范
- RESTful 风格
- 版本控制：/api/v1/
- 响应格式统一
- 错误处理标准化

## 部署

### 开发环境
- 前端：http://localhost:3000
- 后端：http://localhost:3001
- API文档：http://localhost:3001/api-docs

### 测试环境
- 前端：http://test.eduhub.com
- 后端：http://api-test.eduhub.com

### 生产环境
- 前端：https://eduhub.com
- 后端：https://api.eduhub.com

## 安全配置

1. 开发环境端口：
- 3000: 前端开发服务器
- 3001: 后端API服务器
- 8080: Nginx代理
- 9229: Node.js调试端口

2. 环境变量：
- NODE_ENV: 运行环境
- API_SECRET: API密钥
- DB_PATH: 数据库路径
- JWT_SECRET: JWT密钥

## 维护指南

1. 依赖更新
```bash
pnpm update
```

2. 数据库备份
```bash
./scripts/backup-db.sh
```

3. 日志管理
```bash
./scripts/rotate-logs.sh
```

## 常见问题

1. 端口冲突
2. 热重载不生效
3. 数据库连接失败
4. 容器权限问题

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 

## 开发环境设置

### 1. 初始化目录结构

使用初始化脚本创建标准目录结构：

```bash
# 运行目录初始化脚本
./scripts/init-dirs.sh
```

目录结构说明：
```
eduhub/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── api/           # API 接口定义
│   │   ├── assets/        # 静态资源
│   │   ├── components/    # 通用组件
│   │   ├── layouts/       # 布局组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # 状态管理
│   │   ├── styles/        # 全局样式
│   │   ├── types/         # TypeScript 类型
│   │   └── views/         # 页面组件
│   └── tests/             # 测试文件
├── backend/                # 后端项目
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由定义
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   └── tests/             # 测试文件
├── config/                # 配置文件
│   ├── nginx/            # Nginx 配置
│   └── docker-compose.yml # Docker 编排
├── scripts/              # 工具脚本
│   ├── init-dirs.sh      # 目录初始化脚本
│   ├── init-terminal.sh  # 终端配置脚本
│   ├── cleanup.sh        # 清理脚本
│   ├── monitor.sh        # 监控脚本
│   └── system-optimize.sh # 系统优化脚本
├── docs/                 # 项目文档
└── README.md            # 项目说明

### 2. 系统优化配置

为确保开发环境的稳定性，已完成以下优化：

1. Swap 配置
```bash
# 查看 Swap 状态
free -h

# Swap 配置位置
/etc/fstab
/swapfile none swap sw 0 0

# Swappiness 设置
/etc/sysctl.conf
vm.swappiness=10
```

2. 系统资源限制
```bash
# Docker 资源限制配置
/etc/docker/daemon.json
```

### 3. 开发环境要求

- Node.js >= 18
- pnpm >= 8.0
- Docker >= 24.0
- Docker Compose >= 2.0 