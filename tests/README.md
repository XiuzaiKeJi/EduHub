# EduHub 测试文档

## 测试规范

## 一、测试原则

1. 前端页面不进行测试
2. API接口需要完整测试
3. 其他功能仅做最小测试:
   - 1个简单单元测试
   - 1个简单集成测试
4. 避免过度复杂的测试影响开发进度

## 二、测试结构

```
tests/
├── api/                # API接口测试
│   ├── auth.test.ts    # 认证相关接口
│   ├── user.test.ts    # 用户相关接口
│   ├── course.test.ts  # 课程相关接口
│   └── assignment.test.ts # 作业相关接口
├── unit/              # 单元测试
│   └── utils/         # 工具函数测试
└── integration/       # 集成测试
    └── services/      # 服务层测试
```

## 三、测试规范

### 1. API测试规范
- 每个接口至少测试:
  - 成功场景
  - 失败场景
  - 参数验证
- 使用统一的测试工具和mock数据

### 2. 单元测试规范
- 只测试核心功能
- 每个函数一个测试用例
- 避免复杂的测试场景

### 3. 集成测试规范
- 只测试关键业务流程
- 每个流程一个测试用例
- 使用真实数据

## 四、测试工具

1. Jest - 测试框架
2. Supertest - API测试
3. Mock - 数据模拟

## 五、测试命令

```bash
# 运行所有测试
npm test

# 运行API测试
npm test tests/api

# 运行单元测试
npm test tests/unit

# 运行集成测试
npm test tests/integration
```

## 测试覆盖率要求

所有 API 测试必须达到 100% 的覆盖率要求：
- 分支覆盖率（branches）: 100%
- 函数覆盖率（functions）: 100%
- 行覆盖率（lines）: 100%
- 语句覆盖率（statements）: 100%

## 目录结构

```
src/
  ├── lib/
  │   ├── api/              # API 实现
  │   │   ├── __tests__/    # API 测试
  │   │   │   ├── test-utils.ts    # 测试工具
  │   │   │   └── auth.test.ts     # 认证相关测试
  │   │   └── auth.ts       # 认证相关实现
  │   └── db/               # 数据库相关
  └── app/
      └── api/              # API 路由
          └── auth/         # 认证相关路由
              ├── login/    # 登录
              └── register/ # 注册
```

## 测试工具

### 1. 测试请求创建 (createTestRequest)

```typescript
createTestRequest(url: string, options: RequestInit = {})
```

用于创建测试请求，支持自定义 URL 和请求选项。

示例：
```typescript
const request = createTestRequest('http://localhost/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
})
```

### 2. 测试响应创建 (createTestResponse)

```typescript
createTestResponse(data: any, status = 200)
```

用于创建测试响应，支持自定义响应数据和状态码。

示例：
```typescript
const response = createTestResponse({ success: true }, 200)
```

### 3. 响应验证 (validateResponse)

```typescript
validateResponse(response: Response | undefined, expectedStatus: number, expectedData?: any)
```

用于验证响应的状态码和数据。

示例：
```typescript
await validateResponse(response, 200, {
  success: true,
  token: expect.any(String)
})
```

## Mock 配置

### 1. 数据库 Mock (Prisma)

```typescript
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }))
}))
```

### 2. 密码加密 Mock (bcrypt)

```typescript
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}))
```

### 3. API 请求 Mock (fetch)

fetch mock 已配置处理以下端点：
- POST /api/auth/login
- POST /api/auth/register

## 运行测试

1. 运行所有测试：
```bash
pnpm test
```

2. 运行特定测试文件：
```bash
pnpm test src/lib/api/__tests__/auth.test.ts
```

3. 运行带覆盖率报告的测试：
```bash
pnpm test --coverage
```

## 编写新测试

1. 在相应的 `__tests__` 目录下创建测试文件
2. 导入必要的测试工具
3. 使用 `describe` 和 `it` 组织测试用例
4. 使用测试工具创建请求和验证响应
5. 确保测试覆盖所有关键路径

示例：
```typescript
import { createTestRequest, validateResponse } from './test-utils'

describe('Some API', () => {
  it('handles successful request', async () => {
    const request = createTestRequest('http://localhost/api/some-endpoint', {
      method: 'POST',
      body: JSON.stringify({ /* request data */ })
    })

    const response = await fetch(request)
    await validateResponse(response, 200, {
      success: true,
      /* expected response data */
    })
  })
})
```

## 常见问题

1. 测试失败时的调试步骤：
   - 检查 mock 配置是否正确
   - 确认请求参数格式
   - 验证预期的响应格式
   - 查看测试覆盖率报告找出未覆盖的代码路径

2. 添加新的 mock：
   - 在 jest.setup.js 中添加相应的 mock 配置
   - 确保 mock 实现了所需的功能
   - 在测试用例中验证 mock 的行为

3. 更新测试配置：
   - 修改 jest.config.js 中的配置
   - 更新 jest.setup.js 中的全局设置
   - 重新运行测试验证更改 