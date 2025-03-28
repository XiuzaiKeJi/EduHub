# TeachingPlanForm 组件

教学计划表单组件，用于创建和编辑教学计划。

## 功能特性

- 支持创建和编辑模式
- 表单验证
- 加载状态显示
- 错误处理
- 用户反馈

## 组件接口

### Props

```typescript
interface TeachingPlanFormProps {
  courseId: string; // 课程ID
  planId?: string; // 教学计划ID（编辑模式需要）
  mode: "create" | "edit"; // 表单模式
}
```

### 表单数据模型

```typescript
const formSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().optional(),
  objectives: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
});
```

## 使用示例

```tsx
import { TeachingPlanForm } from "@/components/teaching-plans/TeachingPlanForm";

// 创建模式
export default function CreateTeachingPlanPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">新建教学计划</h1>
      <TeachingPlanForm courseId={params.courseId} mode="create" />
    </div>
  );
}

// 编辑模式
export default function EditTeachingPlanPage({ 
  params 
}: { 
  params: { courseId: string; planId: string } 
}) {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">编辑教学计划</h1>
      <TeachingPlanForm 
        courseId={params.courseId} 
        planId={params.planId} 
        mode="edit" 
      />
    </div>
  );
}
```

## API 接口

### 创建教学计划

```typescript
POST /api/courses/:courseId/teaching-plans
```

请求体：
```typescript
{
  title: string;
  description?: string;
  objectives?: string;
  semester?: string;
  academicYear?: string;
}
```

### 更新教学计划

```typescript
PATCH /api/courses/:courseId/teaching-plans/:planId
```

请求体：
```typescript
{
  title?: string;
  description?: string;
  objectives?: string;
  semester?: string;
  academicYear?: string;
}
```

## 依赖组件

- Form
- Input
- Textarea
- Button
- Card
- Skeleton
- Toast

## 注意事项

1. 组件需要在客户端渲染
2. 需要提供有效的课程ID
3. 编辑模式需要提供有效的教学计划ID
4. 需要配置正确的API路由
5. 需要安装并配置toast组件 