import { notFound } from 'next/navigation'
import { TeachingPlanProgress } from '@/components/teaching-plans/TeachingPlanProgress'
import { TeachingPlanResource } from '@/components/teaching-plans/TeachingPlanResource'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TeachingPlanPageProps {
  params: {
    id: string
    planId: string
  }
}

export default async function TeachingPlanPage({ params }: TeachingPlanPageProps) {
  const { id: courseId, planId } = params

  // 获取教学计划详情
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/teaching-plans/${planId}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    notFound()
  }

  const plan = await response.json()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{plan.title}</h1>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-sm ${
            plan.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
            plan.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {plan.status === 'DRAFT' ? '草稿' :
             plan.status === 'IN_PROGRESS' ? '进行中' :
             '已完成'}
          </span>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">教学目标</h2>
            <p className="text-gray-600">{plan.objectives}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">教学内容</h2>
            <p className="text-gray-600">{plan.content}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">教学方法</h2>
            <p className="text-gray-600">{plan.methods}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">教学评价</h2>
            <p className="text-gray-600">{plan.evaluation}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">教学进度</TabsTrigger>
          <TabsTrigger value="resources">教学资源</TabsTrigger>
        </TabsList>
        <TabsContent value="progress">
          <TeachingPlanProgress
            planId={planId}
            onProgressUpdate={(progressId) => {
              console.log('进度更新:', progressId)
            }}
          />
        </TabsContent>
        <TabsContent value="resources">
          <TeachingPlanResource
            planId={planId}
            onResourceUpdate={(resourceId) => {
              console.log('资源更新:', resourceId)
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 