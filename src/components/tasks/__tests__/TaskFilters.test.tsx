import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskFilters from '../TaskFilters'
import { TaskStatus, TaskPriority } from '@/types/task'

const mockOnChange = jest.fn()

describe('TaskFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders filter controls', () => {
    render(<TaskFilters filters={{}} onChange={mockOnChange} />)

    expect(screen.getByLabelText('状态')).toBeInTheDocument()
    expect(screen.getByLabelText('优先级')).toBeInTheDocument()
  })

  it('handles status filter change', () => {
    render(<TaskFilters filters={{}} onChange={mockOnChange} />)

    const statusSelect = screen.getByLabelText('状态')
    fireEvent.change(statusSelect, { target: { value: TaskStatus.TODO } })

    expect(mockOnChange).toHaveBeenCalledWith({
      status: TaskStatus.TODO,
    })
  })

  it('handles priority filter change', () => {
    render(<TaskFilters filters={{}} onChange={mockOnChange} />)

    const prioritySelect = screen.getByLabelText('优先级')
    fireEvent.change(prioritySelect, { target: { value: TaskPriority.HIGH } })

    expect(mockOnChange).toHaveBeenCalledWith({
      priority: TaskPriority.HIGH,
    })
  })

  it('clears status filter when selecting empty option', () => {
    render(
      <TaskFilters
        filters={{ status: TaskStatus.TODO }}
        onChange={mockOnChange}
      />
    )

    const statusSelect = screen.getByLabelText('状态')
    fireEvent.change(statusSelect, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith({})
  })

  it('clears priority filter when selecting empty option', () => {
    render(
      <TaskFilters
        filters={{ priority: TaskPriority.HIGH }}
        onChange={mockOnChange}
      />
    )

    const prioritySelect = screen.getByLabelText('优先级')
    fireEvent.change(prioritySelect, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith({})
  })

  it('preserves existing filters when changing one filter', () => {
    render(
      <TaskFilters
        filters={{ status: TaskStatus.TODO }}
        onChange={mockOnChange}
      />
    )

    const prioritySelect = screen.getByLabelText('优先级')
    fireEvent.change(prioritySelect, { target: { value: TaskPriority.HIGH } })

    expect(mockOnChange).toHaveBeenCalledWith({
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
    })
  })
}) 