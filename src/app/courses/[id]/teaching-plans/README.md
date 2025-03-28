# 教学计划列表页面

## 页面说明

教学计划列表页面是一个用于展示和管理课程教学计划的页面，提供以下功能：

- 展示课程基本信息
- 展示教学计划列表
- 支持创建新的教学计划
- 支持编辑现有教学计划
- 支持删除教学计划
- 支持搜索教学计划

## 页面结构

### 1. 头部区域
- 课程标题和描述
- 新建教学计划按钮

### 2. 功能区域
- 搜索框
- 教学计划列表
  - 计划标题
  - 计划状态
  - 创建和更新时间
  - 操作菜单（查看、编辑、删除）

## 组件集成

### 1. TeachingPlanList 组件
```tsx
<TeachingPlanList courseId={courseId} />
```

## 数据流

### 1. 页面数据获取
```typescript
const response = await fetch(`/api/courses/${courseId}`)
const course = await response.json()
```

### 2. 组件数据同步
- 创建教学计划时更新列表
- 编辑教学计划时更新列表
- 删除教学计划时更新列表

## 路由参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 课程ID |

## 样式

页面使用 Tailwind CSS 进行样式设计，主要样式类包括：

- 容器布局：`container mx-auto py-6 space-y-6`
- 头部布局：`flex items-center justify-between`
- 搜索框：`relative pl-8`
- 列表布局：`space-y-4`

## 依赖组件

- Button
- Input
- Card
- TeachingPlanList

## 注意事项

1. 确保传入正确的课程ID
2. 处理数据加载失败的情况
3. 保持列表数据的实时性
4. 注意页面性能优化
5. 遵循无障碍设计原则

## 示例

### 基础使用
```tsx
// 访问路径：/courses/123/teaching-plans
export default function TeachingPlansPage({ params }) {
  const { id: courseId } = params
  // ... 组件实现
}
```

### 自定义样式
```tsx
<div className="max-w-4xl mx-auto">
  <TeachingPlansPage params={params} />
</div>
``` 