'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { TeacherList, TeacherSortField } from '@/components/teacher/TeacherList'
import { Teacher } from '@/types/teacher'
import { AlertModal } from '@/components/ui/alert-modal'

export default function TeachersPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(9)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [titleFilter, setTitleFilter] = useState('ALL')
  const [specialtiesFilter, setSpecialtiesFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<TeacherSortField>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // 加载教师数据
  const loadTeachers = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams()
      searchParams.append('page', page.toString())
      searchParams.append('pageSize', pageSize.toString())
      
      if (search) {
        searchParams.append('search', search)
      }
      
      if (titleFilter !== 'ALL') {
        searchParams.append('title', titleFilter)
      }
      
      if (specialtiesFilter !== 'ALL') {
        searchParams.append('specialties', specialtiesFilter)
      }
      
      searchParams.append('sortBy', sortBy)
      searchParams.append('sortOrder', sortOrder)
      
      const response = await fetch(`/api/teachers?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`加载失败: ${response.status}`)
      }
      
      const data = await response.json()
      setTeachers(data.teachers)
      setTotal(data.total)
    } catch (err) {
      console.error('加载教师数据失败:', err)
      setError('无法加载教师数据，请稍后重试')
      toast({
        variant: 'destructive',
        title: '加载失败',
        description: '无法加载教师数据，请稍后重试',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // 首次加载和筛选条件变化时重新加载数据
  useEffect(() => {
    loadTeachers()
  }, [page, pageSize, search, titleFilter, specialtiesFilter, sortBy, sortOrder])
  
  // 搜索处理
  const handleSearch = (keyword: string) => {
    setSearch(keyword)
    setPage(1) // 重置页码
  }
  
  // 排序处理
  const handleSort = (field: TeacherSortField) => {
    // 如果点击当前排序字段，切换排序顺序
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc') // 默认升序
    }
    setPage(1) // 重置页码
  }
  
  // 筛选处理
  const handleFilter = (title: string, specialties: string) => {
    setTitleFilter(title)
    setSpecialtiesFilter(specialties)
    setPage(1) // 重置页码
  }
  
  // 页码变化处理
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  
  // 每页数量变化处理
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // 重置页码
  }
  
  // 创建教师
  const handleCreateTeacher = () => {
    router.push('/teachers/new')
  }
  
  // 查看教师详情
  const handleViewTeacher = (teacher: Teacher) => {
    router.push(`/teachers/${teacher.id}`)
  }
  
  // 编辑教师
  const handleEditTeacher = (teacher: Teacher) => {
    router.push(`/teachers/${teacher.id}/edit`)
  }
  
  // 删除教师
  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher)
    setIsDeleteModalOpen(true)
  }
  
  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/teachers/${teacherToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`删除失败: ${response.status}`)
      }
      
      toast({
        title: '删除成功',
        description: `教师 ${teacherToDelete.user?.name || '未命名'} 已被删除`,
      })
      
      // 重新加载数据
      loadTeachers()
    } catch (err) {
      console.error('删除教师失败:', err)
      toast({
        variant: 'destructive',
        title: '删除失败',
        description: '无法删除教师，请稍后重试',
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setTeacherToDelete(null)
    }
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">教师管理</h1>
        <p className="text-muted-foreground">查看、添加、编辑和删除教师信息</p>
      </div>
      
      {/* 教师列表组件 */}
      <TeacherList
        teachers={teachers}
        total={total}
        page={page}
        pageSize={pageSize}
        onSearch={handleSearch}
        onSort={handleSort}
        onFilter={handleFilter}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onCreateTeacher={handleCreateTeacher}
        onViewTeacher={handleViewTeacher}
        onEditTeacher={handleEditTeacher}
        onDeleteTeacher={handleDeleteClick}
      />
      
      {/* 删除确认对话框 */}
      <AlertModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="确认删除教师"
        description={`确定要删除教师 ${teacherToDelete?.user?.name || '未命名'} 吗？此操作无法撤销，所有关联的资质和评价也将被删除。`}
      />
    </div>
  )
} 