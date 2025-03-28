# TeachingPlanProgress 组件

## 组件说明

TeachingPlanProgress 是一个用于管理教学计划进度的 React 组件。它提供了以下功能：

- 显示教学计划进度列表
- 创建新的教学进度
- 编辑现有进度
- 删除进度
- 更新进度状态
- 显示完成进度百分比

## 使用方法

```tsx
import { TeachingPlanProgress } from '@/components/teaching-plans/TeachingPlanProgress'

export default function TeachingPlanPage() {
  return (
    <TeachingPlanProgress
      planId="course-123"
      onProgressUpdate={(progressId) => {
        console.log('进度更新:', progressId)
      }}
    />
  )
}
```

## Props

| 属性名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| planId | string | 是 | 教学计划ID |
| onProgressUpdate | (progressId: string) => void | 否 | 进度更新时的回调函数 |

## 功能特性

### 1. 进度列表展示
- 支持加载状态显示
- 空数据状态处理
- 进度卡片展示
  - 标题
  - 状态标签
  - 描述信息
  - 完成进度条

### 2. 进度管理
- 创建新进度
- 编辑现有进度
- 删除进度
- 更新进度状态
  - 未开始
  - 进行中
  - 已完成

### 3. 表单功能
- 标题输入
- 描述输入
- 状态选择
- 完成进度设置
- 表单验证

### 4. 状态管理
- 加载状态
- 错误处理
- 操作反馈
- 数据更新

## API 接口

### 获取进度列表
```typescript
GET /api/courses/:planId/teaching-plans/progress
```

### 创建进度
```typescript
POST /api/courses/:planId/teaching-plans/progress
```

### 更新进度
```typescript
PATCH /api/courses/:planId/teaching-plans/progress/:progressId
```

### 删除进度
```typescript
DELETE /api/courses/:planId/teaching-plans/progress/:progressId
```

### 更新进度状态
```typescript
PATCH /api/courses/:planId/teaching-plans/progress/:progressId/status
```

## 数据结构

### Progress 接口
```typescript
interface Progress {
  id: string
  title: string
  description?: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  completionRate: number
  createdAt: string
  updatedAt: string
}
```

### ProgressFormData 接口
```typescript
interface ProgressFormData {
  title: string
  description?: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  completionRate: number
}
```

## 样式

组件使用 Tailwind CSS 进行样式设计，主要样式类包括：

- 卡片布局：`p-4`
- 状态标签：`px-2 py-1 rounded-full text-sm`
- 进度条：`space-y-2`
- 表单布局：`space-y-4`

## 依赖组件

- Button
- Input
- Textarea
- Select
- Card
- Skeleton
- Dialog
- Form
- Alert
- Progress
- DropdownMenu

## 注意事项

1. 确保传入正确的 `planId`
2. 处理网络请求错误
3. 注意表单验证
4. 保持数据一致性
5. 遵循状态管理最佳实践

## 示例

### 基础使用
```tsx
<TeachingPlanProgress planId="course-123" />
```

### 带回调函数
```tsx
<TeachingPlanProgress
  planId="course-123"
  onProgressUpdate={(progressId) => {
    // 处理进度更新
  }}
/>
```

### 自定义样式
```tsx
<div className="max-w-4xl mx-auto">
  <TeachingPlanProgress planId="course-123" />
</div>
``` 