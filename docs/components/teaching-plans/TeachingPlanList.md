# TeachingPlanList 组件

教学计划列表组件，用于展示和管理课程的教学计划。

## 功能特性

- 展示教学计划列表
- 支持分页
- 支持搜索
- 支持筛选
- 支持创建、编辑、删除操作
- 显示加载状态
- 错误处理

## 组件接口

### Props

```typescript
interface TeachingPlanListProps {
  courseId: string; // 课程ID
}
```

### 数据模型

```typescript
interface TeachingPlan {
  id: string;
  title: string;
  description: string | null;
  semester: string | null;
  academicYear: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## 使用示例

```tsx
import { TeachingPlanList } from "@/components/teaching-plans/TeachingPlanList";

export default function CourseTeachingPlansPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">教学计划</h1>
      <TeachingPlanList courseId={params.courseId} />
    </div>
  );
}
```

## API 接口

### 获取教学计划列表

```typescript
GET /api/courses/:courseId/teaching-plans
```

查询参数：
- `page`: 页码（默认1）
- `search`: 搜索关键词

响应：
```typescript
{
  plans: TeachingPlan[];
  totalPages: number;
}
```

### 删除教学计划

```typescript
DELETE /api/courses/:courseId/teaching-plans/:planId
```

## 依赖组件

- Button
- Input
- Card
- Badge
- Skeleton
- DropdownMenu
- Toast

## 注意事项

1. 组件需要在客户端渲染
2. 需要提供有效的课程ID
3. 需要配置正确的API路由
4. 需要安装并配置toast组件 