import { TaskSchema, TaskStatus, TaskPriority } from '../task'

describe('Task Schema Validation', () => {
  const validTask = {
    title: '完成数学作业',
    description: '完成第三章的练习题',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2024-12-31'),
    creatorId: 'user123',
  }

  it('should validate a valid task', () => {
    const result = TaskSchema.safeParse(validTask)
    expect(result.success).toBe(true)
  })

  it('should require a title', () => {
    const invalidTask = { ...validTask, title: '' }
    const result = TaskSchema.safeParse(invalidTask)
    expect(result.success).toBe(false)
  })

  it('should validate title length', () => {
    const longTitle = 'x'.repeat(101)
    const invalidTask = { ...validTask, title: longTitle }
    const result = TaskSchema.safeParse(invalidTask)
    expect(result.success).toBe(false)
  })

  it('should validate description length', () => {
    const longDesc = 'x'.repeat(1001)
    const invalidTask = { ...validTask, description: longDesc }
    const result = TaskSchema.safeParse(invalidTask)
    expect(result.success).toBe(false)
  })

  it('should validate status enum values', () => {
    const invalidTask = { ...validTask, status: 'INVALID_STATUS' }
    const result = TaskSchema.safeParse(invalidTask)
    expect(result.success).toBe(false)
  })

  it('should validate priority enum values', () => {
    const invalidTask = { ...validTask, priority: 'INVALID_PRIORITY' }
    const result = TaskSchema.safeParse(invalidTask)
    expect(result.success).toBe(false)
  })

  it('should allow optional dueDate', () => {
    const taskWithoutDueDate = { ...validTask }
    delete taskWithoutDueDate.dueDate
    const result = TaskSchema.safeParse(taskWithoutDueDate)
    expect(result.success).toBe(true)
  })

  it('should allow optional assigneeId', () => {
    const taskWithAssignee = { ...validTask, assigneeId: 'user456' }
    const result = TaskSchema.safeParse(taskWithAssignee)
    expect(result.success).toBe(true)
  })

  it('should require creatorId', () => {
    const taskWithoutCreator = { ...validTask }
    delete taskWithoutCreator.creatorId
    const result = TaskSchema.safeParse(taskWithoutCreator)
    expect(result.success).toBe(false)
  })
}) 