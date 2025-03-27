import React from 'react'
import { TaskSortOptions } from '@/types/task'

interface TaskSortProps {
  sort: TaskSortOptions
  onChange: (sort: TaskSortOptions) => void
}

const sortFields = [
  { value: 'dueDate', label: '截止日期' },
  { value: 'priority', label: '优先级' },
  { value: 'status', label: '状态' },
  { value: 'createdAt', label: '创建时间' },
  { value: 'updatedAt', label: '更新时间' },
]

export default function TaskSort({ sort, onChange }: TaskSortProps) {
  const handleFieldChange = (field: string) => {
    onChange({
      ...sort,
      field,
    })
  }

  const handleDirectionChange = (direction: 'asc' | 'desc') => {
    onChange({
      ...sort,
      direction,
    })
  }

  return (
    <div className="flex items-center space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          排序字段
        </label>
        <select
          value={sort.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {sortFields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          排序方向
        </label>
        <select
          value={sort.direction}
          onChange={(e) => handleDirectionChange(e.target.value as 'asc' | 'desc')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="asc">升序</option>
          <option value="desc">降序</option>
        </select>
      </div>
    </div>
  )
} 