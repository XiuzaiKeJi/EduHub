import { getTaskById } from '../task';
import { prisma } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  prisma: {
    task: {
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
    jest.clearAllMocks();
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

    it('throws error when database query fails', async () => {
      const error = new Error('Database error');
      (prisma.task.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(getTaskById('1')).rejects.toThrow('获取任务详情失败');
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
  });
}); 