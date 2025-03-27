import { getTaskById, updateTask } from '../task';
import { prisma } from '@/lib/db';
import { createTestResponse, resetMocks } from './test-utils';

jest.mock('@/lib/db', () => ({
  prisma: {
    task: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Task API', () => {
  const mockTask = {
    id: '1',
    title: '测试任务',
    description: '这是一个测试任务的描述',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: new Date('2024-03-28T00:00:00Z'),
    createdAt: new Date('2024-03-27T00:00:00Z'),
    updatedAt: new Date('2024-03-27T00:00:00Z'),
    assignee: {
      id: '1',
      name: '测试用户',
    },
  };

  beforeEach(() => {
    resetMocks();
  });

  describe('getTaskById', () => {
    it('returns task when found', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await getTaskById('1');

      expect(result).toEqual({
        ...mockTask,
        dueDate: mockTask.dueDate.toISOString(),
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString(),
      });
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('returns null when task not found', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getTaskById('999');

      expect(result).toBeNull();
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('throws error when taskId is empty', async () => {
      await expect(getTaskById('')).rejects.toThrow('任务ID不能为空');
    });

    it('throws error with detailed message when database error occurs', async () => {
      const dbError = new Error('数据库连接失败');
      (prisma.task.findUnique as jest.Mock).mockRejectedValue(dbError);

      await expect(getTaskById('1')).rejects.toThrow('获取任务详情失败: 数据库连接失败');
    });
  });

  describe('updateTask', () => {
    const updateInput = {
      title: '更新后的任务',
      description: '更新后的描述',
      status: 'DONE' as const,
      priority: 'LOW' as const,
      dueDate: '2024-03-29T00:00:00Z',
      assigneeId: '2',
    };

    it('成功更新任务', async () => {
      const updatedTask = {
        ...mockTask,
        ...updateInput,
        dueDate: new Date(updateInput.dueDate),
        updatedAt: new Date(),
      };

      (prisma.task.findUnique as jest.Mock).mockResolvedValueOnce(mockTask);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: '2', name: '新用户' });
      (prisma.task.update as jest.Mock).mockResolvedValueOnce(updatedTask);

      const result = await updateTask('1', updateInput);

      expect(result).toEqual({
        ...updatedTask,
        dueDate: updatedTask.dueDate.toISOString(),
        createdAt: updatedTask.createdAt.toISOString(),
        updatedAt: updatedTask.updatedAt.toISOString(),
      });
    });

    it('当任务不存在时抛出错误', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(updateTask('999', updateInput)).rejects.toThrow('更新任务失败: 任务不存在');
    });

    it('当指定的用户不存在时抛出错误', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValueOnce(mockTask);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(updateTask('1', updateInput)).rejects.toThrow('更新任务失败: 指定的用户不存在');
    });

    it('当taskId为空时抛出错误', async () => {
      await expect(updateTask('', updateInput)).rejects.toThrow('任务ID不能为空');
    });

    it('当数据库更新失败时抛出错误', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValueOnce(mockTask);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: '2', name: '新用户' });
      (prisma.task.update as jest.Mock).mockRejectedValueOnce(new Error('数据库错误'));

      await expect(updateTask('1', updateInput)).rejects.toThrow('更新任务失败: 数据库错误');
    });
  });
}); 