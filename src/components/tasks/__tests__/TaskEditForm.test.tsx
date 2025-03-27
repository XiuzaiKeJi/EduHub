import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskEditForm } from '../TaskEditForm';
import { updateTask } from '@/lib/api/task';
import userEvent from '@testing-library/user-event';

jest.mock('@/lib/api/task');

const mockTask = {
  id: '1',
  title: '测试任务',
  description: '测试描述',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '2024-03-20T00:00:00Z',
  createdAt: '2024-03-19T00:00:00Z',
  updatedAt: '2024-03-19T00:00:00Z',
  assignee: {
    id: '1',
    name: '测试用户'
  }
};

describe('TaskEditForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染表单', () => {
    render(
      <TaskEditForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('textbox', { name: '标题' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '描述' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '状态' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '优先级' })).toBeInTheDocument();
    expect(screen.getByLabelText('截止日期')).toBeInTheDocument();
  });

  it('应该显示加载状态', () => {
    render(
      <TaskEditForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('应该显示错误信息', () => {
    const errorMessage = '更新失败';
    render(
      <TaskEditForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('应该验证必填字段', async () => {
    render(
      <TaskEditForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const titleInput = screen.getByRole('textbox', { name: '标题' });
    await userEvent.clear(titleInput);
    const submitButton = screen.getByRole('button', { name: '保存' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument();
    });
  });

  it('应该成功提交表单', async () => {
    render(
      <TaskEditForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: '保存' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('应该在提交时禁用表单', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <TaskEditForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: '保存' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveAttribute('disabled');
      expect(screen.getByText('保存中...')).toBeInTheDocument();
    });
  });

  it('应该正确处理取消操作', async () => {
    render(
      <TaskEditForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: '取消' });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 