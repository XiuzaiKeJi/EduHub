import React from 'react'
import { TaskStatus, TaskPriority, TaskFilters as TaskFiltersType } from '@/types/task'

interface TaskFiltersProps {
  filters: TaskFiltersType
  onChange: (filters: TaskFiltersType) => void
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TaskStatus | ''
    if (value === '') {
      const { status, ...rest } = filters
      onChange(rest)
    } else {
      onChange({ ...filters, status: value })
    }
  }

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TaskPriority | ''
    if (value === '') {
      const { priority, ...rest } = filters
      onChange(rest)
    } else {
      onChange({ ...filters, priority: value })
    }
  }

  return (
    <div className="flex space-x-4">
      <div>
        <label
          htmlFor="status-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          状态
        </label>
        <select
          id="status-filter"
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">全部</option>
          {Object.values(TaskStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="priority-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          优先级
        </label>
        <select
          id="priority-filter"
          value={filters.priority || ''}
          onChange={handlePriorityChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">全部</option>
          {Object.values(TaskPriority).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 