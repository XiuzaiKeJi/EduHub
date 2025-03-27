import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '../TaskCard'
import { TaskStatus, TaskPriority } from '@/types/task'

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

const mockOnUpdate = jest.fn()
const mockOnDelete = jest.fn()

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('测试任务')).toBeInTheDocument()
    expect(screen.getByText('这是一个测试任务')).toBeInTheDocument()
    expect(screen.getByText('截止日期：2024-12-31')).toBeInTheDocument()
    expect(screen.getByText('创建者：user1')).toBeInTheDocument()
    expect(screen.getByText('负责人：user2')).toBeInTheDocument()
  })

  it('handles status change', () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const statusSelect = screen.getByRole('combobox', { name: /状态/i })
    fireEvent.change(statusSelect, { target: { value: TaskStatus.IN_PROGRESS } })

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask.id, {
      status: TaskStatus.IN_PROGRESS,
    })
  })

  it('handles priority change', () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const prioritySelect = screen.getByRole('combobox', { name: /优先级/i })
    fireEvent.change(prioritySelect, { target: { value: TaskPriority.HIGH } })

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask.id, {
      priority: TaskPriority.HIGH,
    })
  })

  it('handles delete button click', () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByText('删除')
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })

  it('renders without description when not provided', () => {
    const taskWithoutDescription = {
      ...mockTask,
      description: undefined,
    }

    render(
      <TaskCard
        task={taskWithoutDescription}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.queryByText('这是一个测试任务')).not.toBeInTheDocument()
  })

  it('renders without assignee when not provided', () => {
    const taskWithoutAssignee = {
      ...mockTask,
      assigneeId: undefined,
    }

    render(
      <TaskCard
        task={taskWithoutAssignee}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.queryByText('负责人：user2')).not.toBeInTheDocument()
  })
}) 