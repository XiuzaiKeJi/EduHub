# 课程列表组件

## 组件说明
课程列表组件用于展示课程信息，支持搜索、排序和分页功能。

## 组件属性
| 属性名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| courses | Course[] | 是 | 课程列表数据 |
| total | number | 是 | 课程总数 |
| page | number | 是 | 当前页码 |
| pageSize | number | 是 | 每页显示数量 |
| onSearch | (keyword: string) => void | 否 | 搜索回调函数 |
| onSort | (sortBy: CourseSortField) => void | 否 | 排序回调函数 |
| onPageChange | (page: number) => void | 否 | 页码变更回调函数 |
| onCreateCourse | () => void | 否 | 创建课程回调函数 |

## 使用示例
```tsx
import { CourseList } from '@/components/course/CourseList'

export default function CoursePage() {
  const handleSearch = (keyword: string) => {
    // 处理搜索
  }

  const handleSort = (sortBy: CourseSortField) => {
    // 处理排序
  }

  const handlePageChange = (page: number) => {
    // 处理页码变更
  }

  const handleCreateCourse = () => {
    // 处理创建课程
  }

  return (
    <CourseList
      courses={courses}
      total={total}
      page={page}
      pageSize={pageSize}
      onSearch={handleSearch}
      onSort={handleSort}
      onPageChange={handlePageChange}
      onCreateCourse={handleCreateCourse}
    />
  )
}
```

## 注意事项
1. 组件依赖 shadcn/ui 组件库
2. 需要提供完整的课程数据
3. 分页、排序等功能需要配合后端API使用 