import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/display/Badge';
import { formatDate } from '@/lib/utils/date';
import { getTaskById, Task } from '@/lib/api/task';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TaskDetailProps {
  taskId: string;
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        setLoading(true);
        setError(null);
        const taskData = await getTaskById(taskId);
        setTask(taskData);
      } catch (err) {
        setError('获取任务详情失败');
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <Card className="p-6" data-testid="loading-skeleton">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-20 w-full mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!task) {
    return (
      <Alert>
        <AlertDescription>未找到任务</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
      <div className="flex gap-2 mb-4">
        <Badge variant={task.status === 'DONE' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'default'}>
          {task.status === 'DONE' ? '已完成' : task.status === 'IN_PROGRESS' ? '进行中' : '待处理'}
        </Badge>
        <Badge variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'warning' : 'default'}>
          {task.priority === 'HIGH' ? '高优先级' : task.priority === 'MEDIUM' ? '中优先级' : '低优先级'}
        </Badge>
      </div>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="text-sm text-gray-500">
        <p>截止日期: {formatDate(task.dueDate)}</p>
        {task.assignee && <p>负责人: {task.assignee.name}</p>}
        <p>创建时间: {formatDate(task.createdAt)}</p>
        <p>最后更新: {formatDate(task.updatedAt)}</p>
      </div>
    </Card>
  );
} 