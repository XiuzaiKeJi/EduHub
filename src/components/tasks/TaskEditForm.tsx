import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, UpdateTaskInput } from '@/lib/api/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  description: z.string().max(1000, '描述不能超过1000个字符').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().min(1, '截止日期不能为空'),
  assigneeId: z.string().nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskEditFormProps {
  task: Task;
  onSubmit: (data: UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function TaskEditForm({ task, onSubmit, onCancel, isLoading, error }: TaskEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      assigneeId: task.assignee?.id || null,
    },
  });

  const onSubmitForm = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('提交表单失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="skeleton">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          标题
        </label>
        <Input
          id="title"
          {...register('title')}
          disabled={isSubmitting}
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-500" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          描述
        </label>
        <Textarea
          id="description"
          {...register('description')}
          disabled={isSubmitting}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-red-500" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            状态
          </label>
          <Select
            defaultValue={task.status}
            onValueChange={(value) => register('status').onChange({ target: { value } })}
            disabled={isSubmitting}
            name="status"
          >
            <SelectTrigger id="status" aria-label="状态">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">待处理</SelectItem>
              <SelectItem value="IN_PROGRESS">进行中</SelectItem>
              <SelectItem value="DONE">已完成</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500" role="alert">
              {errors.status.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium">
            优先级
          </label>
          <Select
            defaultValue={task.priority}
            onValueChange={(value) => register('priority').onChange({ target: { value } })}
            disabled={isSubmitting}
            name="priority"
          >
            <SelectTrigger id="priority" aria-label="优先级">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">低</SelectItem>
              <SelectItem value="MEDIUM">中</SelectItem>
              <SelectItem value="HIGH">高</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-red-500" role="alert">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="dueDate" className="text-sm font-medium">
          截止日期
        </label>
        <Input
          id="dueDate"
          type="date"
          {...register('dueDate')}
          disabled={isSubmitting}
          aria-invalid={errors.dueDate ? 'true' : 'false'}
          aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
        />
        {errors.dueDate && (
          <p id="dueDate-error" className="text-sm text-red-500" role="alert">
            {errors.dueDate.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  );
} 