'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TeachingPlan, TeachingPlanListResponse } from '@/types/teaching-plan'
import TeachingPlanCard from './TeachingPlanCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '@/hooks/use-debounce'
import { Pagination } from '@/components/ui/pagination'
import { PlusIcon, Search, SlidersHorizontal, Filter, MoreVertical } from 'lucide-react'
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TeachingPlanListProps {
  courseId: string
}

const TeachingPlanList = ({ courseId }: TeachingPlanListProps) => {
  const router = useRouter()
  const [plans, setPlans] = useState<TeachingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  const fetchPlans = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort,
        order,
        ...(debouncedSearch ? { search: debouncedSearch } : {})
      })
      
      const response = await fetch(`/api/courses/${courseId}/teaching-plans?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('获取教学计划列表失败')
      }
      
      const data: TeachingPlanListResponse = await response.json()
      setPlans(data.plans)
      setTotal(data.total)
    } catch (err) {
      console.error('获取教学计划列表出错:', err)
      setError(err instanceof Error ? err.message : '获取教学计划列表时出错')
      toast.error('获取教学计划列表失败')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchPlans()
  }, [courseId, page, pageSize, sort, order, debouncedSearch])
  
  const handleCreatePlan = () => {
    router.push(`/courses/${courseId}/teaching-plans/new`)
  }
  
  const handleViewPlan = (planId: string) => {
    router.push(`/courses/${courseId}/teaching-plans/${planId}`)
  }
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible)
  }

  const handleDelete = async (planId: string) => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/teaching-plans/${planId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("删除教学计划失败");
      }
      toast.success("删除成功");
      fetchPlans();
    } catch (err) {
      toast.error("删除失败");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">教学计划</h2>
        <Button onClick={handleCreatePlan}>
          <PlusIcon className="mr-2 h-4 w-4" />
          新建教学计划
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索教学计划..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={toggleFilters}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {isFiltersVisible && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">排序字段</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="排序字段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">标题</SelectItem>
                <SelectItem value="createdAt">创建时间</SelectItem>
                <SelectItem value="updatedAt">更新时间</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">排序方式</label>
            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger>
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">升序</SelectItem>
                <SelectItem value="desc">降序</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-8">暂无教学计划，点击上方"新建教学计划"按钮创建</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plan.description}
                  </p>
                  <div className="flex gap-2">
                    {plan.semester && (
                      <Badge variant="secondary">{plan.semester}</Badge>
                    )}
                    {plan.academicYear && (
                      <Badge variant="secondary">{plan.academicYear}</Badge>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/courses/${courseId}/teaching-plans/${plan.id}`)
                      }
                    >
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/courses/${courseId}/teaching-plans/${plan.id}/edit`)
                      }
                    >
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(plan.id)}
                    >
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {!loading && !error && plans.length > 0 && (
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default TeachingPlanList 