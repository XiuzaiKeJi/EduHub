'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { QualificationForm } from '@/components/teacher/QualificationForm'
import { TeacherQualification } from '@/types/teacher'

interface NewQualificationPageProps {
  params: {
    id: string
  }
}

export default function NewQualificationPage({ params }: NewQualificationPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [teacherExists, setTeacherExists] = useState(false)
  
  // 验证教师是否存在
  useEffect(() => {
    const verifyTeacher = async () => {
      try {
        const response = await fetch(`/api/teachers/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          setTeacherExists(true)
        } else {
          toast({
            title: '教师不存在',
            description: '无法为不存在的教师添加资质',
            variant: 'destructive',
          })
          router.push('/teachers')
        }
      } catch (error) {
        toast({
          title: '验证失败',
          description: (error as Error).message,
          variant: 'destructive',
        })
        router.push('/teachers')
      }
    }
    
    verifyTeacher()
  }, [id, router, toast])
  
  // 提交表单
  const handleSubmit = async (data: Omit<TeacherQualification, 'id' | 'teacherId' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/teachers/${id}/qualifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('添加资质失败')
      }
      
      toast({
        title: '添加成功',
        description: '教师资质已成功添加',
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
      setIsLoading(false)
    }
  }
  
  // 取消添加
  const handleCancel = () => {
    router.push(`/teachers/${id}`)
  }
  
  if (!teacherExists) {
    return (
      <div className="container py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">添加教师资质</h1>
      </div>
      
      <QualificationForm
        initialData={null}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  )
} 