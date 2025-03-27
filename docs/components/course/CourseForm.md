# 课程表单组件

## 组件说明
课程表单组件用于创建和编辑课程信息，包含课程基本信息、分类选择、教师选择、时间设置等功能。

## 组件属性
| 属性名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| initialData | Partial<Course> | 否 | 初始课程数据，用于编辑模式 |
| categories | { id: string; name: string }[] | 是 | 课程分类列表 |
| teachers | { id: string; name: string }[] | 是 | 教师列表 |
| onSubmit | (data: CourseFormValues) => void | 是 | 表单提交回调函数 |
| isLoading | boolean | 否 | 加载状态 |

## 表单字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 课程名称，至少2个字符 |
| code | string | 是 | 课程代码，至少2个字符 |
| description | string | 是 | 课程描述，至少10个字符 |
| categoryId | string | 是 | 课程分类ID |
| teacherId | string | 是 | 教师ID |
| startDate | Date | 是 | 开始日期 |
| endDate | Date | 是 | 结束日期 |
| maxStudents | number | 是 | 最大学生数，至少为1 |

## 使用示例
```tsx
import { CourseForm } from '@/components/course/CourseForm'

export default function CoursePage() {
  const handleSubmit = (data: CourseFormValues) => {
    // 处理表单提交
    console.log(data)
  }

  return (
    <CourseForm
      categories={categories}
      teachers={teachers}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}
```

## 注意事项
1. 组件依赖以下库：
   - react-hook-form
   - zod
   - shadcn/ui 组件库
   - date-fns
2. 表单验证规则：
   - 课程名称至少2个字符
   - 课程代码至少2个字符
   - 课程描述至少10个字符
   - 必须选择课程分类和教师
   - 结束日期不能早于开始日期
   - 最大学生数至少为1
3. 日期选择限制：
   - 开始日期不能早于当前日期
   - 结束日期不能早于开始日期 