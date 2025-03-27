import React from 'react'
import { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority } from '@/types/task'

interface TaskFiltersProps {
  filters: TaskFiltersType
  onChange: (filters: TaskFiltersType) => void
}

export default function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const handleStatusChange = (status: TaskStatus | '') => {
    onChange({
      ...filters,
      status: status || undefined,
    })
  }

  const handlePriorityChange = (priority: TaskPriority | '') => {
    onChange({
      ...filters,
      priority: priority || undefined,
    })
  }

  return (
    <div className="flex space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          状态
        </label>
        <select
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus | '')}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          优先级
        </label>
        <select
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value as TaskPriority | '')}
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