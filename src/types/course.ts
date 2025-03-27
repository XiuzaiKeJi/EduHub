export type CourseStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'

export type CourseSortField = 'name' | 'startDate' | 'endDate' | 'currentStudents'

export interface CourseSchedule {
  id: string
  courseId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  location?: string
  room?: string
  teacherId: string
  teacher?: User
  createdAt: Date
  updatedAt: Date
}

export interface CourseResource {
  id: string
  courseId: string
  title: string
  description?: string
  type: string
  url: string
  size?: number
  format?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CourseCategory {
  id: string
  name: string
  description?: string
  parentId?: string
  parent?: CourseCategory
  children?: CourseCategory[]
  courses?: Course[]
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  name: string
  description?: string
  code: string
  categoryId: string
  category?: CourseCategory
  startDate: Date
  endDate: Date
  status: CourseStatus
  maxStudents?: number
  currentStudents?: number
  teacherId: string
  teacher?: User
  students?: User[]
  createdAt: Date
  updatedAt: Date
  tasks?: Task[]
  schedules?: CourseSchedule[]
  resources?: CourseResource[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
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
  createdBy: User
  assigneeId?: string
  assignedTo?: User
  courseId?: string
  course?: Course
}

export interface CourseListResponse {
  courses: Course[]
  total: number
  page: number
  pageSize: number
}

export type CourseSortOrder = 'asc' | 'desc' 