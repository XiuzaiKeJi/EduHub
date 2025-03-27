import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CourseDetail } from '@/components/course/CourseDetail'
import { CourseScheduleManager } from '@/components/course/CourseScheduleManager'
import { CourseResourceManager } from '@/components/course/CourseResourceManager'
import { getCourse } from '@/lib/api/courses'

interface CoursePageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.id)

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<div>加载中...</div>}>
        <CourseDetail
          course={course}
          onEdit={() => {}}
          onDelete={() => {}}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 课程时间表 */}
          <div>
            <CourseScheduleManager
              courseId={course.id}
              schedules={course.schedules || []}
              onAddSchedule={async () => {}}
              onUpdateSchedule={async () => {}}
              onDeleteSchedule={async () => {}}
            />
          </div>

          {/* 课程资源 */}
          <div>
            <CourseResourceManager
              courseId={course.id}
              resources={course.resources || []}
              onAddResource={async () => {}}
              onUpdateResource={async () => {}}
              onDeleteResource={async () => {}}
              onUploadFile={async () => ({ url: '', size: 0 })}
            />
          </div>
        </div>
      </Suspense>
    </div>
  )
} 