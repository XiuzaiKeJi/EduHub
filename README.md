# EduHub Development Environment

这是一个基于 VS Code Remote Development 的开发环境配置。

## 环境要求

- Docker Desktop
- Visual Studio Code
- VS Code Remote Development 扩展包

## 使用方法

1. 安装必要的软件和扩展
2. 克隆此仓库
3. 在 VS Code 中使用 "Remote-Containers: Open Folder in Container" 命令打开项目
4. 等待容器构建完成
5. 开始开发！

## 开发命令

- `npm start`: 启动应用
- `npm run dev`: 以开发模式启动应用（支持热重载）
- `npm test`: 运行测试

## 项目结构

```
.
├── .devcontainer/          # 开发容器配置
│   ├── devcontainer.json   # VS Code 远程开发配置
│   └── Dockerfile         # 开发环境 Docker 配置
├── package.json           # 项目依赖和脚本
└── README.md             # 项目文档
``` 