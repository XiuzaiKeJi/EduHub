'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { TeacherForm } from '@/components/teacher/TeacherForm'
import { User } from '@/types/course'

export default function NewTeacherPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  
  // 加载用户列表
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true)
      try {
        const response = await fetch('/api/users?role=USER', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error('获取用户列表失败')
        }
        
        const data = await response.json()
        setUsers(data.users)
      } catch (error) {
        toast({
          title: '获取用户列表失败',
          description: (error as Error).message,
          variant: 'destructive',
        })
      } finally {
        setLoadingUsers(false)
      }
    }
    
    loadUsers()
  }, [toast])
  
  // 提交表单
  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建教师档案失败')
      }
      
      toast({
        title: '创建成功',
        description: '教师档案已成功创建',
      })
      
      // 跳转到教师列表页面
      router.push('/teachers')
    } catch (error) {
      toast({
        title: '创建失败',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // 取消
  const handleCancel = () => {
    router.push('/teachers')
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">新建教师档案</h1>
      </div>
      
      {loadingUsers ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <TeacherForm
            users={users}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  )
} 