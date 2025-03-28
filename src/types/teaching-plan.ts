import type { Course } from './course'

export type TeachingPlanStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'

export interface TeachingPlan {
  id: string
  courseId: string
  course?: Course
  title: string
  description?: string
  objectives?: string
  semester?: string
  academicYear?: string
  createdAt: Date
  updatedAt: Date
  progress?: TeachingPlanProgress[]
  resources?: TeachingPlanResource[]
}

export interface TeachingPlanProgress {
  id: string
  planId: string
  plan?: TeachingPlan
  title: string
  description?: string
  weekNumber?: number
  status: TeachingPlanStatus
  completionRate: number
  startDate?: Date
  endDate?: Date
  note?: string
  createdAt: Date
  updatedAt: Date
}

export interface TeachingPlanResource {
  id: string
  planId: string
  plan?: TeachingPlan
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

export interface TeachingPlanListResponse {
  plans: TeachingPlan[]
  total: number
  page: number
  pageSize: number
}

export interface TeachingPlanProgressListResponse {
  progress: TeachingPlanProgress[]
  total: number
  page: number
  pageSize: number
}

export interface TeachingPlanResourceListResponse {
  resources: TeachingPlanResource[]
  total: number
  page: number
  pageSize: number
}

export type TeachingPlanSortField = 'title' | 'createdAt' | 'updatedAt'
export type TeachingPlanSortOrder = 'asc' | 'desc' 