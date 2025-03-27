import React from 'react'
import { Task, TaskStatus, TaskPriority } from '@/types/task'
import { TaskCard } from './TaskCard'
import { TaskFilters } from './TaskFilters'
import { TaskSort } from './TaskSort'

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskDelete: (taskId: string) => void
  filters: {
    status?: TaskStatus
    priority?: TaskPriority
    search?: string
  }
  onFiltersChange: (filters: { status?: TaskStatus; priority?: TaskPriority; search?: string }) => void
  sortBy: string
  onSortChange: (sortBy: string) => void
}

export function TaskList({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
}: TaskListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <TaskFilters filters={filters} onChange={onFiltersChange} />
        <TaskSort value={sortBy} onChange={onSortChange} />
      </div>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
          />
        ))}
      </div>
    </div>
  )
} 