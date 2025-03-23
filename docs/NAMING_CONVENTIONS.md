# 项目命名规范

## 前端命名规范

### 文件命名
- Vue 组件文件：使用 PascalCase，例如 `UserList.vue`, `TaskDetail.vue`
- 工具类文件：使用 camelCase，例如 `authUtils.ts`, `dateFormatter.ts`
- 样式文件：使用 kebab-case，例如 `main-layout.scss`, `button-group.css`

### 目录结构
```
src/
  ├── assets/          # 静态资源
  ├── components/      # 通用组件
  ├── views/          # 页面组件
  │   ├── auth/       # 认证相关页面
  │   ├── admin/      # 管理后台页面
  │   └── tasks/      # 任务相关页面
  ├── stores/         # 状态管理
  ├── utils/          # 工具函数
  └── types/          # TypeScript 类型定义
```

### 命名约定
- 组件名：使用 PascalCase
- 路由名称：使用 camelCase
- 路由路径：使用 kebab-case
- 方法名：使用 camelCase
- 变量名：使用 camelCase
- 常量：使用 UPPER_SNAKE_CASE
- CSS 类名：使用 kebab-case

## 后端命名规范

### 文件命名
- 控制器：使用 PascalCase，后缀 `.controller.ts`
- 服务：使用 PascalCase，后缀 `.service.ts`
- 中间件：使用 camelCase，后缀 `.middleware.ts`
- 工具类：使用 camelCase，后缀 `.utils.ts`
- 实体：使用 PascalCase，无后缀

### 目录结构
```
src/
  ├── controllers/    # 控制器
  ├── services/      # 服务层
  ├── entities/      # 数据实体
  ├── middleware/    # 中间件
  ├── routes/        # 路由定义
  ├── utils/         # 工具函数
  └── config/        # 配置文件
```

### 命名约定
- 类名：使用 PascalCase
- 方法名：使用 camelCase
- 变量名：使用 camelCase
- 常量：使用 UPPER_SNAKE_CASE
- 接口名：使用 PascalCase，前缀 `I`
- 类型名：使用 PascalCase，后缀 `Type`
- 枚举名：使用 PascalCase，后缀 `Enum`

### API 路由命名
- 使用 kebab-case
- 使用复数形式表示资源集合
- 使用版本前缀
- 例如：`/api/v1/users`, `/api/v1/task-categories`

## 数据库命名规范

### 表命名
- 使用下划线命名法（snake_case）
- 使用复数形式
- 例如：`users`, `task_categories`, `user_roles`

### 字段命名
- 使用下划线命名法（snake_case）
- 主键：`id`
- 外键：`表名_id`
- 创建时间：`created_at`
- 更新时间：`updated_at`
- 删除时间：`deleted_at`（用于软删除）

## Git 提交规范

### 分支命名
- 功能分支：`feature/功能名称`
- 修复分支：`fix/问题描述`
- 优化分支：`optimize/优化描述`

### 提交信息
使用约定式提交规范（Conventional Commits）：
- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

例如：
```
feat(auth): 添加用户角色管理功能
fix(api): 修复用户登录验证失败问题
docs(readme): 更新项目安装说明
``` 