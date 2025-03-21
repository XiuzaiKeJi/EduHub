# EduHub 智慧校园任务管理系统 - 项目初始模板

![Node](https://img.shields.io/badge/Node.js-v18-green)
![Vue](https://img.shields.io/badge/Vue.js-v3-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 项目说明

这是 EduHub 智慧校园任务管理系统的项目初始模板，提供了基础的项目结构和配置。该系统基于任务看板，旨在为学校提供高效的任务管理和协作平台。

### 模板特性

- ✨ 前后端分离架构
- 🔧 完整的开发环境配置
- 📝 统一的代码规范配置
- 🚀 开箱即用的构建部署配置
- 📦 预配置的依赖管理
- 🔒 基础的安全配置

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router

### 后端
- Node.js
- Express
- TypeScript
- SQLite
- JWT认证
- Winston日志

## 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 本地开发

1. 克隆项目模板
```bash
git clone https://github.com/XiuzaiKeJi/EduHub.git
cd EduHub
```

2. 安装依赖
```bash
# 安装前端依赖
cd frontend
pnpm install

# 安装后端依赖
cd ../backend
pnpm install
```

3. 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.example .env.development
```

4. 启动服务
```bash
# 启动后端服务
cd backend
pnpm dev

# 启动前端服务
cd frontend
pnpm dev
```

## 项目结构

```
EduHub/
├── frontend/          # 前端项目
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   └── ...
├── backend/          # 后端项目
│   ├── src/         # 源代码
│   ├── tests/       # 测试文件
│   └── ...
├── docs/            # 项目文档
└── ...
```

## 开发文档

详细的开发文档请参考：
- [开发指南](./docs/DEVELOPMENT.md)
- [API文档](./docs/API.md)
- [架构设计](./docs/ARCHITECTURE.md)

## 版本说明

当前版本: v0.1.0 (初始模板)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件 