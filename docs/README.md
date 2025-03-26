# EduHub 项目文档

## 文档结构

```
docs/
├── README.md              # 本文档（文档索引）
├── development/          # 开发相关文档
│   ├── progress.md      # 开发进度
│   ├── workflow.md      # 开发工作流程
│   └── guidelines.md    # 开发规范
├── technical/           # 技术文档
│   ├── architecture.md  # 系统架构
│   ├── database.md      # 数据库设计
│   └── security.md      # 安全规范
└── api/                # API文档
    ├── auth.md         # 认证API
    ├── tasks.md        # 任务API
    └── users.md        # 用户API
```

## 文档说明

### 开发文档
- `development/progress.md`: 记录项目开发进度和里程碑
- `development/workflow.md`: 描述开发流程和工作规范
- `development/guidelines.md`: 项目开发规范和最佳实践

### 技术文档
- `technical/architecture.md`: 系统整体架构设计
- `technical/database.md`: 数据库模型和关系设计
- `technical/security.md`: 安全相关的设计和实现

### API文档
- `api/auth.md`: 认证相关的API文档
- `api/tasks.md`: 任务管理相关的API文档
- `api/users.md`: 用户管理相关的API文档

## 文档更新规范

1. 所有文档必须使用Markdown格式
2. 文档更新必须与代码变更同步
3. 重要的架构决策必须在相应文档中记录
4. API变更必须及时更新对应的API文档 