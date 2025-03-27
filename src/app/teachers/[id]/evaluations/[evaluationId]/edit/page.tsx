'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { EvaluationForm } from '@/components/teacher/EvaluationForm'
import { TeacherEvaluation } from '@/types/teacher'
import { Course } from '@/types/course'

interface EditEvaluationPageProps {
  params: {
    id: string
    evaluationId: string
  }
}

export default function EditEvaluationPage({ params }: EditEvaluationPageProps) {
  const { id, evaluationId } = params
  const router = useRouter()
  const { toast } = useToast()
  
  const [evaluation, setEvaluation] = useState<TeacherEvaluation | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 加载评价信息和课程列表
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // 获取评价信息
        const evaluationResponse = await fetch(`/api/teachers/${id}/evaluations/${evaluationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!evaluationResponse.ok) {
          throw new Error('获取评价信息失败')
        }
        
        const evaluationData = await evaluationResponse.json()
        setEvaluation(evaluationData)
        
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
        setError((error as Error).message)
        toast({
          title: '获取数据失败',
          description: (error as Error).message,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [id, evaluationId, toast])
  
  // 提交表单
  const handleSubmit = async (data: Omit<TeacherEvaluation, 'id' | 'teacherId' | 'createdAt' | 'updatedAt'>) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/teachers/${id}/evaluations/${evaluationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('更新评价信息失败')
      }
      
      toast({
        title: '更新成功',
        description: '教师评价已成功更新',
      })
      
      // 跳转到教师详情页面
      router.push(`/teachers/${id}`)
    } catch (error) {
      toast({
        title: '更新失败',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // 取消编辑
  const handleCancel = () => {
    router.push(`/teachers/${id}`)
  }
  
  if (isLoading) {
    return (
      <div className="container py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (error || !evaluation) {
    return (
      <div className="container py-6 space-y-6">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-500">{error || '找不到该评价信息'}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => router.push(`/teachers/${id}`)}
          >
            返回教师详情
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">编辑教师评价</h1>
      </div>
      
      <EvaluationForm
        initialData={evaluation}
        courses={courses}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  )
} 