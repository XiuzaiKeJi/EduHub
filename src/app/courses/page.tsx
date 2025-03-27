import { Suspense } from 'react'
import { CourseList } from '@/components/course/CourseList'
import { CourseCategoryManager } from '@/components/course/CourseCategoryManager'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getCourses } from '@/lib/api/courses'
import { getCategories } from '@/lib/api/categories'
import { getTeachers } from '@/lib/api/teachers'

export default async function CoursesPage() {
  const [courses, categories, teachers] = await Promise.all([
    getCourses(),
    getCategories(),
    getTeachers(),
  ])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">课程管理</h1>
        <Button>
          <Plus className="w-4 h-4 mr-1" />
          新建课程
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧分类管理 */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div>加载中...</div>}>
            <CourseCategoryManager
              categories={categories}
              onAddCategory={async () => {}}
              onUpdateCategory={async () => {}}
              onDeleteCategory={async () => {}}
            />
          </Suspense>
        </div>

        {/* 右侧课程列表 */}
        <div className="lg:col-span-3">
          <Suspense fallback={<div>加载中...</div>}>
            <CourseList
              courses={courses}
              total={courses.length}
              page={1}
              pageSize={10}
              categories={categories}
              onSearch={async () => {}}
              onSort={async () => {}}
              onFilter={async () => {}}
              onPageChange={async () => {}}
              onPageSizeChange={async () => {}}
              onCreateCourse={() => {}}
              onViewCourse={() => {}}
              onEditCourse={() => {}}
              onDeleteCourse={() => {}}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 