import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskForm from '../TaskForm'
import { TaskStatus, TaskPriority } from '@/types/task'

const mockOnSubmit = jest.fn()
const mockOnCancel = jest.fn()

const mockTask = {
  id: '1',
  title: '测试任务',
  description: '这是一个测试任务',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: new Date('2024-12-31'),
  creatorId: 'user1',
  assigneeId: 'user2',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty form for new task', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByLabelText('标题')).toHaveValue('')
    expect(screen.getByLabelText('描述')).toHaveValue('')
    expect(screen.getByLabelText('状态')).toHaveValue(TaskStatus.TODO)
    expect(screen.getByLabelText('优先级')).toHaveValue(TaskPriority.MEDIUM)
    expect(screen.getByLabelText('截止日期')).toHaveValue('')
    expect(screen.getByRole('button', { name: /创建/i })).toBeInTheDocument()
  })

  it('renders form with task data for editing', () => {
    render(
      <TaskForm
        task={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByLabelText('标题')).toHaveValue(mockTask.title)
    expect(screen.getByLabelText('描述')).toHaveValue(mockTask.description)
    expect(screen.getByLabelText('状态')).toHaveValue(mockTask.status)
    expect(screen.getByLabelText('优先级')).toHaveValue(mockTask.priority)
    expect(screen.getByLabelText('截止日期')).toHaveValue('2024-12-31')
    expect(screen.getByRole('button', { name: /更新/i })).toBeInTheDocument()
  })

  it('handles form submission with valid data', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    fireEvent.change(screen.getByLabelText('标题'), {
      target: { value: '新任务' },
    })
    fireEvent.change(screen.getByLabelText('描述'), {
      target: { value: '新任务描述' },
    })
    fireEvent.change(screen.getByLabelText('截止日期'), {
      target: { value: '2024-12-31' },
    })

    fireEvent.click(screen.getByRole('button', { name: /创建/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: '新任务',
        description: '新任务描述',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date('2024-12-31'),
      })
    })
  })

  it('handles form cancellation', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    fireEvent.click(screen.getByRole('button', { name: /取消/i }))

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('displays validation errors for invalid data', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    // 提交空表单
    fireEvent.click(screen.getByRole('button', { name: /创建/i }))

    await waitFor(() => {
      expect(screen.getByText('标题不能为空')).toBeInTheDocument()
      expect(screen.getByText('描述不能为空')).toBeInTheDocument()
      expect(screen.getByText('截止日期不能为空')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('disables submit button while submitting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    fireEvent.change(screen.getByLabelText('标题'), {
      target: { value: '新任务' },
    })
    fireEvent.change(screen.getByLabelText('描述'), {
      target: { value: '新任务描述' },
    })
    fireEvent.change(screen.getByLabelText('截止日期'), {
      target: { value: '2024-12-31' },
    })

    const submitButton = screen.getByRole('button', { name: /创建/i })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('提交中...')

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent('创建')
    })
  })
}) 