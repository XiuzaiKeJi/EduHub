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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MoreVertical, Pencil, Trash, File, Image, Video, AlertCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// 资源类型
const ResourceType = {
  DOCUMENT: 'DOCUMENT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const

// 资源表单Schema
const ResourceFormSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  type: z.enum([ResourceType.DOCUMENT, ResourceType.IMAGE, ResourceType.VIDEO]),
  url: z.string().url('请输入有效的URL'),
})

type ResourceFormData = z.infer<typeof ResourceFormSchema>

interface Resource {
  id: string
  title: string
  description?: string
  type: keyof typeof ResourceType
  url: string
  createdAt: string
  updatedAt: string
}

interface TeachingPlanResourceProps {
  planId: string
  onResourceUpdate?: (resourceId: string) => void
}

export function TeachingPlanResource({ planId, onResourceUpdate }: TeachingPlanResourceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [resources, setResources] = useState<Resource[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(ResourceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: ResourceType.DOCUMENT,
      url: '',
    },
  })

  // 获取资源列表
  const fetchResources = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/courses/${planId}/teaching-plans/resources`)
      if (!response.ok) {
        throw new Error('获取资源列表失败')
      }
      const data = await response.json()
      setResources(data)
    } catch (error) {
      setError('获取资源列表失败，请稍后重试')
      toast({
        title: '错误',
        description: '获取资源列表失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [planId])

  // 创建或更新资源
  const onSubmit = async (data: ResourceFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      const url = editingResource
        ? `/api/courses/${planId}/teaching-plans/resources/${editingResource.id}`
        : `/api/courses/${planId}/teaching-plans/resources`
      
      const response = await fetch(url, {
        method: editingResource ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(editingResource ? '更新资源失败' : '创建资源失败')
      }

      const updatedResource = await response.json()
      setResources((prev) => 
        editingResource
          ? prev.map((r) => (r.id === updatedResource.id ? updatedResource : r))
          : [...prev, updatedResource]
      )
      form.reset()
      setIsDialogOpen(false)
      setEditingResource(null)
      toast({
        title: '成功',
        description: editingResource ? '资源更新成功' : '资源创建成功',
      })
      onResourceUpdate?.(updatedResource.id)
    } catch (error) {
      setError(editingResource ? '更新资源失败，请稍后重试' : '创建资源失败，请稍后重试')
      toast({
        title: '错误',
        description: editingResource ? '更新资源失败' : '创建资源失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 删除资源
  const handleDelete = async (resourceId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/courses/${planId}/teaching-plans/resources/${resourceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除资源失败')
      }

      setResources((prev) => prev.filter((r) => r.id !== resourceId))
      toast({
        title: '成功',
        description: '资源删除成功',
      })
    } catch (error) {
      setError('删除资源失败，请稍后重试')
      toast({
        title: '错误',
        description: '删除资源失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 打开编辑表单
  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    form.reset({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      url: resource.url,
    })
    setIsDialogOpen(true)
  }

  // 渲染资源类型图标
  const renderResourceTypeIcon = (type: keyof typeof ResourceType) => {
    switch (type) {
      case ResourceType.DOCUMENT:
        return <File className="h-4 w-4 text-blue-500" />
      case ResourceType.IMAGE:
        return <Image className="h-4 w-4 text-green-500" />
      case ResourceType.VIDEO:
        return <Video className="h-4 w-4 text-purple-500" />
      default:
        return <File className="h-4 w-4 text-gray-400" />
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

  // 渲染资源列表
  const renderResourceList = () => {
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

    if (resources.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          暂无资源记录
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {renderResourceTypeIcon(resource.type)}
                <h3 className="font-medium">{resource.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  resource.type === ResourceType.DOCUMENT ? 'bg-blue-100 text-blue-800' :
                  resource.type === ResourceType.IMAGE ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {resource.type === ResourceType.DOCUMENT ? '文档' :
                   resource.type === ResourceType.IMAGE ? '图片' :
                   '视频'}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(resource)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {resource.description && (
              <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
            )}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              查看资源
            </a>
          </Card>
        ))}
      </div>
    )
  }

  // 渲染资源表单
  const renderResourceForm = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>添加资源</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingResource ? '编辑教学资源' : '添加教学资源'}</DialogTitle>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>类型</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <option value={ResourceType.DOCUMENT}>文档</option>
                    <option value={ResourceType.IMAGE}>图片</option>
                    <option value={ResourceType.VIDEO}>视频</option>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>资源链接</FormLabel>
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
                  setEditingResource(null)
                }}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (editingResource ? '更新中...' : '创建中...') : (editingResource ? '更新' : '创建')}
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
        <h2 className="text-lg font-semibold">教学资源</h2>
        {renderResourceForm()}
      </div>
      {renderError()}
      {renderResourceList()}
    </div>
  )
} 