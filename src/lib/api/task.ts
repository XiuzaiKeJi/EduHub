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

export async function getTaskById(id: string): Promise<Task | null> {
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
    throw new Error('获取任务详情失败');
  }
} 