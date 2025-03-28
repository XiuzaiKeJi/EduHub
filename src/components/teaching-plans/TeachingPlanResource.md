# TeachingPlanResource 组件

## 组件说明

TeachingPlanResource 是一个用于管理教学计划资源的 React 组件。它提供了以下功能：

- 显示教学计划资源列表
- 创建新的教学资源
- 编辑现有资源
- 删除资源
- 支持多种资源类型（文档、图片、视频）
- 显示资源预览链接

## 使用方法

```tsx
import { TeachingPlanResource } from '@/components/teaching-plans/TeachingPlanResource'

export default function TeachingPlanPage() {
  return (
    <TeachingPlanResource
      planId="course-123"
      onResourceUpdate={(resourceId) => {
        console.log('资源更新:', resourceId)
      }}
    />
  )
}
```

## Props

| 属性名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| planId | string | 是 | 教学计划ID |
| onResourceUpdate | (resourceId: string) => void | 否 | 资源更新时的回调函数 |

## 功能特性

### 1. 资源列表展示
- 支持加载状态显示
- 空数据状态处理
- 资源卡片展示
  - 标题
  - 类型标签
  - 描述信息
  - 预览链接

### 2. 资源管理
- 创建新资源
- 编辑现有资源
- 删除资源
- 支持多种资源类型
  - 文档
  - 图片
  - 视频

### 3. 表单功能
- 标题输入
- 描述输入
- 类型选择
- 资源链接输入
- 表单验证

### 4. 状态管理
- 加载状态
- 错误处理
- 操作反馈
- 数据更新

## API 接口

### 获取资源列表
```typescript
GET /api/courses/:planId/teaching-plans/resources
```

### 创建资源
```typescript
POST /api/courses/:planId/teaching-plans/resources
```

### 更新资源
```typescript
PATCH /api/courses/:planId/teaching-plans/resources/:resourceId
```

### 删除资源
```typescript
DELETE /api/courses/:planId/teaching-plans/resources/:resourceId
```

## 数据结构

### Resource 接口
```typescript
interface Resource {
  id: string
  title: string
  description?: string
  type: 'DOCUMENT' | 'IMAGE' | 'VIDEO'
  url: string
  createdAt: string
  updatedAt: string
}
```

### ResourceFormData 接口
```typescript
interface ResourceFormData {
  title: string
  description?: string
  type: 'DOCUMENT' | 'IMAGE' | 'VIDEO'
  url: string
}
```

## 样式

组件使用 Tailwind CSS 进行样式设计，主要样式类包括：

- 卡片布局：`p-4`
- 类型标签：`px-2 py-1 rounded-full text-sm`
- 表单布局：`space-y-4`
- 链接样式：`text-blue-600 hover:underline`

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
<TeachingPlanResource planId="course-123" />
```

### 带回调函数
```tsx
<TeachingPlanResource
  planId="course-123"
  onResourceUpdate={(resourceId) => {
    // 处理资源更新
  }}
/>
```

### 自定义样式
```tsx
<div className="max-w-4xl mx-auto">
  <TeachingPlanResource planId="course-123" />
</div>
``` 