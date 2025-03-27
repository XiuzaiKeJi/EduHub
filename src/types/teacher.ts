import { User } from './course'

export interface Teacher {
  id: string
  userId: string
  user?: User
  title?: string
  bio?: string
  education?: string
  experience?: string
  specialties?: string
  subjects?: string
  achievements?: string
  contactInfo?: string
  officeHours?: string
  officeLocation?: string
  createdAt: Date
  updatedAt: Date
  qualifications?: TeacherQualification[]
  evaluations?: TeacherEvaluation[]
}

export interface TeacherQualification {
  id: string
  teacherId: string
  teacher?: Teacher
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  description?: string
  certificate?: string
  createdAt: Date
  updatedAt: Date
}

export interface TeacherEvaluation {
  id: string
  teacherId: string
  teacher?: Teacher
  courseId?: string
  course?: any
  rating: number
  comment?: string
  semester?: string
  anonymous: boolean
  createdAt: Date
  updatedAt: Date
}

export type TeacherListResponse = {
  teachers: Teacher[]
  total: number
  page: number
  pageSize: number
} 