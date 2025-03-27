'use client'

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { CourseForm } from '@/components/course/CourseForm'
import { getCourse } from '@/lib/api/courses'
import { getCategories } from '@/lib/api/categories'
import { getTeachers } from '@/lib/api/teachers'
import { updateCourse } from '@/lib/api/courses'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Course, CourseCategory, User } from '@/types/course'

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

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">编辑课程</h1>
        <CourseForm
          initialData={course}
          categories={categories}
          teachers={teachers}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 