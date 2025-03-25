# 安全规范文档

## 1. 认证与授权

### 1.1 用户认证
- 使用 NextAuth.js 进行身份认证
- 实现 JWT 令牌认证
- 密码加密使用 bcrypt
- 会话管理：
  - 令牌有效期：24小时
  - 刷新令牌有效期：7天
  - 自动登出：30分钟无活动

### 1.2 角色权限
```typescript
enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  USER = 'USER'
}

interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' }
  ],
  TEACHER: [
    { resource: 'courses', action: 'create' },
    { resource: 'courses', action: 'read' },
    { resource: 'courses', action: 'update' }
  ],
  USER: [
    { resource: 'tasks', action: 'create' },
    { resource: 'tasks', action: 'read' },
    { resource: 'tasks', action: 'update' }
  ]
}
```

## 2. 数据安全

### 2.1 数据加密
- 敏感数据加密存储
- 使用环境变量存储密钥
- 数据库字段加密：
  ```typescript
  // 加密字段示例
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    password  String   // 加密存储
    name      String
    role      Role     @default(USER)
  }
  ```

### 2.2 数据验证
- 使用 Zod 进行输入验证
- API 请求验证：
  ```typescript
  const taskSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    dueDate: z.date().optional()
  })
  ```

## 3. API 安全

### 3.1 请求限制
- 使用 rate limiting
- 配置示例：
  ```typescript
  import rateLimit from 'express-rate-limit'
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制100次请求
  })
  ```

### 3.2 CORS 配置
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGINS },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' }
        ]
      }
    ]
  }
}
```

## 4. 前端安全

### 4.1 XSS 防护
- 使用 React 内置的 XSS 防护
- 配置 CSP 头：
  ```typescript
  // next.config.js
  module.exports = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
            }
          ]
        }
      ]
    }
  }
  ```

### 4.2 CSRF 防护
- 使用 CSRF 令牌
- 配置示例：
  ```typescript
  import { csrf } from '@/lib/csrf'
  
  export default function handler(req, res) {
    if (req.method === 'POST') {
      if (!csrf.validate(req)) {
        return res.status(403).json({ error: 'Invalid CSRF token' })
      }
    }
    // 处理请求
  }
  ```

## 5. 日志与监控

### 5.1 安全日志
```typescript
interface SecurityLog {
  timestamp: Date;
  event: string;
  userId?: string;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
}

// 日志记录示例
const logSecurityEvent = async (event: SecurityLog) => {
  await prisma.securityLog.create({
    data: {
      timestamp: new Date(),
      event: event.event,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details
    }
  })
}
```

### 5.2 监控告警
- 异常登录监控
- 敏感操作监控
- 系统异常监控
- 配置示例：
  ```typescript
  const monitorSecurity = {
    checkFailedLogins: async (userId: string) => {
      const failedAttempts = await prisma.loginAttempt.count({
        where: {
          userId,
          success: false,
          timestamp: {
            gte: new Date(Date.now() - 15 * 60 * 1000)
          }
        }
      })
      
      if (failedAttempts >= 5) {
        await sendAlert({
          type: 'SECURITY',
          message: `用户 ${userId} 登录失败次数过多`
        })
      }
    }
  }
  ```

## 6. 安全审计

### 6.1 定期审计
- 每月进行安全审计
- 审计内容包括：
  - 用户权限检查
  - 系统配置检查
  - 安全漏洞扫描
  - 日志分析

### 6.2 漏洞修复
- 发现漏洞后24小时内修复
- 修复流程：
  1. 评估漏洞风险
  2. 制定修复方案
  3. 实施修复
  4. 验证修复效果
  5. 更新安全文档

## 7. 应急响应

### 7.1 安全事件响应
- 建立应急响应机制
- 响应流程：
  1. 发现安全事件
  2. 评估事件影响
  3. 采取应急措施
  4. 修复问题
  5. 恢复服务
  6. 总结改进

### 7.2 备份恢复
- 定期数据备份
- 备份策略：
  - 每日增量备份
  - 每周完整备份
  - 异地备份存储
  - 定期恢复测试 