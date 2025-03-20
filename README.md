# EduHub 教育平台

EduHub 是一个现代化的教育平台系统，提供在线课程管理、学习进度跟踪、师生互动等功能。

## 功能特点

- 用户认证与授权
- 课程管理
- 学习进度跟踪
- 师生互动
- 在线作业提交
- 成绩管理

## 技术栈

- Node.js
- Express.js
- MongoDB
- JWT 认证
- RESTful API

## 开始使用

1. 克隆仓库
```bash
git clone https://github.com/XiuzaiKeJi/EduHub.git
cd EduHub
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置必要的环境变量
```

4. 启动开发服务器
```bash
npm run dev
```

## 项目结构

```
src/
├── config/         # 配置文件
├── controllers/    # 控制器
├── models/        # 数据模型
├── routes/        # 路由
├── services/      # 业务逻辑
├── utils/         # 工具函数
└── app.js         # 应用入口
```

## 开发指南

- 遵循 ESLint 规范
- 编写单元测试
- 提交前运行测试
- 遵循 Git Flow 工作流

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

ISC 