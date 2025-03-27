import { Suspense } from 'react';
import { Card } from '@/components/display/Card';
import { Button } from '@/components/form/Button';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { TaskComments } from '@/components/tasks/TaskComments';
import { TaskAttachments } from '@/components/tasks/TaskAttachments';
import { TaskProgress } from '@/components/tasks/TaskProgress';
import { RelatedTasks } from '@/components/tasks/RelatedTasks';

export default function TaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">任务详情</h1>
        <div className="space-x-2">
          <Button type="secondary">编辑</Button>
          <Button type="primary">完成</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Suspense fallback={<div>加载中...</div>}>
              <TaskDetail taskId={params.id} />
            </Suspense>
          </Card>

          <Card>
            <Suspense fallback={<div>加载中...</div>}>
              <TaskProgress taskId={params.id} />
            </Suspense>
          </Card>

          <Card>
            <Suspense fallback={<div>加载中...</div>}>
              <TaskComments taskId={params.id} />
            </Suspense>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Suspense fallback={<div>加载中...</div>}>
              <TaskAttachments taskId={params.id} />
            </Suspense>
          </Card>

          <Card>
            <Suspense fallback={<div>加载中...</div>}>
              <RelatedTasks taskId={params.id} />
            </Suspense>
          </Card>
        </div>
      </div>
    </div>
  );
} 