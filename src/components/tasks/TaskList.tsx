import React, { useState, useMemo } from 'react'
import { Task, TaskStatus, TaskPriority, TaskFilters, TaskSortOptions } from '@/types/task'
import TaskCard from './TaskCard'
import TaskFilters from './TaskFilters'
import TaskSort from './TaskSort'

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
}

export default function TaskList({ tasks, onTaskUpdate, onTaskDelete }: TaskListProps) {
  const [filters, setFilters] = useState<TaskFilters>({})
  const [sortOptions, setSortOptions] = useState<TaskSortOptions>({
    field: 'createdAt',
    direction: 'desc',
  })

  // 应用筛选
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status && task.status !== filters.status) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false
      if (filters.creatorId && task.creatorId !== filters.creatorId) return false
      return true
    })
  }, [tasks, filters])

  // 应用排序
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const aValue = a[sortOptions.field]
      const bValue = b[sortOptions.field]
      
      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })
  }, [filteredTasks, sortOptions])

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters)
  }

  const handleSortChange = (newSort: TaskSortOptions) => {
    setSortOptions(newSort)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TaskFilters filters={filters} onChange={handleFilterChange} />
        <TaskSort sort={sortOptions} onChange={handleSortChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
          />
        ))}
      </div>

      {sortedTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          没有找到符合条件的任务
        </div>
      )}
    </div>
  )
} 