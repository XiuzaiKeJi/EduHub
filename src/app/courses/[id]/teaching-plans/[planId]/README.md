# 教学计划详情页面

## 页面说明

教学计划详情页面是一个用于展示和管理教学计划的综合页面，集成了以下功能：

- 展示教学计划基本信息
- 管理教学计划进度
- 管理教学计划资源
- 支持标签页切换不同功能模块

## 页面结构

### 1. 基本信息区域
- 标题和状态显示
- 教学目标
- 教学内容
- 教学方法
- 教学评价

### 2. 功能模块区域
- 教学进度管理
- 教学资源管理

## 组件集成

### 1. TeachingPlanProgress 组件
```tsx
<TeachingPlanProgress
  planId={planId}
  onProgressUpdate={(progressId) => {
    // 处理进度更新
  }}
/>
```

### 2. TeachingPlanResource 组件
```tsx
<TeachingPlanResource
  planId={planId}
  onResourceUpdate={(resourceId) => {
    // 处理资源更新
  }}
/>
```

## 数据流

### 1. 页面数据获取
```typescript
const response = await fetch(`/api/courses/${courseId}/teaching-plans/${planId}`)
const plan = await response.json()
```

### 2. 组件数据同步
- 进度更新时触发 `onProgressUpdate` 回调
- 资源更新时触发 `onResourceUpdate` 回调

## 路由参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 课程ID |
| planId | string | 教学计划ID |

## 样式

页面使用 Tailwind CSS 进行样式设计，主要样式类包括：

- 容器布局：`container mx-auto py-6 space-y-6`
- 卡片样式：`p-6`
- 标签页样式：`space-y-4`
- 状态标签：`px-2 py-1 rounded-full text-sm`

## 依赖组件

- Card
- Tabs
- TeachingPlanProgress
- TeachingPlanResource

## 注意事项

1. 确保传入正确的路由参数
2. 处理数据加载失败的情况
3. 保持组件间的数据同步
4. 注意页面性能优化
5. 遵循无障碍设计原则

## 示例

### 基础使用
```tsx
// 访问路径：/courses/123/teaching-plans/456
export default function TeachingPlanPage({ params }) {
  const { id: courseId, planId } = params
  // ... 组件实现
}
```

### 自定义样式
```tsx
<div className="max-w-4xl mx-auto">
  <TeachingPlanPage params={params} />
</div>
``` 