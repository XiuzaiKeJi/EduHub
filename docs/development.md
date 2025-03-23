# EduHub 任务看板系统开发规范

## 项目文档概览

### 核心文档
- `README.md` - 项目总体介绍、快速开始指南
- `docs/development.md` - 开发规范文档(本文档)
- `docs/api.md` - API接口文档
- `docs/deploy.md` - 部署指南文档

### 前端文档
- `frontend/README.md` - 前端项目说明
- `frontend/docs/components.md` - 组件开发文档
- `frontend/docs/state.md` - 状态管理文档

### 后端文档
- `backend/README.md` - 后端项目说明
- `backend/docs/database.md` - 数据库设计文档
- `backend/docs/services.md` - 服务层设计文档

### 工作流程文档
- `docs/workflow/development.md` - 开发工作流程
  - 功能开发流程
  - 代码审查流程
  - 测试流程
  - 发布流程
- `docs/workflow/git.md` - Git使用规范
  - 分支管理
  - 提交规范
  - 合并规范
- `docs/workflow/review.md` - 代码审查规范
  - 审查清单
  - 反馈规范
  - 修改流程

### 其他文档
- `CHANGELOG.md` - 版本更新日志
- `CONTRIBUTING.md` - 贡献指南
- `LICENSE` - 开源协议

## 目录
- [技术栈规范](#技术栈规范)
- [开发环境配置](#开发环境配置)
- [代码规范](#代码规范)
- [Git工作流](#git工作流)
- [测试规范](#测试规范)
- [文档规范](#文档规范)

## 技术栈规范

### 前端技术栈
- Vue 3 - 前端框架
- TypeScript - 类型系统
- Vite - 构建工具
- Element Plus - UI组件库
- Pinia - 状态管理

### 后端技术栈
- Node.js - 运行时环境
- TypeScript - 类型系统
- Express.js - Web框架
- TypeORM - ORM框架
- MySQL - 数据库

### 开发工具
- pnpm - 包管理器
- ESLint - 代码检查
- Prettier - 代码格式化
- Vitest - 单元测试
- Git - 版本控制

## 开发环境配置

### 环境要求
- Node.js >= 18.x
- MySQL >= 8.0
- pnpm >= 8.x

### IDE配置
推荐使用VSCode，必要的插件：
- Vue Language Features
- TypeScript Vue Plugin
- ESLint
- Prettier
- GitLens

### 编辑器配置
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 代码规范

### 目录结构规范

#### 前端目录结构
```
frontend/
├── src/
│   ├── components/      # 组件
│   │   ├── board/      # 看板相关组件
│   │   └── common/     # 通用组件
│   ├── composables/    # 组合式函数
│   ├── stores/         # 状态管理
│   ├── types/          # 类型定义
│   └── utils/          # 工具函数
└── tests/              # 测试文件
```

#### 后端目录结构
```
backend/
├── src/
│   ├── controllers/    # 控制器
│   ├── entities/       # 数据实体
│   ├── services/       # 业务服务
│   └── utils/          # 工具函数
└── tests/              # 测试文件
```

### 命名规范

#### 文件命名
- 组件文件: PascalCase.vue
- 工具文件: camelCase.ts
- 类型文件: camelCase.types.ts
- 测试文件: *.spec.ts

#### 变量命名
```typescript
// 常量
const MAX_COUNT = 10;

// 变量
let taskCount = 0;

// 布尔值
const isLoading = true;

// 数组
const taskList = [];

// 函数
function handleSubmit() {}
```

### 组件规范

#### Vue组件结构
```vue
<template>
  <div class="task-board">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
// 导入
import { ref } from 'vue';
import type { Task } from '@/types';

// 属性定义
interface Props {
  tasks: Task[];
}
const props = defineProps<Props>();

// 状态和方法
const isLoading = ref(false);

// 事件处理
const handleTaskUpdate = async (task: Task) => {
  // 处理逻辑
};
</script>

<style scoped lang="scss">
.task-board {
  // 样式定义
}
</style>
```

### TypeScript规范

#### 类型定义
```typescript
// 接口定义
interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

// 枚举定义
enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

// 类型别名
type TaskPriority = 'low' | 'medium' | 'high';
```

#### API调用
```typescript
// API函数定义
async function fetchTasks(params: TaskQueryParams): Promise<Task[]> {
  try {
    const response = await axios.get('/api/tasks', { params });
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
}
```

## Git工作流

### 分支管理
- `main`: 主分支，用于生产环境
- `dev`: 开发分支，用于开发环境
- `feature/*`: 功能分支，用于开发新功能
- `fix/*`: 修复分支，用于修复bug

### 提交规范
```bash
# 提交格式
<type>(<scope>): <description>

# 示例
feat(task): add task creation
fix(board): fix drag and drop issue
```

提交类型:
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

### 代码审查清单
1. 功能完整性
   - 功能是否符合需求
   - 是否处理了边界情况
   - 是否有适当的错误处理

2. 代码质量
   - 代码是否符合规范
   - 是否有重复代码
   - 是否有潜在性能问题

3. 测试覆盖
   - 是否包含单元测试
   - 测试是否覆盖主要功能
   - 测试是否覆盖边界情况

## 测试规范

### 单元测试
```typescript
import { describe, it, expect } from 'vitest';
import { TaskService } from './task.service';

describe('TaskService', () => {
  it('should create task', () => {
    const service = new TaskService();
    const task = service.createTask({
      title: 'Test Task',
      status: TaskStatus.TODO
    });
    
    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
  });
});
```

### 组件测试
```typescript
import { mount } from '@vue/test-utils';
import TaskCard from './TaskCard.vue';

describe('TaskCard', () => {
  it('should render task title', () => {
    const wrapper = mount(TaskCard, {
      props: {
        task: {
          title: 'Test Task',
          status: 'todo'
        }
      }
    });
    
    expect(wrapper.text()).toContain('Test Task');
  });
});
```

## 文档规范

### 代码注释
```typescript
/**
 * 任务服务类
 * 处理任务相关的业务逻辑
 */
class TaskService {
  /**
   * 创建新任务
   * @param data - 任务数据
   * @returns 创建的任务
   */
  createTask(data: CreateTaskDto): Task {
    // 实现逻辑
  }
}
```

### API文档
- 遵循OpenAPI规范
- 包含请求/响应示例
- 说明错误处理
- 提供认证信息

### 更新日志
```markdown
# 更新日志

## [1.0.0] - 2024-03-20
### 新增
- 基础任务管理功能
- 看板视图
- 拖拽排序

### 修复
- 任务状态更新问题
- 看板性能优化
``` 