# 测试规范文档

## 1. 测试类型

### 1.1 单元测试
- 使用 Jest 和 React Testing Library
- 测试覆盖率要求：80%
- 测试文件命名：`*.test.ts` 或 `*.test.tsx`
- 测试目录结构：
```
src/
  ├── components/
  │   └── __tests__/
  │       └── Component.test.tsx
  └── lib/
      └── __tests__/
          └── utils.test.ts
```

### 1.2 集成测试
- 使用 Cypress
- 测试用户交互流程
- 测试 API 集成
- 测试文件命名：`*.cy.ts`
- 测试目录结构：
```
cypress/
  ├── e2e/
  │   └── features/
  │       └── task-management.cy.ts
  └── support/
      └── commands.ts
```

### 1.3 E2E 测试
- 使用 Cypress
- 测试完整业务流程
- 测试文件命名：`*.e2e.ts`
- 测试目录结构：
```
cypress/
  └── e2e/
      └── flows/
          └── user-journey.e2e.ts
```

## 2. 测试规范

### 2.1 单元测试规范
```typescript
// 组件测试示例
import { render, screen } from '@testing-library/react'
import { TaskCard } from '@/components/tasks/TaskCard'

describe('TaskCard', () => {
  it('should render task title', () => {
    const task = {
      id: '1',
      title: '测试任务',
      status: 'TODO'
    }
    render(<TaskCard task={task} />)
    expect(screen.getByText('测试任务')).toBeInTheDocument()
  })
})

// 工具函数测试示例
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-03-25')
    expect(formatDate(date)).toBe('2024-03-25')
  })
})
```

### 2.2 集成测试规范
```typescript
// Cypress 测试示例
describe('任务管理', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/tasks')
  })

  it('should create new task', () => {
    cy.get('[data-testid="create-task-button"]').click()
    cy.get('[data-testid="task-title-input"]').type('新任务')
    cy.get('[data-testid="submit-task-button"]').click()
    cy.get('[data-testid="task-list"]').should('contain', '新任务')
  })
})
```

### 2.3 E2E 测试规范
```typescript
// E2E 测试示例
describe('用户旅程', () => {
  it('should complete task workflow', () => {
    // 登录
    cy.login()
    
    // 创建任务
    cy.createTask({
      title: '测试任务',
      description: '这是一个测试任务',
      priority: 'HIGH'
    })
    
    // 更新任务状态
    cy.updateTaskStatus('测试任务', 'IN_PROGRESS')
    
    // 完成任务
    cy.completeTask('测试任务')
    
    // 验证任务状态
    cy.get('[data-testid="task-status"]').should('have.text', '已完成')
  })
})
```

## 3. 测试覆盖率要求

### 3.1 覆盖率指标
- 语句覆盖率：80%
- 分支覆盖率：80%
- 函数覆盖率：80%
- 行覆盖率：80%

### 3.2 覆盖率报告
```json
{
  "coverage": {
    "statements": 85,
    "branches": 82,
    "functions": 88,
    "lines": 85
  }
}
```

## 4. 测试工具配置

### 4.1 Jest 配置
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

### 4.2 Cypress 配置
```javascript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    screenshotOnRunFailure: true
  }
})
```

## 5. 测试数据管理

### 5.1 测试数据工厂
```typescript
// test/factories/task.ts
export const createTask = (overrides = {}) => ({
  id: '1',
  title: '测试任务',
  description: '这是一个测试任务',
  status: 'TODO',
  priority: 'MEDIUM',
  assigneeId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})
```

### 5.2 测试数据库
- 使用 SQLite 内存数据库
- 每个测试前重置数据库
- 使用事务确保测试隔离

## 6. 测试命令

### 6.1 运行测试
```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行集成测试
pnpm test:integration

# 运行 E2E 测试
pnpm test:e2e

# 运行测试覆盖率报告
pnpm test:coverage
```

### 6.2 测试脚本
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testMatch='**/__tests__/**/*.test.ts'",
    "test:integration": "cypress run",
    "test:e2e": "cypress run --spec 'cypress/e2e/flows/**/*.e2e.ts'",
    "test:coverage": "jest --coverage"
  }
}
``` 