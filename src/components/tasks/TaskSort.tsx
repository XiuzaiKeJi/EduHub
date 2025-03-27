import React from 'react'

interface TaskSortProps {
  value: string
  onChange: (value: string) => void
}

const sortFields = [
  { value: 'dueDate', label: '截止日期' },
  { value: 'priority', label: '优先级' },
  { value: 'status', label: '状态' },
  { value: 'createdAt', label: '创建时间' },
  { value: 'updatedAt', label: '更新时间' },
]

export function TaskSort({ value, onChange }: TaskSortProps) {
  return (
    <div className="flex items-center space-x-4">
      <div>
        <label
          htmlFor="sort-field"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          排序字段
        </label>
        <select
          id="sort-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {sortFields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 