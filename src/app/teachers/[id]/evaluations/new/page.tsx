'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { EvaluationForm } from '@/components/teacher/EvaluationForm'
import { TeacherEvaluation } from '@/types/teacher'
import { Course } from '@/types/course'

interface NewEvaluationPageProps {
  params: {
    id: string
  }
}

export default function NewEvaluationPage({ params }: NewEvaluationPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [teacherExists, setTeacherExists] = useState(false)
  
  // 验证教师是否存在并加载课程列表
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // 检查教师是否存在
        const teacherResponse = await fetch(`/api/teachers/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!teacherResponse.ok) {
          toast({
            title: '教师不存在',
            description: '无法为不存在的教师添加评价',
            variant: 'destructive',
          })
          router.push('/teachers')
          return
        }
        
        setTeacherExists(true)
        
        // 获取课程列表
        const coursesResponse = await fetch('/api/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!coursesResponse.ok) {
          throw new Error('获取课程列表失败')
        }
        
        const coursesData = await coursesResponse.json()
        setCourses(coursesData.courses)
      } catch (error) {
        toast({
          title: '加载数据失败',
          description: (error as Error).message,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [id, router, toast])
  
  // 提交表单
  const handleSubmit = async (data: Omit<TeacherEvaluation, 'id' | 'teacherId' | 'createdAt' | 'updatedAt'>) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/teachers/${id}/evaluations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('添加评价失败')
      }
      
      toast({
        title: '添加成功',
        description: '教师评价已成功添加',
      })
      
      // 跳转到教师详情页面
      router.push(`/teachers/${id}`)
    } catch (error) {
      toast({
        title: '添加失败',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // 取消添加
  const handleCancel = () => {
    router.push(`/teachers/${id}`)
  }
  
  if (isLoading || !teacherExists) {
    return (
      <div className="container py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">添加教师评价</h1>
      </div>
      
      <EvaluationForm
        initialData={null}
        courses={courses}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  )
} 