import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TaskDetail } from '../TaskDetail';
import { getTaskById } from '@/lib/api/task';

jest.mock('@/lib/api/task');

const mockTask = {
  id: '1',
  title: '测试任务',
  description: '这是一个测试任务的描述',
  status: 'IN_PROGRESS' as const,
  priority: 'HIGH' as const,
  dueDate: '2024-03-28T00:00:00Z',
  createdAt: '2024-03-27T00:00:00Z',
  updatedAt: '2024-03-27T00:00:00Z',
  assignee: {
    id: '1',
    name: '测试用户',
  },
};

describe('TaskDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('显示加载状态', () => {
    (getTaskById as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<TaskDetail taskId="1" />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('成功加载并显示任务详情', async () => {
    (getTaskById as jest.Mock).mockResolvedValue(mockTask);
    render(<TaskDetail taskId="1" />);

    await waitFor(() => {
      expect(screen.getByText('测试任务')).toBeInTheDocument();
    });

    expect(screen.getByText('进行中')).toBeInTheDocument();
    expect(screen.getByText('高优先级')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试任务的描述')).toBeInTheDocument();
    expect(screen.getByText(/测试用户/)).toBeInTheDocument();
  });

  it('显示错误信息当加载失败时', async () => {
    const errorMessage = '获取任务详情失败: 数据库连接失败';
    (getTaskById as jest.Mock).mockRejectedValue(new Error(errorMessage));
    render(<TaskDetail taskId="1" />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('显示未找到任务信息当任务不存在时', async () => {
    (getTaskById as jest.Mock).mockResolvedValue(null);
    render(<TaskDetail taskId="999" />);

    await waitFor(() => {
      expect(screen.getByText('未找到任务')).toBeInTheDocument();
    });
  });

  it('点击重试按钮时重新加载任务', async () => {
    const errorMessage = '获取任务详情失败';
    (getTaskById as jest.Mock)
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(mockTask);

    render(<TaskDetail taskId="1" />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /重试/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('测试任务')).toBeInTheDocument();
    });
  });

  it('当taskId为空时不加载任务', () => {
    render(<TaskDetail taskId="" />);
    expect(getTaskById).not.toHaveBeenCalled();
  });
}); 