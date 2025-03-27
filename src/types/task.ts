import { z } from 'zod'

// 任务状态
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const

// 任务优先级
export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const

// 任务验证模式
export const TaskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  description: z.string().max(1000, '描述不能超过1000个字符').optional(),
  status: z.string().refine((val) => Object.values(TaskStatus).includes(val as any)),
  priority: z.string().refine((val) => Object.values(TaskPriority).includes(val as any)),
  dueDate: z.string().min(1, '截止日期不能为空').transform((val) => new Date(val)).optional(),
  assigneeId: z.string().optional(),
})

// Task 类型
export type Task = z.infer<typeof TaskSchema>

// 创建任务的输入类型
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>

// 更新任务的输入类型
export type UpdateTaskInput = Partial<CreateTaskInput>

// 任务列表的过滤条件
export interface TaskFilters {
  status?: typeof TaskStatus[keyof typeof TaskStatus]
  priority?: typeof TaskPriority[keyof typeof TaskPriority]
  search?: string
  assigneeId?: string
  creatorId?: string
}

// 任务列表的排序选项
export interface TaskSortOptions {
  field: keyof Task
  direction: 'asc' | 'desc'
} 