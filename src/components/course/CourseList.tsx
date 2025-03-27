import { FC } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Course, CourseSortField, CourseStatus } from '@/types/course'
import { CourseCard } from './CourseCard'

interface CourseListProps {
  courses: Course[]
  total: number
  page: number
  pageSize: number
  categories: { id: string; name: string }[]
  onSearch?: (keyword: string) => void
  onSort?: (sortBy: CourseSortField) => void
  onFilter?: (categoryId: string, status: CourseStatus) => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onCreateCourse?: () => void
  onViewCourse?: (course: Course) => void
  onEditCourse?: (course: Course) => void
  onDeleteCourse?: (course: Course) => void
}

export const CourseList: FC<CourseListProps> = ({
  courses,
  total,
  page,
  pageSize,
  categories,
  onSearch,
  onSort,
  onFilter,
  onPageChange,
  onPageSizeChange,
  onCreateCourse,
  onViewCourse,
  onEditCourse,
  onDeleteCourse
}) => {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      {/* 搜索和筛选区域 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="搜索课程名称或代码..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => onFilter?.(value, 'ALL')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部分类</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => onFilter?.('ALL', value as CourseStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="课程状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部状态</SelectItem>
            <SelectItem value="PLANNED">未开始</SelectItem>
            <SelectItem value="IN_PROGRESS">进行中</SelectItem>
            <SelectItem value="COMPLETED">已结束</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => onSort?.(value as CourseSortField)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">按名称排序</SelectItem>
            <SelectItem value="startDate">按开始日期排序</SelectItem>
            <SelectItem value="endDate">按结束日期排序</SelectItem>
            <SelectItem value="currentStudents">按学生数排序</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onCreateCourse}>新建课程</Button>
      </div>

      {/* 课程列表区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onView={onViewCourse}
            onEdit={onEditCourse}
            onDelete={onDeleteCourse}
          />
        ))}
      </div>

      {/* 分页区域 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">每页显示：</span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">9条</SelectItem>
              <SelectItem value="12">12条</SelectItem>
              <SelectItem value="15">15条</SelectItem>
              <SelectItem value="18">18条</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
          >
            上一页
          </Button>
          <span className="text-sm">第 {page} 页，共 {totalPages} 页</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
} 