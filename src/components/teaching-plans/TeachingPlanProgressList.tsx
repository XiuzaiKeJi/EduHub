'use client'

import { useState, useEffect } from 'react'
import { TeachingPlanProgress, TeachingPlanProgressListResponse, TeachingPlanStatus } from '@/types/teaching-plan'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/use-toast'
import { PlusIcon, Pencil, Trash2, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { formatDate } from '@/lib/utils'

const progressSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  weekNumber: z.coerce.number().int().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']),
  completionRate: z.coerce.number().min(0).max(100),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  note: z.string().optional(),
})

type ProgressFormValues = z.infer<typeof progressSchema>

interface TeachingPlanProgressListProps {
  courseId: string
  planId: string
}

const TeachingPlanProgressList = ({ courseId, planId }: TeachingPlanProgressListProps) => {
  const [progressItems, setProgressItems] = useState<TeachingPlanProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<TeachingPlanProgress | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  
  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      title: '',
      description: '',
      weekNumber: undefined,
      status: 'PLANNED',
      completionRate: 0,
      startDate: '',
      endDate: '',
      note: '',
    },
  })

  const fetchProgressItems = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/courses/${courseId}/teaching-plans/${planId}/progress`)
      
      if (!response.ok) {
        throw new Error('获取进度列表失败')
      }
      
      const data: TeachingPlanProgressListResponse = await response.json()
      setProgressItems(data.progress)
    } catch (err) {
      console.error('获取进度列表出错:', err)
      setError(err instanceof Error ? err.message : '获取进度列表时出错')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProgressItems()
  }, [courseId, planId])
  
  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      weekNumber: undefined,
      status: 'PLANNED',
      completionRate: 0,
      startDate: '',
      endDate: '',
      note: '',
    })
  }
  
  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }
  
  const openEditDialog = (progress: TeachingPlanProgress) => {
    setCurrentProgress(progress)
    form.reset({
      title: progress.title,
      description: progress.description || '',
      weekNumber: progress.weekNumber,
      status: progress.status,
      completionRate: progress.completionRate,
      startDate: progress.startDate ? new Date(progress.startDate).toISOString().split('T')[0] : '',
      endDate: progress.endDate ? new Date(progress.endDate).toISOString().split('T')[0] : '',
      note: progress.note || '',
    })
    setIsEditDialogOpen(true)
  }
  
  const openDeleteDialog = (progress: TeachingPlanProgress) => {
    setCurrentProgress(progress)
    setIsDeleteDialogOpen(true)
  }
  
  const handleCreateProgress = async (values: ProgressFormValues) => {
    setFormSubmitting(true)
    
    try {
      const response = await fetch(`/api/courses/${courseId}/teaching-plans/${planId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建进度失败')
      }
      
      toast({
        title: '进度已创建',
        description: '成功创建进度计划',
      })
      
      await fetchProgressItems()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('创建进度出错:', error)
      toast({
        title: '创建失败',
        description: error instanceof Error ? error.message : '创建进度时出错',
        variant: 'destructive',
      })
    } finally {
      setFormSubmitting(false)
    }
  }
  
  const handleUpdateProgress = async (values: ProgressFormValues) => {
    if (!currentProgress) return
    
    setFormSubmitting(true)
    
    try {
      const response = await fetch(`/api/courses/${courseId}/teaching-plans/${planId}/progress/${currentProgress.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '更新进度失败')
      }
      
      toast({
        title: '进度已更新',
        description: '成功更新进度计划',
      })
      
      await fetchProgressItems()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('更新进度出错:', error)
      toast({
        title: '更新失败',
        description: error instanceof Error ? error.message : '更新进度时出错',
        variant: 'destructive',
      })
    } finally {
      setFormSubmitting(false)
    }
  }
  
  const handleDeleteProgress = async () => {
    if (!currentProgress) return
    
    setFormSubmitting(true)
    
    try {
      const response = await fetch(`/api/courses/${courseId}/teaching-plans/${planId}/progress/${currentProgress.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '删除进度失败')
      }
      
      toast({
        title: '进度已删除',
        description: '成功删除进度计划',
      })
      
      await fetchProgressItems()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('删除进度出错:', error)
      toast({
        title: '删除失败',
        description: error instanceof Error ? error.message : '删除进度时出错',
        variant: 'destructive',
      })
    } finally {
      setFormSubmitting(false)
    }
  }
  
  const getStatusBadgeColor = (status: TeachingPlanStatus) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }
  
  const getStatusLabel = (status: TeachingPlanStatus) => {
    switch (status) {
      case 'PLANNED':
        return '计划中'
      case 'IN_PROGRESS':
        return '进行中'
      case 'COMPLETED':
        return '已完成'
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">进度计划列表</h3>
        <Button onClick={openAddDialog} size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          添加进度
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : progressItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无进度计划，点击"添加进度"按钮添加
        </div>
      ) : (
        <div className="space-y-4">
          {progressItems.map((progress) => (
            <Card key={progress.id}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {progress.weekNumber && `第${progress.weekNumber}周：`}{progress.title}
                    </CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(progress.status)}`}>
                      {getStatusLabel(progress.status)}
                    </span>
                  </div>
                  {(progress.startDate || progress.endDate) && (
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {progress.startDate && formatDate(new Date(progress.startDate))}
                      {progress.startDate && progress.endDate && ' 至 '}
                      {progress.endDate && formatDate(new Date(progress.endDate))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openEditDialog(progress)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openDeleteDialog(progress)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {progress.description && (
                  <p className="text-sm mb-2">{progress.description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>完成进度</span>
                    <span>{progress.completionRate}%</span>
                  </div>
                  <Progress value={progress.completionRate} className="h-2" />
                </div>
                {progress.note && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p className="font-medium">备注</p>
                    <p>{progress.note}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* 添加进度对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加进度计划</DialogTitle>
            <DialogDescription>
              为当前教学计划添加一个新的进度项目
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateProgress)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标题</FormLabel>
                    <FormControl>
                      <Input placeholder="进度标题" {...field} />
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
                      <Textarea
                        placeholder="进度详细描述"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weekNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>周次</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="第几周"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                        />
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择状态" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PLANNED">计划中</SelectItem>
                          <SelectItem value="IN_PROGRESS">进行中</SelectItem>
                          <SelectItem value="COMPLETED">已完成</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="completionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>完成进度 ({field.value}%)</FormLabel>
                    <FormControl>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        className="w-full"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>开始日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>结束日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="其他备注信息"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={formSubmitting}>
                  取消
                </Button>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? '提交中...' : '添加进度'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* 编辑进度对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑进度计划</DialogTitle>
            <DialogDescription>
              修改当前进度计划的信息
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateProgress)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标题</FormLabel>
                    <FormControl>
                      <Input placeholder="进度标题" {...field} />
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
                      <Textarea
                        placeholder="进度详细描述"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weekNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>周次</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="第几周"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                        />
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择状态" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PLANNED">计划中</SelectItem>
                          <SelectItem value="IN_PROGRESS">进行中</SelectItem>
                          <SelectItem value="COMPLETED">已完成</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="completionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>完成进度 ({field.value}%)</FormLabel>
                    <FormControl>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        className="w-full"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>开始日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>结束日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="其他备注信息"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={formSubmitting}>
                  取消
                </Button>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? '提交中...' : '更新进度'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除此进度计划吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除当前进度计划，且不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formSubmitting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProgress}
              disabled={formSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {formSubmitting ? '删除中...' : '确定删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TeachingPlanProgressList 