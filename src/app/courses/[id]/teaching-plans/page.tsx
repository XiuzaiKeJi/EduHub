import { notFound } from 'next/navigation'
import { TeachingPlanList } from '@/components/teaching-plans/TeachingPlanList'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface TeachingPlansPageProps {
  params: {
    id: string
  }
}

export default async function TeachingPlansPage({ params }: TeachingPlansPageProps) {
  const { id: courseId } = params

  // 获取课程详情
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    notFound()
  }

  const course = await response.json()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{course.title} - 教学计划</h1>
          <p className="text-gray-600 mt-1">{course.description}</p>
        </div>
        <Link href={`/courses/${courseId}/teaching-plans/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建教学计划
          </Button>
        </Link>
      </div>

      <TeachingPlanList courseId={courseId} />
    </div>
  )
} 