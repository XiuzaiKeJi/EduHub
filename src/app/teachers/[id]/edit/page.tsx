'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { TeacherForm } from '@/components/teacher/TeacherForm'
import { Teacher, UserBasic } from '@/types/teacher'

interface EditTeacherPageProps {
  params: {
    id: string
  }
}

export default function EditTeacherPage({ params }: EditTeacherPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [users, setUsers] = useState<UserBasic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 加载教师信息
  useEffect(() => {
    const loadTeacherAndUsers = async () => {
      setIsLoading(true)
      try {
        // 获取教师信息
        const teacherResponse = await fetch(`/api/teachers/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!teacherResponse.ok) {
          throw new Error('获取教师信息失败')
        }
        
        const teacherData = await teacherResponse.json()
        setTeacher(teacherData)
        
        // 获取用户列表
        const usersResponse = await fetch('/api/users?role=TEACHER', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!usersResponse.ok) {
          throw new Error('获取用户列表失败')
        }
        
        const usersData = await usersResponse.json()
        setUsers(usersData)
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
    
    loadTeacherAndUsers()
  }, [id, toast])
  
  // 提交表单
  const handleSubmit = async (data: Partial<Teacher>) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('更新教师信息失败')
      }
      
      toast({
        title: '更新成功',
        description: '教师信息已成功更新',
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
  
  if (error || !teacher) {
    return (
      <div className="container py-6 space-y-6">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-500">{error || '找不到该教师信息'}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => router.push('/teachers')}
          >
            返回教师列表
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">编辑教师信息</h1>
      </div>
      
      <TeacherForm
        initialData={teacher}
        users={users}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
        isEditing={true}
      />
    </div>
  )
} 