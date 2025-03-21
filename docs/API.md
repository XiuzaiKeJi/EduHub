# EduHub API 文档

## 概述
本文档详细说明了 EduHub 项目的 API 接口规范。

## 基础信息
- 基础URL: `http://localhost:3000/api/v1`
- 所有请求和响应均使用 JSON 格式
- 认证方式：JWT Token

## API 端点

### 认证相关
#### 登录
- 方法：POST
- 路径：`/auth/login`
- 请求体：
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- 响应：
  ```json
  {
    "token": "string",
    "user": {
      "id": "number",
      "username": "string",
      "role": "string"
    }
  }
  ```

### 用户管理
#### 获取用户列表
- 方法：GET
- 路径：`/users`
- 权限：管理员
- 查询参数：
  - page: 页码
  - limit: 每页数量
- 响应：
  ```json
  {
    "total": "number",
    "data": [
      {
        "id": "number",
        "username": "string",
        "role": "string",
        "createdAt": "string"
      }
    ]
  }
  ```

## 错误处理
所有API错误响应遵循以下格式：
```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## 状态码
- 200: 成功
- 201: 创建成功
- 400: 请求错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

## 版本历史
- v1.0.0 - 初始版本
