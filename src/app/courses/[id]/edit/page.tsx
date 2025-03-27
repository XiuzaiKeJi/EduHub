import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CourseForm } from '@/components/course/CourseForm'
import { getCourse } from '@/lib/api/courses'
import { getCategories } from '@/lib/api/categories'
import { getTeachers } from '@/lib/api/teachers'

interface CourseEditPageProps {
  params: {
    id: string
  }
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const [course, categories, teachers] = await Promise.all([
    getCourse(params.id),
    getCategories(),
    getTeachers(),
  ])

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">编辑课程</h1>
        <Suspense fallback={<div>加载中...</div>}>
          <CourseForm
            initialData={course}
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