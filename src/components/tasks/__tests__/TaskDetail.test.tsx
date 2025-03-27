import { render, screen } from '@testing-library/react';
import { TaskDetail } from '../TaskDetail';

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
  it('renders task details correctly', () => {
    render(<TaskDetail task={mockTask} />);
    
    expect(screen.getByText('测试任务')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试任务的描述')).toBeInTheDocument();
    expect(screen.getByText('进行中')).toBeInTheDocument();
    expect(screen.getByText('高优先级')).toBeInTheDocument();
    expect(screen.getByText('负责人：')).toBeInTheDocument();
    expect(screen.getByText('测试用户')).toBeInTheDocument();
  });
}); 