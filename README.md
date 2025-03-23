# EduHub 小学智慧管理系统

## 项目简介
EduHub是一个基于任务看板的小学智慧管理系统,采用前后端分离架构,以任务管理为核心,支持小学日常教学和管理工作。系统设计轻量级、高效、易维护,区别于传统的教育管理系统。

## 核心功能
- 任务看板管理
- 教学任务分配与跟踪
- 班级活动管理
- 教师协作管理
- 学生任务反馈

## 技术栈
### 后端
- Node.js + TypeScript
- Express.js
- TypeORM
- MySQL
- JWT认证
- Winston日志

### 前端
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia

## 系统要求
- Node.js >= 16
- MySQL >= 8.0
- pnpm >= 8.0

## 快速开始

### 1. 克隆项目
```bash
git clone [项目地址]
cd EduHub
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量
复制环境变量模板文件:
```bash
cp backend/.env.example backend/.env.development
cp frontend/.env.example frontend/.env.development
```

编辑后端环境变量文件 `backend/.env.development`:
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=eduhub

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# 服务器配置
PORT=8080
NODE_ENV=development

# CORS配置
CORS_ORIGIN=http://localhost:5173
```

### 4. 初始化数据库
```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE eduhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 启动开发服务器
```bash
# 启动所有服务
./scripts/manage.sh start

# 查看服务状态
./scripts/manage.sh status

# 查看日志
./scripts/manage.sh logs
```

## 项目结构
```
EduHub/
├── backend/                # 后端服务
│   ├── src/
│   │   ├── config/        # 配置文件
│   │   ├── controllers/   # 控制器
│   │   ├── entities/      # 数据实体
│   │   ├── middleware/    # 中间件
│   │   ├── routes/        # 路由
│   │   ├── services/      # 业务逻辑
│   │   ├── types/         # 类型定义
│   │   └── utils/         # 工具函数
│   └── package.json
├── frontend/              # 前端服务
│   ├── src/
│   │   ├── assets/       # 静态资源
│   │   ├── components/   # 组件
│   │   ├── views/        # 页面
│   │   ├── stores/       # 状态管理
│   │   └── utils/        # 工具函数
│   └── package.json
├── scripts/              # 管理脚本
└── README.md
```

## 开发规范

### 1. 项目定位规则
- 始终牢记项目是基于任务看板的小学智慧管理系统
- 所有功能设计必须围绕任务管理展开
- 避免引入传统教育管理系统的复杂功能

### 2. 技术栈规则
- 严格遵循已确定的技术栈
- 禁止引入规定以外的技术
- 如需使用新技术必须获得明确许可

### 3. 开发流程规则
- 每次对话开始时确认项目定位和技术栈
- 提出建议前检查是否符合项目规范
- 保持技术栈稳定性,避免频繁变更

### 4. 代码规范规则
- 严格遵循TypeScript规范
- 保持代码简洁清晰
- 注重代码可维护性

### 5. 功能开发规则
- 以任务管理为核心
- 功能设计要符合小学实际需求
- 避免过度设计

## 部署指南
1. 构建前端
```bash
cd frontend
pnpm build
```

2. 构建后端
```bash
cd backend
pnpm build
```

3. 配置生产环境变量
4. 使用PM2启动服务

## 贡献指南
1. Fork项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建Pull Request

## 许可证
MIT 