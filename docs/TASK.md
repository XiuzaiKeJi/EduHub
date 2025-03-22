# EduHub 任务管理系统设计

## 一、系统概述

### 1.1 目标
- 提供直观的任务管理界面
- 实现灵活的任务分配和追踪
- 支持任务协作和评论
- 提供数据统计和分析

### 1.2 功能范围
- 任务创建和管理
- 任务状态流转
- 任务分配和协作
- 任务评论和附件
- 数据统计分析

## 二、系统架构

### 2.1 技术栈
- 前端：Vue 3 + TypeScript + Element Plus
- 后端：Node.js + Express + TypeScript
- 数据库：SQLite
- 文件存储：本地文件系统
- 日志：Winston

### 2.2 核心模块
1. 任务管理模块
   - 任务CRUD
   - 状态管理
   - 任务分配
   - 任务排序

2. 协作模块
   - 评论管理
   - 附件管理
   - 通知提醒
   - 任务订阅

3. 统计模块
   - 任务统计
   - 进度追踪
   - 报表导出
   - 数据分析

## 三、数据模型

### 3.1 任务表 (tasks)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| title | VARCHAR(100) | 任务标题 |
| description | TEXT | 任务描述 |
| status_id | INTEGER | 状态ID |
| priority | TINYINT | 优先级 |
| creator_id | INTEGER | 创建者ID |
| assignee_id | INTEGER | 负责人ID |
| due_date | DATETIME | 截止日期 |
| completed_at | DATETIME | 完成时间 |
| sort_order | INTEGER | 排序 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| deleted_at | DATETIME | 删除时间 |

### 3.2 任务状态表 (task_statuses)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | VARCHAR(50) | 状态名称 |
| color | VARCHAR(20) | 状态颜色 |
| description | VARCHAR(255) | 状态描述 |
| sort_order | INTEGER | 排序 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 3.3 任务评论表 (task_comments)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| task_id | INTEGER | 任务ID |
| user_id | INTEGER | 用户ID |
| content | TEXT | 评论内容 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| deleted_at | DATETIME | 删除时间 |

### 3.4 任务附件表 (task_attachments)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| task_id | INTEGER | 任务ID |
| user_id | INTEGER | 用户ID |
| file_name | VARCHAR(255) | 文件名 |
| file_path | VARCHAR(255) | 文件路径 |
| file_size | INTEGER | 文件大小 |
| file_type | VARCHAR(50) | 文件类型 |
| created_at | DATETIME | 创建时间 |
| deleted_at | DATETIME | 删除时间 |

## 四、API设计

### 4.1 任务管理API
```typescript
// 获取任务列表
GET /api/v1/tasks
Query:
{
  status?: number;
  assignee?: number;
  priority?: number;
  page?: number;
  limit?: number;
}

// 创建任务
POST /api/v1/tasks
Request:
{
  title: string;
  description?: string;
  status_id: number;
  priority: number;
  assignee_id?: number;
  due_date?: string;
}

// 更新任务
PUT /api/v1/tasks/:id
Request:
{
  title?: string;
  description?: string;
  status_id?: number;
  priority?: number;
  assignee_id?: number;
  due_date?: string;
}

// 删除任务
DELETE /api/v1/tasks/:id
```

### 4.2 任务状态API
```typescript
// 获取状态列表
GET /api/v1/task-statuses

// 创建状态
POST /api/v1/task-statuses

// 更新状态
PUT /api/v1/task-statuses/:id

// 删除状态
DELETE /api/v1/task-statuses/:id
```

### 4.3 任务评论API
```typescript
// 获取任务评论
GET /api/v1/tasks/:id/comments

// 添加评论
POST /api/v1/tasks/:id/comments

// 删除评论
DELETE /api/v1/tasks/:id/comments/:commentId
```

### 4.4 任务附件API
```typescript
// 上传附件
POST /api/v1/tasks/:id/attachments

// 下载附件
GET /api/v1/tasks/:id/attachments/:attachmentId

// 删除附件
DELETE /api/v1/tasks/:id/attachments/:attachmentId
```

## 五、前端设计

### 5.1 页面布局
- 任务看板视图
- 任务列表视图
- 任务详情页
- 统计报表页

### 5.2 组件设计
- TaskBoard.vue
- TaskList.vue
- TaskDetail.vue
- TaskForm.vue
- TaskComment.vue
- TaskAttachment.vue
- TaskStatistics.vue

### 5.3 状态管理
```typescript
// Pinia Store
interface TaskState {
  tasks: Task[];
  statuses: TaskStatus[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

// Actions
- fetchTasks
- createTask
- updateTask
- deleteTask
- updateTaskStatus
- updateTaskOrder
```

## 六、部署说明

### 6.1 环境要求
- Node.js >= 18
- SQLite 3
- PM2（生产环境）

### 6.2 配置项
```env
# 文件上传配置
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=10485760

# 分页配置
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# 日志配置
LOG_LEVEL=info
LOG_FILE=logs/task.log
```

### 6.3 部署步骤
1. 安装依赖
2. 配置环境变量
3. 初始化数据库
4. 创建上传目录
5. 启动服务

## 七、测试计划

### 7.1 单元测试
- 任务CRUD测试
- 状态流转测试
- 评论功能测试
- 附件管理测试

### 7.2 集成测试
- API接口测试
- 数据库操作测试
- 文件上传测试

### 7.3 性能测试
- 任务列表加载性能
- 文件上传性能
- 统计查询性能 