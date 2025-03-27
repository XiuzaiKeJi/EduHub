import React from 'react'
import { Task, TaskStatus, TaskPriority } from '@/types/task'
import { formatDate } from '@/utils/date'

interface TaskCardProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
}

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800',
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800',
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onUpdate(task.id, { status: newStatus })
  }

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    await onUpdate(task.id, { priority: newPriority })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex space-x-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className={`px-2 py-1 rounded text-sm ${statusColors[task.status]}`}
            aria-label="状态"
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={task.priority}
            onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
            className={`px-2 py-1 rounded text-sm ${priorityColors[task.priority]}`}
            aria-label="优先级"
          >
            {Object.values(TaskPriority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm">{task.description}</p>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          {task.dueDate && (
            <div>
              截止日期：{formatDate(task.dueDate)}
            </div>
          )}
          <div>
            创建者：{task.creatorId}
          </div>
          {task.assigneeId && (
            <div>
              负责人：{task.assigneeId}
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-800"
        >
          删除
        </button>
      </div>
    </div>
  )
} 