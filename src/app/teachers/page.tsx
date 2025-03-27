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

  // 加载教师列表
  const loadTeachers = async () => {
    setIsLoading(true)
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
      })
      
      if (search) params.append('search', search)
      if (titleFilter !== 'ALL') params.append('title', titleFilter)
      if (specialtiesFilter !== 'ALL') params.append('specialties', specialtiesFilter)
      
      const response = await fetch(`/api/teachers?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('获取教师列表失败')
      }
      
      const data = await response.json()
      setTeachers(data.teachers)
      setTotal(data.total)
    } catch (error) {
      setError((error as Error).message)
      toast({
        title: '获取教师列表失败',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 当筛选或分页参数变化时重新加载数据
  useEffect(() => {
    loadTeachers()
  }, [page, pageSize, search, titleFilter, specialtiesFilter, sortBy, sortOrder])

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setSearch(keyword)
    setPage(1) // 重置到第一页
  }

  // 处理筛选
  const handleFilter = (title: string, specialties: string) => {
    setTitleFilter(title)
    setSpecialtiesFilter(specialties)
    setPage(1) // 重置到第一页
  }

  // 处理排序
  const handleSort = (field: TeacherSortField) => {
    if (sortBy === field) {
      // 如果点击的是当前排序字段，则切换排序顺序
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // 否则，更改排序字段并重置为升序
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1) // 重置到第一页
  }

  // 处理分页
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // 处理每页数量变化
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // 重置到第一页
  }

  // 新建教师
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
  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/teachers/${teacherToDelete.id}`, {
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
      
      // 重新加载数据
      loadTeachers()
    } catch (error) {
      toast({
        title: '删除失败',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
      setTeacherToDelete(null)
    }
  }

  // 打开删除确认对话框
  const handleDeleteTeacher = (teacher: Teacher) => {
    setTeacherToDelete(teacher)
    setIsDeleteModalOpen(true)
  }

  // 取消删除
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setTeacherToDelete(null)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">教师管理</h1>
      </div>
      
      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-500">{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={loadTeachers}
          >
            重试
          </button>
        </div>
      ) : (
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
          onDeleteTeacher={handleDeleteTeacher}
        />
      )}
      
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isLoading}
        title="确认删除"
        description={`确定要删除教师 ${teacherToDelete?.user?.name || ''} 的档案吗？该操作无法撤销，并将删除该教师的所有资质和评价信息。`}
      />
    </div>
  )
} 