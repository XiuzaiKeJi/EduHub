# EduHub 任务看板系统 API 文档

## 基础信息

- 基础URL: `http://localhost:3001/api/v1`
- 请求格式: `application/json`
- 响应格式: `application/json`
- 认证方式: Bearer Token

## 通用响应格式

```json
{
  "code": 200,
  "data": {},
  "message": "success"
}
```

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## API 接口

### 1. 任务管理

#### 1.1 获取任务列表

```http
GET /tasks
Authorization: Bearer <token>
```

查询参数:
- `status`: 任务状态
- `priority`: 优先级
- `page`: 页码(默认1)
- `limit`: 每页数量(默认20)

响应:
```json
{
  "code": 200,
  "data": {
    "tasks": [
      {
        "id": "number",
        "title": "string",
        "description": "string",
        "status": "todo|in_progress|done",
        "priority": "low|medium|high",
        "dueDate": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "total": "number"
  }
}
```

#### 1.2 创建任务

```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "status": "todo|in_progress|done",
  "priority": "low|medium|high",
  "dueDate": "string"
}
```

响应:
```json
{
  "code": 200,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "status": "todo|in_progress|done",
    "priority": "low|medium|high",
    "dueDate": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### 1.3 更新任务

```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "status": "todo|in_progress|done",
  "priority": "low|medium|high",
  "dueDate": "string"
}
```

响应:
```json
{
  "code": 200,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "status": "todo|in_progress|done",
    "priority": "low|medium|high",
    "dueDate": "string",
    "updatedAt": "string"
  }
}
```

#### 1.4 删除任务

```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

响应:
```json
{
  "code": 200,
  "message": "Task deleted successfully"
}
```

### 2. 看板管理

#### 2.1 获取看板配置

```http
GET /board/config
Authorization: Bearer <token>
```

响应:
```json
{
  "code": 200,
  "data": {
    "columns": [
      {
        "id": "string",
        "name": "string",
        "status": "todo|in_progress|done"
      }
    ]
  }
}
```

#### 2.2 更新看板配置

```http
PUT /board/config
Authorization: Bearer <token>
Content-Type: application/json

{
  "columns": [
    {
      "id": "string",
      "name": "string",
      "status": "todo|in_progress|done"
    }
  ]
}
```

响应:
```json
{
  "code": 200,
  "message": "Board configuration updated successfully"
}
```

#### 2.3 更新任务顺序

```http
PUT /board/tasks/order
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "number",
  "status": "todo|in_progress|done",
  "order": "number"
}
```

响应:
```json
{
  "code": 200,
  "message": "Task order updated successfully"
}
```

### 3. 统计信息

#### 3.1 获取任务统计

```http
GET /stats/tasks
Authorization: Bearer <token>
```

响应:
```json
{
  "code": 200,
  "data": {
    "total": "number",
    "byStatus": {
      "todo": "number",
      "in_progress": "number",
      "done": "number"
    },
    "byPriority": {
      "low": "number",
      "medium": "number",
      "high": "number"
    }
  }
}
```

## 错误响应示例

### 参数验证错误
```json
{
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### 认证错误
```json
{
  "code": 401,
  "message": "Unauthorized"
}
```

### 资源不存在
```json
{
  "code": 404,
  "message": "Task not found"
}
``` 