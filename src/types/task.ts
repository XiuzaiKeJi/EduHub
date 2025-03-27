import { z } from 'zod'

// 任务状态
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]

// 任务优先级
export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority]

// 任务验证模式
export const TaskSchema = z.object({
  id: z.string().optional(), // 创建时可选
  title: z.string().min(1, '标题不能为空').max(100, '标题最多100个字符'),
  description: z.string().max(1000, '描述最多1000个字符').optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .default(TaskStatus.TODO),
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
    .default(TaskPriority.MEDIUM),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  creatorId: z.string(),
})

// Task 类型
export type Task = z.infer<typeof TaskSchema>

// 创建任务的输入类型
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>

// 更新任务的输入类型
export type UpdateTaskInput = Partial<CreateTaskInput>

// 任务列表的过滤条件
export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  creatorId?: string
  dueDate?: {
    start?: Date
    end?: Date
  }
}

// 任务列表的排序选项
export interface TaskSortOptions {
  field: 'dueDate' | 'priority' | 'status' | 'createdAt' | 'updatedAt'
  direction: 'asc' | 'desc'
} 