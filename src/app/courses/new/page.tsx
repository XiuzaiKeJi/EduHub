import { Suspense } from 'react'
import { CourseForm } from '@/components/course/CourseForm'
import { getCategories } from '@/lib/api/categories'
import { getTeachers } from '@/lib/api/teachers'

export default async function NewCoursePage() {
  const [categories, teachers] = await Promise.all([
    getCategories(),
    getTeachers(),
  ])

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">创建新课程</h1>
        <Suspense fallback={<div>加载中...</div>}>
          <CourseForm
            categories={categories}
            teachers={teachers}
            onSubmit={async () => {}}
            onCancel={() => {}}
          />
        </Suspense>
      </div>
    </div>
  )
} 