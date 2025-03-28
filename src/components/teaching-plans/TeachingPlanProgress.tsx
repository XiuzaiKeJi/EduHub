import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MoreVertical, Pencil, Trash, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// 进度状态类型
const ProgressStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const

// 进度表单Schema
const ProgressFormSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  status: z.enum([ProgressStatus.NOT_STARTED, ProgressStatus.IN_PROGRESS, ProgressStatus.COMPLETED]),
  completionRate: z.number().min(0).max(100),
})

type ProgressFormData = z.infer<typeof ProgressFormSchema>

interface Progress {
  id: string
  title: string
  description?: string
  status: keyof typeof ProgressStatus
  completionRate: number
  createdAt: string
  updatedAt: string
}

interface TeachingPlanProgressProps {
  planId: string
  onProgressUpdate?: (progressId: string) => void
}

export function TeachingPlanProgress({ planId, onProgressUpdate }: TeachingPlanProgressProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [progresses, setProgresses] = useState<Progress[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgress, setEditingProgress] = useState<Progress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<ProgressFormData>({
    resolver: zodResolver(ProgressFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: ProgressStatus.NOT_STARTED,
      completionRate: 0,
    },
  })

  // 获取进度列表
  const fetchProgresses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/courses/${planId}/teaching-plans/progress`)
      if (!response.ok) {
        throw new Error('获取进度列表失败')
      }
      const data = await response.json()
      setProgresses(data)
    } catch (error) {
      setError('获取进度列表失败，请稍后重试')
      toast({
        title: '错误',
        description: '获取进度列表失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProgresses()
  }, [planId])

  // 创建或更新进度
  const onSubmit = async (data: ProgressFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      const url = editingProgress
        ? `/api/courses/${planId}/teaching-plans/progress/${editingProgress.id}`
        : `/api/courses/${planId}/teaching-plans/progress`
      
      const response = await fetch(url, {
        method: editingProgress ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(editingProgress ? '更新进度失败' : '创建进度失败')
      }

      const updatedProgress = await response.json()
      setProgresses((prev) => 
        editingProgress
          ? prev.map((p) => (p.id === updatedProgress.id ? updatedProgress : p))
          : [...prev, updatedProgress]
      )
      form.reset()
      setIsDialogOpen(false)
      setEditingProgress(null)
      toast({
        title: '成功',
        description: editingProgress ? '进度更新成功' : '进度创建成功',
      })
      onProgressUpdate?.(updatedProgress.id)
    } catch (error) {
      setError(editingProgress ? '更新进度失败，请稍后重试' : '创建进度失败，请稍后重试')
      toast({
        title: '错误',
        description: editingProgress ? '更新进度失败' : '创建进度失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 删除进度
  const handleDelete = async (progressId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/courses/${planId}/teaching-plans/progress/${progressId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除进度失败')
      }

      setProgresses((prev) => prev.filter((p) => p.id !== progressId))
      toast({
        title: '成功',
        description: '进度删除成功',
      })
    } catch (error) {
      setError('删除进度失败，请稍后重试')
      toast({
        title: '错误',
        description: '删除进度失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 更新进度状态
  const handleStatusUpdate = async (progressId: string, newStatus: keyof typeof ProgressStatus) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/courses/${planId}/teaching-plans/progress/${progressId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('更新状态失败')
      }

      const updatedProgress = await response.json()
      setProgresses((prev) =>
        prev.map((p) => (p.id === updatedProgress.id ? updatedProgress : p))
      )
      toast({
        title: '成功',
        description: '状态更新成功',
      })
      onProgressUpdate?.(updatedProgress.id)
    } catch (error) {
      setError('更新状态失败，请稍后重试')
      toast({
        title: '错误',
        description: '更新状态失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 打开编辑表单
  const handleEdit = (progress: Progress) => {
    setEditingProgress(progress)
    form.reset({
      title: progress.title,
      description: progress.description,
      status: progress.status,
      completionRate: progress.completionRate,
    })
    setIsDialogOpen(true)
  }

  // 渲染状态图标
  const renderStatusIcon = (status: keyof typeof ProgressStatus) => {
    switch (status) {
      case ProgressStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case ProgressStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
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

  // 渲染进度列表
  const renderProgressList = () => {
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

    if (progresses.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          暂无进度记录
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {progresses.map((progress) => (
          <Card key={progress.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {renderStatusIcon(progress.status)}
                <h3 className="font-medium">{progress.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  progress.status === ProgressStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                  progress.status === ProgressStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {progress.status === ProgressStatus.COMPLETED ? '已完成' :
                   progress.status === ProgressStatus.IN_PROGRESS ? '进行中' :
                   '未开始'}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(progress)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(progress.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                    {progress.status !== ProgressStatus.NOT_STARTED && (
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(progress.id, ProgressStatus.NOT_STARTED)}
                      >
                        <Circle className="h-4 w-4 mr-2" />
                        标记为未开始
                      </DropdownMenuItem>
                    )}
                    {progress.status !== ProgressStatus.IN_PROGRESS && (
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(progress.id, ProgressStatus.IN_PROGRESS)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        标记为进行中
                      </DropdownMenuItem>
                    )}
                    {progress.status !== ProgressStatus.COMPLETED && (
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(progress.id, ProgressStatus.COMPLETED)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        标记为已完成
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {progress.description && (
              <p className="text-sm text-gray-600 mb-2">{progress.description}</p>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>完成进度</span>
                <span>{progress.completionRate}%</span>
              </div>
              <Progress value={progress.completionRate} />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // 渲染进度表单
  const renderProgressForm = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>添加进度</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProgress ? '编辑教学进度' : '添加教学进度'}</DialogTitle>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>状态</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <option value={ProgressStatus.NOT_STARTED}>未开始</option>
                    <option value={ProgressStatus.IN_PROGRESS}>进行中</option>
                    <option value={ProgressStatus.COMPLETED}>已完成</option>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>完成进度 (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
                  setEditingProgress(null)
                }}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (editingProgress ? '更新中...' : '创建中...') : (editingProgress ? '更新' : '创建')}
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
        <h2 className="text-lg font-semibold">教学进度</h2>
        {renderProgressForm()}
      </div>
      {renderError()}
      {renderProgressList()}
    </div>
  )
} 