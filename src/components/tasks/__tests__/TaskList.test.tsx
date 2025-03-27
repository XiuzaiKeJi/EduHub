import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskList from '../TaskList'
import { TaskStatus, TaskPriority } from '@/types/task'

const mockTasks = [
  {
    id: '1',
    title: '任务1',
    description: '描述1',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2024-12-31'),
    creatorId: 'user1',
    assigneeId: 'user2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: '任务2',
    description: '描述2',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: new Date('2024-12-30'),
    creatorId: 'user1',
    assigneeId: 'user3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockOnTaskUpdate = jest.fn()
const mockOnTaskDelete = jest.fn()

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    expect(screen.getByText('任务1')).toBeInTheDocument()
    expect(screen.getByText('任务2')).toBeInTheDocument()
  })

  it('filters tasks by status', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const statusSelect = screen.getByLabelText('状态')
    fireEvent.change(statusSelect, { target: { value: TaskStatus.TODO } })

    expect(screen.getByText('任务1')).toBeInTheDocument()
    expect(screen.queryByText('任务2')).not.toBeInTheDocument()
  })

  it('filters tasks by priority', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const prioritySelect = screen.getByLabelText('优先级')
    fireEvent.change(prioritySelect, { target: { value: TaskPriority.HIGH } })

    expect(screen.queryByText('任务1')).not.toBeInTheDocument()
    expect(screen.getByText('任务2')).toBeInTheDocument()
  })

  it('sorts tasks by due date', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const sortFieldSelect = screen.getByLabelText('排序字段')
    fireEvent.change(sortFieldSelect, { target: { value: 'dueDate' } })

    const sortDirectionSelect = screen.getByLabelText('排序方向')
    fireEvent.change(sortDirectionSelect, { target: { value: 'asc' } })

    const tasks = screen.getAllByRole('article')
    expect(tasks[0]).toHaveTextContent('任务2')
    expect(tasks[1]).toHaveTextContent('任务1')
  })

  it('displays empty state when no tasks match filters', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
      />
    )

    const statusSelect = screen.getByLabelText('状态')
    fireEvent.change(statusSelect, { target: { value: TaskStatus.DONE } })

    expect(screen.getByText('没有找到符合条件的任务')).toBeInTheDocument()
  })
}) 