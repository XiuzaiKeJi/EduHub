export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  startDate?: Date
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  creatorId: string
  assigneeId: string
  courseId?: string
}

export interface Course {
  id: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  name: string
  description: string
  leaderId: string
  leader: User
  members: User[]
  createdAt: Date
  updatedAt: Date
} 