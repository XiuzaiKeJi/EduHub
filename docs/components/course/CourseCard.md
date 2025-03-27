# 课程卡片组件

## 组件说明
课程卡片组件用于展示单个课程的详细信息，包括课程基本信息、状态、教师信息、学生信息等。

## 组件属性
| 属性名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| course | Course | 是 | 课程数据 |
| onView | (course: Course) => void | 否 | 查看课程详情回调函数 |
| onEdit | (course: Course) => void | 否 | 编辑课程回调函数 |
| onDelete | (course: Course) => void | 否 | 删除课程回调函数 |

## 使用示例
```tsx
import { CourseCard } from '@/components/course/CourseCard'

export default function CoursePage() {
  const handleView = (course: Course) => {
    // 处理查看课程
  }

  const handleEdit = (course: Course) => {
    // 处理编辑课程
  }

  const handleDelete = (course: Course) => {
    // 处理删除课程
  }

  return (
    <CourseCard
      course={course}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
```

## 注意事项
1. 组件依赖以下库：
   - shadcn/ui 组件库
   - date-fns 日期处理库
   - Lucide 图标库
2. 需要提供完整的课程数据
3. 课程状态（进行中/已结束）根据当前日期自动判断 