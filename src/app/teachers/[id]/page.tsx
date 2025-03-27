'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { TeacherDetail } from '@/components/teacher/TeacherDetail'
import { Teacher } from '@/types/teacher'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/ui/alert-modal'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'

interface TeacherPageProps {
  params: {
    id: string
  }
}

export default function TeacherPage({ params }: TeacherPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // 加载教师信息
  useEffect(() => {
    const loadTeacher = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/teachers/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error('获取教师信息失败')
        }
        
        const data = await response.json()
        setTeacher(data)
      } catch (error) {
        setError((error as Error).message)
        toast({
          title: '获取教师信息失败',
          description: (error as Error).message,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTeacher()
  }, [id, toast])
  
  // 编辑教师
  const handleEdit = () => {
    router.push(`/teachers/${id}/edit`)
  }
  
  // 新增资质
  const handleAddQualification = () => {
    router.push(`/teachers/${id}/qualifications/new`)
  }
  
  // 新增评价
  const handleAddEvaluation = () => {
    router.push(`/teachers/${id}/evaluations/new`)
  }
  
  // 确认删除
  const handleDeleteConfirm = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('删除教师失败')
      }
      
      toast({
        title: '删除成功',
        description: '教师档案已成功删除',
      })
      
      // 跳转到教师列表页面
      router.push('/teachers')
    } catch (error) {
      toast({
        title: '删除失败',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
    }
  }
  
  // 返回列表
  const handleBack = () => {
    router.push('/teachers')
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
            onClick={handleBack}
          >
            返回教师列表
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleBack}
          >
            返回列表
          </Button>
          <h1 className="text-3xl font-bold">{teacher.user?.name} 教师详情</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleAddQualification}
            className="flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            添加资质
          </Button>
          <Button 
            variant="outline" 
            onClick={handleAddEvaluation}
            className="flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            添加评价
          </Button>
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            编辑资料
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            删除档案
          </Button>
        </div>
      </div>
      
      <TeacherDetail teacher={teacher} />
      
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={isLoading}
        title="确认删除"
        description={`确定要删除教师 ${teacher.user?.name || ''} 的档案吗？该操作无法撤销，并将删除该教师的所有资质和评价信息。`}
      />
    </div>
  )
} 