'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { QualificationForm } from '@/components/teacher/QualificationForm'
import { TeacherQualification } from '@/types/teacher'

interface EditQualificationPageProps {
  params: {
    id: string
    qualificationId: string
  }
}

export default function EditQualificationPage({ params }: EditQualificationPageProps) {
  const { id, qualificationId } = params
  const router = useRouter()
  const { toast } = useToast()
  
  const [qualification, setQualification] = useState<TeacherQualification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 加载资质信息
  useEffect(() => {
    const loadQualification = async () => {
      setIsLoading(true)
      try {
        // 获取资质信息
        const response = await fetch(`/api/teachers/${id}/qualifications/${qualificationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error('获取资质信息失败')
        }
        
        const data = await response.json()
        setQualification(data)
      } catch (error) {
        setError((error as Error).message)
        toast({
          title: '获取资质信息失败',
          description: (error as Error).message,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadQualification()
  }, [id, qualificationId, toast])
  
  // 提交表单
  const handleSubmit = async (data: Omit<TeacherQualification, 'id' | 'teacherId' | 'createdAt' | 'updatedAt'>) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/teachers/${id}/qualifications/${qualificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('更新资质信息失败')
      }
      
      toast({
        title: '更新成功',
        description: '教师资质信息已成功更新',
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
  
  if (error || !qualification) {
    return (
      <div className="container py-6 space-y-6">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-500">{error || '找不到该资质信息'}</p>
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
        <h1 className="text-3xl font-bold">编辑教师资质</h1>
      </div>
      
      <QualificationForm
        initialData={qualification}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  )
} 