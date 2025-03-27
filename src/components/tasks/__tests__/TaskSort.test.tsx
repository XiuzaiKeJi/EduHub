import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskSort from '../TaskSort'

const mockOnChange = jest.fn()

describe('TaskSort', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sort controls', () => {
    render(
      <TaskSort
        sort={{ field: 'createdAt', direction: 'desc' }}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByLabelText('排序字段')).toBeInTheDocument()
    expect(screen.getByLabelText('排序方向')).toBeInTheDocument()
  })

  it('handles field change', () => {
    render(
      <TaskSort
        sort={{ field: 'createdAt', direction: 'desc' }}
        onChange={mockOnChange}
      />
    )

    const fieldSelect = screen.getByLabelText('排序字段')
    fireEvent.change(fieldSelect, { target: { value: 'dueDate' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      field: 'dueDate',
      direction: 'desc',
    })
  })

  it('handles direction change', () => {
    render(
      <TaskSort
        sort={{ field: 'createdAt', direction: 'desc' }}
        onChange={mockOnChange}
      />
    )

    const directionSelect = screen.getByLabelText('排序方向')
    fireEvent.change(directionSelect, { target: { value: 'asc' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      field: 'createdAt',
      direction: 'asc',
    })
  })

  it('renders all sort fields', () => {
    render(
      <TaskSort
        sort={{ field: 'createdAt', direction: 'desc' }}
        onChange={mockOnChange}
      />
    )

    const fieldSelect = screen.getByLabelText('排序字段')
    expect(fieldSelect).toHaveValue('createdAt')
    expect(fieldSelect).toHaveTextContent('截止日期')
    expect(fieldSelect).toHaveTextContent('优先级')
    expect(fieldSelect).toHaveTextContent('状态')
    expect(fieldSelect).toHaveTextContent('创建时间')
    expect(fieldSelect).toHaveTextContent('更新时间')
  })

  it('renders sort directions', () => {
    render(
      <TaskSort
        sort={{ field: 'createdAt', direction: 'desc' }}
        onChange={mockOnChange}
      />
    )

    const directionSelect = screen.getByLabelText('排序方向')
    expect(directionSelect).toHaveValue('desc')
    expect(directionSelect).toHaveTextContent('升序')
    expect(directionSelect).toHaveTextContent('降序')
  })
}) 