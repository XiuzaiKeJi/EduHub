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
import { PlusIcon, Search, SlidersHorizontal, Filter, MoreVertical, Pencil, Trash } from 'lucide-react'
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
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface TeachingPlanListProps {
  courseId: string
}

// 教学计划表单Schema
const TeachingPlanFormSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  objectives: z.string().min(1, '教学目标不能为空'),
  content: z.string().min(1, '教学内容不能为空'),
  methods: z.string().min(1, '教学方法不能为空'),
  evaluation: z.string().min(1, '教学评价不能为空'),
})

type TeachingPlanFormData = z.infer<typeof TeachingPlanFormSchema>

export function TeachingPlanList({ courseId }: TeachingPlanListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<TeachingPlan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TeachingPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  const form = useForm<TeachingPlanFormData>({
    resolver: zodResolver(TeachingPlanFormSchema),
    defaultValues: {
      title: '',
      description: '',
      objectives: '',
      content: '',
      methods: '',
      evaluation: '',
    },
  })

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
      setIsLoading(true)
      setError(null)
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
    } finally {
      setIsLoading(false)
    }
  };

  // 创建或更新教学计划
  const onSubmit = async (data: TeachingPlanFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      const url = editingPlan
        ? `/api/courses/${courseId}/teaching-plans/${editingPlan.id}`
        : `/api/courses/${courseId}/teaching-plans`
      
      const response = await fetch(url, {
        method: editingPlan ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(editingPlan ? '更新教学计划失败' : '创建教学计划失败')
      }

      const updatedPlan = await response.json()
      setPlans((prev) => 
        editingPlan
          ? prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
          : [...prev, updatedPlan]
      )
      form.reset()
      setIsDialogOpen(false)
      setEditingPlan(null)
      toast({
        title: '成功',
        description: editingPlan ? '教学计划更新成功' : '教学计划创建成功',
      })
    } catch (error) {
      setError(editingPlan ? '更新教学计划失败，请稍后重试' : '创建教学计划失败，请稍后重试')
      toast({
        title: '错误',
        description: editingPlan ? '更新教学计划失败' : '创建教学计划失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 打开编辑表单
  const handleEdit = (plan: TeachingPlan) => {
    setEditingPlan(plan)
    form.reset({
      title: plan.title,
      description: plan.description,
      objectives: plan.objectives,
      content: plan.content,
      methods: plan.methods,
      evaluation: plan.evaluation,
    })
    setIsDialogOpen(true)
  }

  // 渲染错误提示
  const renderError = () => {
    if (!error) return null
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // 渲染教学计划列表
  const renderPlanList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      )
    }

    const filteredPlans = plans.filter((plan) =>
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (filteredPlans.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? '没有找到匹配的教学计划' : '暂无教学计划'}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{plan.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  plan.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                  plan.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {plan.status === 'DRAFT' ? '草稿' :
                   plan.status === 'IN_PROGRESS' ? '进行中' :
                   '已完成'}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/courses/${courseId}/teaching-plans/${plan.id}`)}>
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(plan)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {plan.description && (
              <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <span>创建时间：{new Date(plan.createdAt).toLocaleDateString()}</span>
              <span className="mx-2">·</span>
              <span>更新时间：{new Date(plan.updatedAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // 渲染教学计划表单
  const renderPlanForm = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>添加教学计划</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingPlan ? '编辑教学计划' : '添加教学计划'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>教学目标</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>教学内容</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="methods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>教学方法</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evaluation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>教学评价</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setEditingPlan(null)
                }}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (editingPlan ? '更新中...' : '创建中...') : (editingPlan ? '更新' : '创建')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜索教学计划..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {renderPlanForm()}
      </div>
      {renderError()}
      {renderPlanList()}
    </div>
  )
}

export default TeachingPlanList 