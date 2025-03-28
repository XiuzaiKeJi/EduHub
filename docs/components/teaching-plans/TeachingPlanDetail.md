# TeachingPlanDetail 组件

教学计划详情组件，用于展示教学计划的详细信息，包括基本信息、进度管理和资源管理。

## 功能特性

- 展示教学计划基本信息
- 展示教学计划进度列表
- 展示教学计划资源列表
- 支持编辑和删除操作
- 支持添加进度和资源
- 加载状态显示
- 错误处理

## 组件接口

### Props

```typescript
interface TeachingPlanDetailProps {
  courseId: string; // 课程ID
  planId: string; // 教学计划ID
}
```

### 数据模型

```typescript
interface TeachingPlan {
  id: string;
  title: string;
  description: string | null;
  objectives: string | null;
  semester: string | null;
  academicYear: string | null;
  createdAt: string;
  updatedAt: string;
  progress: TeachingPlanProgress[];
  resources: TeachingPlanResource[];
}

interface TeachingPlanProgress {
  id: string;
  title: string;
  description: string | null;
  weekNumber: number | null;
  status: string;
  completionRate: number;
  startDate: string | null;
  endDate: string | null;
  note: string | null;
}

interface TeachingPlanResource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string;
  size: number | null;
  format: string | null;
  order: number;
}
```

## 使用示例

```tsx
import { TeachingPlanDetail } from "@/components/teaching-plans/TeachingPlanDetail";

export default function TeachingPlanDetailPage({ 
  params 
}: { 
  params: { courseId: string; planId: string } 
}) {
  return (
    <div className="container py-6">
      <TeachingPlanDetail 
        courseId={params.courseId} 
        planId={params.planId} 
      />
    </div>
  );
}
```

## API 接口

### 获取教学计划详情

```typescript
GET /api/courses/:courseId/teaching-plans/:planId
```

响应：
```typescript
{
  id: string;
  title: string;
  description: string | null;
  objectives: string | null;
  semester: string | null;
  academicYear: string | null;
  createdAt: string;
  updatedAt: string;
  progress: TeachingPlanProgress[];
  resources: TeachingPlanResource[];
}
```

### 删除教学计划

```typescript
DELETE /api/courses/:courseId/teaching-plans/:planId
```

## 依赖组件

- Card
- Badge
- Skeleton
- Tabs
- Progress
- DropdownMenu
- Button
- Toast

## 注意事项

1. 组件需要在客户端渲染
2. 需要提供有效的课程ID和教学计划ID
3. 需要配置正确的API路由
4. 需要安装并配置toast组件
5. 进度和资源的管理功能需要单独实现 