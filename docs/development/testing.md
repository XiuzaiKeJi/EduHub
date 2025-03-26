# 测试文档

## 测试策略

### 单元测试
- 使用 Jest 和 React Testing Library 进行单元测试
- 测试覆盖所有组件和工具函数
- 关注组件的行为而不是实现细节
- 使用模拟（mock）来隔离外部依赖

### 集成测试
- 测试组件之间的交互
- 测试路由和页面导航
- 测试表单提交和数据流
- 测试错误处理和边界情况

### 端到端测试
- 使用 Cypress 进行端到端测试
- 测试关键用户流程
- 测试真实环境下的功能
- 测试性能和加载时间

## 测试最佳实践

### 组件测试
```typescript
// 好的测试示例
it('renders with required props', () => {
  render(<Component requiredProp="value" />)
  expect(screen.getByText('value')).toBeInTheDocument()
})

// 测试用户交互
it('handles user input', async () => {
  render(<Component />)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'test' } })
  expect(input).toHaveValue('test')
})

// 测试异步操作
it('handles async operations', async () => {
  render(<Component />)
  const button = screen.getByRole('button')
  fireEvent.click(button)
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})
```

### 工具函数测试
```typescript
// 测试纯函数
it('returns expected result', () => {
  expect(utilityFunction(input)).toBe(expectedOutput)
})

// 测试边界情况
it('handles edge cases', () => {
  expect(utilityFunction(null)).toBeNull()
  expect(utilityFunction(undefined)).toBeUndefined()
})

// 测试错误处理
it('throws error for invalid input', () => {
  expect(() => utilityFunction(invalidInput)).toThrow()
})
```

### 模拟和存根
```typescript
// 模拟 API 调用
jest.mock('api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'test' })
}))

// 模拟路由
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}))

// 模拟认证
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { name: 'Test User' } },
    status: 'authenticated'
  })
}))
```

## 测试覆盖率要求

- 语句覆盖率：> 80%
- 分支覆盖率：> 80%
- 函数覆盖率：> 80%
- 行覆盖率：> 80%

## 测试命令

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test src/components/Button.test.tsx

# 运行测试并生成覆盖率报告
pnpm test --coverage

# 监视模式运行测试
pnpm test --watch

# 运行端到端测试
pnpm test:e2e
```

## 测试文件组织

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
  utils/
    format.ts
    format.test.ts
  __tests__/
    integration/
      auth.test.ts
    e2e/
      login.test.ts
```

## 常见问题解决

### 1. 测试异步组件
```typescript
it('handles async component', async () => {
  render(<AsyncComponent />)
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### 2. 测试路由变化
```typescript
it('navigates to new route', async () => {
  const router = useRouter()
  render(<NavigationComponent />)
  fireEvent.click(screen.getByText('Navigate'))
  expect(router.push).toHaveBeenCalledWith('/new-route')
})
```

### 3. 测试表单提交
```typescript
it('submits form data', async () => {
  const handleSubmit = jest.fn()
  render(<Form onSubmit={handleSubmit} />)
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'Test User' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(handleSubmit).toHaveBeenCalledWith({ name: 'Test User' })
})
```

## 持续集成

- 每次提交时运行测试
- 生成并上传测试覆盖率报告
- 在合并请求前要求通过所有测试
- 定期运行端到端测试

## 测试维护

- 定期更新测试用例
- 删除过时的测试
- 重构测试以提高可维护性
- 保持测试文档的更新 