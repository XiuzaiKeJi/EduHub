import { Card } from '@/components/display/Card';
import { Badge } from '@/components/display/Badge';
import { formatDate } from '@/lib/utils/date';

interface TaskDetailProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    assignee?: {
      id: string;
      name: string;
    };
  };
}

export function TaskDetail({ task }: TaskDetailProps) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <div className="flex gap-2">
            <Badge type={task.status === 'DONE' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'info'}>
              {task.status === 'TODO' ? '待处理' : task.status === 'IN_PROGRESS' ? '进行中' : '已完成'}
            </Badge>
            <Badge type={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'info'}>
              {task.priority === 'HIGH' ? '高优先级' : task.priority === 'MEDIUM' ? '中优先级' : '低优先级'}
            </Badge>
          </div>
        </div>

        <div className="prose max-w-none">
          <p>{task.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">截止日期：</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div>
            <span className="font-medium">创建时间：</span>
            <span>{formatDate(task.createdAt)}</span>
          </div>
          <div>
            <span className="font-medium">最后更新：</span>
            <span>{formatDate(task.updatedAt)}</span>
          </div>
          {task.assignee && (
            <div>
              <span className="font-medium">负责人：</span>
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 