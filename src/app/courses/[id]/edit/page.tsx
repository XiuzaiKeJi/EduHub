'use client'

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { CourseForm } from '@/components/course/CourseForm'
import { CourseScheduleManager } from '@/components/course/CourseScheduleManager'
import { getCourse } from '@/lib/api/courses'
import { getCategories } from '@/lib/api/categories'
import { getTeachers } from '@/lib/api/teachers'
import { updateCourse, updateCourseSchedule, createCourseSchedule, deleteCourseSchedule, checkScheduleConflict } from '@/lib/api/courses'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Course, CourseCategory, User, CourseSchedule } from '@/types/course'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CourseEditPageProps {
  params: {
    id: string
  }
}

export default function CourseEditPage({ params }: CourseEditPageProps) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, categoriesData, teachersData] = await Promise.all([
          getCourse(params.id),
          getCategories(),
          getTeachers(),
        ])
        setCourse(courseData)
        setCategories(categoriesData)
        setTeachers(teachersData)
      } catch (error) {
        console.error('获取数据失败:', error)
        toast.error('获取数据失败')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!course) {
    notFound()
  }

  const handleSubmit = async (data: any) => {
    try {
      await updateCourse(params.id, data)
      toast.success('课程更新成功')
      router.push(`/courses/${params.id}`)
    } catch (error) {
      toast.error('课程更新失败')
      console.error('更新课程失败:', error)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleAddSchedule = async (schedule: Omit<CourseSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const hasConflict = await checkScheduleConflict(params.id, schedule)
      if (hasConflict) {
        toast.error('该时间段与其他课程时间冲突')
        return
      }
      const newSchedule = await createCourseSchedule(schedule)
      setCourse(prev => prev ? {
        ...prev,
        schedules: [...(prev.schedules || []), newSchedule]
      } : null)
      toast.success('添加时间表成功')
    } catch (error) {
      toast.error('添加时间表失败')
      console.error('添加时间表失败:', error)
    }
  }

  const handleUpdateSchedule = async (schedule: CourseSchedule) => {
    try {
      const hasConflict = await checkScheduleConflict(params.id, schedule)
      if (hasConflict) {
        toast.error('该时间段与其他课程时间冲突')
        return
      }
      const updatedSchedule = await updateCourseSchedule(schedule.id, schedule)
      setCourse(prev => prev ? {
        ...prev,
        schedules: prev.schedules?.map(s => s.id === updatedSchedule.id ? updatedSchedule : s) || []
      } : null)
      toast.success('更新时间表成功')
    } catch (error) {
      toast.error('更新时间表失败')
      console.error('更新时间表失败:', error)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteCourseSchedule(scheduleId)
      setCourse(prev => prev ? {
        ...prev,
        schedules: prev.schedules?.filter(s => s.id !== scheduleId) || []
      } : null)
      toast.success('删除时间表成功')
    } catch (error) {
      toast.error('删除时间表失败')
      console.error('删除时间表失败:', error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">编辑课程</h1>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="schedule">时间表</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <CourseForm
              initialData={course}
              categories={categories}
              teachers={teachers}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <CourseScheduleManager
              courseId={course.id}
              schedules={course.schedules || []}
              onAddSchedule={handleAddSchedule}
              onUpdateSchedule={handleUpdateSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 