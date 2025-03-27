'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Teacher } from '@/types/teacher'
import { Search, PlusCircle, Filter, ArrowUpDown, StarIcon, Edit, Trash2, Eye } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// 可排序的字段
export type TeacherSortField = 'name' | 'title' | 'department' | 'createdAt' | 'updatedAt'

// 组件属性定义
interface TeacherListProps {
  teachers: Teacher[]
  total: number
  page: number
  pageSize: number
  onSearch: (keyword: string) => void
  onSort: (field: TeacherSortField) => void
  onFilter: (title: string, specialties: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onCreateTeacher: () => void
  onViewTeacher: (teacher: Teacher) => void
  onEditTeacher: (teacher: Teacher) => void
  onDeleteTeacher: (teacher: Teacher) => void
}

export function TeacherList({
  teachers,
  total,
  page,
  pageSize,
  onSearch,
  onSort,
  onFilter,
  onPageChange,
  onPageSizeChange,
  onCreateTeacher,
  onViewTeacher,
  onEditTeacher,
  onDeleteTeacher,
}: TeacherListProps) {
  const [searchValue, setSearchValue] = useState('')
  const [titleFilter, setTitleFilter] = useState('ALL')
  const [specialtiesFilter, setSpecialtiesFilter] = useState('ALL')
  
  const debouncedSearch = useDebounce(searchValue, 500)
  
  // 当搜索关键词变化时触发搜索
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }
  
  // 使用防抖后的值进行搜索
  const handleSearch = () => {
    onSearch(debouncedSearch)
  }
  
  // 处理筛选变化
  const handleTitleFilterChange = (value: string) => {
    setTitleFilter(value)
    onFilter(value, specialtiesFilter)
  }
  
  const handleSpecialtiesFilterChange = (value: string) => {
    setSpecialtiesFilter(value)
    onFilter(titleFilter, value)
  }
  
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize)
  
  // 获取教师头像的首字母
  const getTeacherInitials = (teacher: Teacher) => {
    if (!teacher.user?.name) return '?'
    return teacher.user.name.charAt(0).toUpperCase()
  }
  
  return (
    <div className="space-y-6">
      {/* 搜索和筛选栏 */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {/* 搜索框 */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索教师姓名、职称或专业..."
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-8"
            />
          </div>
          <Button onClick={handleSearch} variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {/* 筛选和排序 */}
        <div className="flex flex-wrap gap-2">
          {/* 职称筛选 */}
          <Select value={titleFilter} onValueChange={handleTitleFilterChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="职称" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部职称</SelectItem>
              <SelectItem value="教授">教授</SelectItem>
              <SelectItem value="副教授">副教授</SelectItem>
              <SelectItem value="讲师">讲师</SelectItem>
              <SelectItem value="助教">助教</SelectItem>
            </SelectContent>
          </Select>
          
          {/* 专业筛选 */}
          <Select value={specialtiesFilter} onValueChange={handleSpecialtiesFilterChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="专业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部专业</SelectItem>
              <SelectItem value="计算机科学">计算机科学</SelectItem>
              <SelectItem value="数学">数学</SelectItem>
              <SelectItem value="物理">物理</SelectItem>
              <SelectItem value="化学">化学</SelectItem>
              <SelectItem value="生物">生物</SelectItem>
              <SelectItem value="文学">文学</SelectItem>
              <SelectItem value="历史">历史</SelectItem>
              <SelectItem value="哲学">哲学</SelectItem>
              <SelectItem value="艺术">艺术</SelectItem>
            </SelectContent>
          </Select>
          
          {/* 排序下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                排序
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSort('name')}>
                按姓名排序
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort('title')}>
                按职称排序
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort('department')}>
                按院系排序
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort('createdAt')}>
                按创建时间排序
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort('updatedAt')}>
                按更新时间排序
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* 新增教师按钮 */}
          <Button onClick={onCreateTeacher} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            新增教师
          </Button>
        </div>
      </div>
      
      {/* 教师列表 */}
      {teachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">暂无教师数据</p>
          <Button onClick={onCreateTeacher} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            添加第一位教师
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden">
              <CardHeader className="p-4 bg-muted/30 flex flex-row items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.user?.image || ''} alt={teacher.user?.name || ''} />
                  <AvatarFallback>{getTeacherInitials(teacher)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-medium truncate">{teacher.user?.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{teacher.title}</Badge>
                    {teacher.department && (
                      <span className="text-xs text-muted-foreground">{teacher.department}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* 专业列表 */}
                  {teacher.specialties && (
                    <div>
                      <p className="text-sm font-medium mb-1">专业领域：</p>
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.split(',').map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="truncate">
                            {specialty.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 教授科目 */}
                  {teacher.subjects && (
                    <div>
                      <p className="text-sm font-medium mb-1">教授科目：</p>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.split(',').map((subject, index) => (
                          <Badge key={index} variant="outline" className="truncate">
                            {subject.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 简介 */}
                  {teacher.bio && (
                    <div>
                      <p className="text-sm font-medium mb-1">简介：</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{teacher.bio}</p>
                    </div>
                  )}
                  
                  {/* 更新时间 */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {teacher.updatedAt
                          ? `更新于 ${formatDistanceToNow(new Date(teacher.updatedAt), { 
                              addSuffix: true, 
                              locale: zhCN 
                            })}`
                          : ''}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {teacher.qualifications && teacher.qualifications.length > 0 && (
                        <Badge variant="secondary" className="px-1.5">
                          <StarIcon className="h-3 w-3 mr-1" />
                          {teacher.qualifications.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewTeacher(teacher)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  详情
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTeacher(teacher)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTeacher(teacher)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                    删除
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* 分页 */}
      {teachers.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              每页显示:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              共 {total} 条，当前 {(page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)} 条
            </span>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {/* 简单数字页码 */}
              <div className="flex items-center">
                <span className="text-sm">
                  {page} / {totalPages}
                </span>
              </div>
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && onPageChange(page + 1)}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
} 