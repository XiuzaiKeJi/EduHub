import { prisma } from '@/lib/db';

export interface Task {
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
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assigneeId?: string | null;
}

export async function getTaskById(id: string): Promise<Task | null> {
  if (!id) {
    throw new Error('任务ID不能为空');
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      return null;
    }

    return {
      ...task,
      dueDate: task.dueDate.toISOString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('获取任务详情失败:', error);
    if (error instanceof Error) {
      throw new Error(`获取任务详情失败: ${error.message}`);
    }
    throw new Error('获取任务详情失败');
  }
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  if (!id) {
    throw new Error('任务ID不能为空');
  }

  try {
    // 验证任务是否存在
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error('任务不存在');
    }

    // 如果更新了assigneeId，验证用户是否存在
    if (input.assigneeId !== undefined) {
      if (input.assigneeId) {
        const user = await prisma.user.findUnique({
          where: { id: input.assigneeId },
        });
        if (!user) {
          throw new Error('指定的用户不存在');
        }
      }
    }

    // 更新任务
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      ...updatedTask,
      dueDate: updatedTask.dueDate.toISOString(),
      createdAt: updatedTask.createdAt.toISOString(),
      updatedAt: updatedTask.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('更新任务失败:', error);
    if (error instanceof Error) {
      throw new Error(`更新任务失败: ${error.message}`);
    }
    throw new Error('更新任务失败');
  }
} 