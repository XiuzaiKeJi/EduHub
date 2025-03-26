export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  user: User
}

export interface Course {
  id: string
  name: string
  description: string
  teacherId: string
  teacher: User
  students: User[]
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