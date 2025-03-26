# API 文档

## 认证 API

### POST /api/auth/signin
用户登录接口

**请求体**：
```json
{
  "username": "string",
  "password": "string"
}
```

**响应**：
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "ADMIN" | "TEACHER" | "STUDENT"
  },
  "token": "string"
}
```

### POST /api/auth/signout
用户登出接口

**响应**：
```json
{
  "success": true
}
```

## 用户 API

### GET /api/users/me
获取当前用户信息

**响应**：
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "ADMIN" | "TEACHER" | "STUDENT"
}
```

## 错误处理

所有 API 在发生错误时返回以下格式：

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

常见错误代码：
- `AUTH_REQUIRED`: 需要认证
- `FORBIDDEN`: 没有权限
- `NOT_FOUND`: 资源不存在
- `VALIDATION_ERROR`: 请求参数验证失败
- `INTERNAL_ERROR`: 服务器内部错误 