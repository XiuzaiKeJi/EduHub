# EduHub 用户认证系统设计

## 一、系统概述

### 1.1 目标
- 提供安全可靠的用户认证机制
- 实现灵活的角色权限控制
- 支持多种认证方式
- 保证系统安全性

### 1.2 功能范围
- 用户注册和登录
- 角色和权限管理
- 密码管理
- 会话管理
- 安全审计

## 二、系统架构

### 2.1 技术栈
- 后端：Node.js + Express + TypeScript
- 数据库：SQLite
- 认证：JWT (JSON Web Token)
- 密码加密：bcrypt
- 日志：Winston

### 2.2 核心模块
1. 认证模块
   - 用户注册
   - 用户登录
   - 密码重置
   - Token管理

2. 授权模块
   - 角色管理
   - 权限管理
   - 访问控制

3. 安全模块
   - 密码加密
   - 请求验证
   - 日志记录

## 三、数据模型

### 3.1 用户表 (users)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| username | VARCHAR(50) | 用户名 |
| password | VARCHAR(100) | 加密密码 |
| email | VARCHAR(100) | 邮箱 |
| mobile | VARCHAR(20) | 手机号 |
| real_name | VARCHAR(50) | 真实姓名 |
| avatar_url | VARCHAR(255) | 头像URL |
| status | TINYINT | 状态 |
| is_admin | BOOLEAN | 是否管理员 |
| last_login_at | DATETIME | 最后登录时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| deleted_at | DATETIME | 删除时间 |

### 3.2 角色表 (roles)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | VARCHAR(50) | 角色名称 |
| description | VARCHAR(255) | 角色描述 |
| sort_order | INTEGER | 排序 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| deleted_at | DATETIME | 删除时间 |

### 3.3 权限表 (permissions)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | VARCHAR(50) | 权限名称 |
| code | VARCHAR(50) | 权限代码 |
| description | VARCHAR(255) | 权限描述 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

## 四、API设计

### 4.1 用户认证API
```typescript
// 用户注册
POST /api/v1/auth/register
Request:
{
  username: string;
  password: string;
  email: string;
  mobile?: string;
  real_name?: string;
}
Response:
{
  id: number;
  username: string;
  email: string;
  token: string;
}

// 用户登录
POST /api/v1/auth/login
Request:
{
  username: string;
  password: string;
}
Response:
{
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
  }
}

// 重置密码
POST /api/v1/auth/reset-password
Request:
{
  email: string;
}
Response:
{
  message: string;
}
```

### 4.2 角色权限API
```typescript
// 获取角色列表
GET /api/v1/roles

// 创建角色
POST /api/v1/roles

// 更新角色
PUT /api/v1/roles/:id

// 删除角色
DELETE /api/v1/roles/:id

// 获取权限列表
GET /api/v1/permissions

// 为角色分配权限
POST /api/v1/roles/:id/permissions
```

## 五、安全设计

### 5.1 密码安全
- 使用bcrypt加密存储密码
- 密码强度要求：
  - 最少8位
  - 包含大小写字母
  - 包含数字
  - 包含特殊字符

### 5.2 Token安全
- JWT有效期：2小时
- 使用RefreshToken机制
- Token黑名单机制

### 5.3 请求安全
- 使用HTTPS
- 实现CSRF防护
- 实现Rate Limiting
- 输入验证和消毒

### 5.4 日志审计
- 记录用户登录日志
- 记录权限变更日志
- 记录敏感操作日志

## 六、部署说明

### 6.1 环境要求
- Node.js >= 18
- SQLite 3
- PM2（生产环境）

### 6.2 配置项
```env
# JWT配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=2h

# 密码配置
PASSWORD_SALT_ROUNDS=10

# 日志配置
LOG_LEVEL=info
LOG_FILE=logs/auth.log
```

### 6.3 部署步骤
1. 安装依赖
2. 配置环境变量
3. 初始化数据库
4. 启动服务
5. 配置反向代理

## 七、测试计划

### 7.1 单元测试
- 用户认证逻辑测试
- 密码加密测试
- Token生成和验证测试

### 7.2 集成测试
- API接口测试
- 数据库操作测试
- 权限控制测试

### 7.3 性能测试
- 并发登录测试
- Token验证性能测试
- 数据库性能测试 