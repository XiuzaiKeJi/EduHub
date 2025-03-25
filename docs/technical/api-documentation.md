# API 文档

## 1. 认证 API

### 1.1 用户登录
```typescript
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": string,
  "password": string
}

Response:
{
  "token": string,
  "user": {
    "id": string,
    "email": string,
    "name": string,
    "role": "USER" | "ADMIN"
  }
}
```

### 1.2 用户注册
```typescript
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": string,
  "password": string,
  "name": string
}

Response:
{
  "user": {
    "id": string,
    "email": string,
    "name": string,
    "role": "USER"
  }
}
```

## 2. 任务 API

### 2.1 获取任务列表
```typescript
GET /api/tasks
Authorization: Bearer <token>

Query Parameters:
- status?: "TODO" | "IN_PROGRESS" | "DONE"
- priority?: "LOW" | "MEDIUM" | "HIGH"
- assigneeId?: string
- page?: number
- limit?: number

Response:
{
  "tasks": Task[],
  "total": number,
  "page": number,
  "limit": number
}
```

### 2.2 创建任务
```typescript
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "title": string,
  "description": string,
  "priority": "LOW" | "MEDIUM" | "HIGH",
  "dueDate": string,
  "assigneeId": string
}

Response:
{
  "task": Task
}
```

### 2.3 更新任务
```typescript
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "title"?: string,
  "description"?: string,
  "status"?: "TODO" | "IN_PROGRESS" | "DONE",
  "priority"?: "LOW" | "MEDIUM" | "HIGH",
  "dueDate"?: string,
  "assigneeId"?: string
}

Response:
{
  "task": Task
}
```

## 3. 教务管理 API

### 3.1 获取课程列表
```typescript
GET /api/courses
Authorization: Bearer <token>

Query Parameters:
- page?: number
- limit?: number
- teacherId?: string

Response:
{
  "courses": Course[],
  "total": number,
  "page": number,
  "limit": number
}
```

### 3.2 创建课程
```typescript
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": string,
  "description": string,
  "teacherId": string,
  "schedule": {
    "dayOfWeek": number,
    "startTime": string,
    "endTime": string
  }[]
}

Response:
{
  "course": Course
}
```

## 4. 团队 API

### 4.1 获取团队成员
```typescript
GET /api/team/members
Authorization: Bearer <token>

Response:
{
  "members": {
    "id": string,
    "name": string,
    "email": string,
    "role": string,
    "tasks": Task[]
  }[]
}
```

### 4.2 添加团队成员
```typescript
POST /api/team/members
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "email": string,
  "role": "MEMBER" | "LEADER"
}

Response:
{
  "member": {
    "id": string,
    "name": string,
    "email": string,
    "role": string
  }
}
```

## 5. 错误响应

所有 API 在发生错误时都会返回以下格式：

```typescript
{
  "error": {
    "code": string,
    "message": string,
    "details"?: any
  }
}
```

常见错误代码：
- `UNAUTHORIZED`: 未授权访问
- `FORBIDDEN`: 权限不足
- `NOT_FOUND`: 资源不存在
- `VALIDATION_ERROR`: 输入验证失败
- `INTERNAL_ERROR`: 服务器内部错误

## 6. 数据模型

### 6.1 Task 模型
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  assigneeId: string;
  assignee: User;
  createdAt: string;
  updatedAt: string;
}
```

### 6.2 Course 模型
```typescript
interface Course {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  teacher: User;
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### 6.3 User 模型
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "TEACHER";
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
``` 