import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Plus, Edit, Trash2, FileText, Upload, Download } from 'lucide-react'
import { Course, CourseResource } from '@/types/course'

interface CourseResourceManagerProps {
  courseId: string
  resources: CourseResource[]
  onAddResource: (resource: Omit<CourseResource, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateResource: (resource: CourseResource) => void
  onDeleteResource: (resourceId: string) => void
  onUploadFile: (file: File) => Promise<{ url: string; size: number }>
}

export const CourseResourceManager: FC<CourseResourceManagerProps> = ({
  courseId,
  resources,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
  onUploadFile,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<CourseResource | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    url: '',
    format: '',
    order: 0,
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingResource) {
      onUpdateResource({
        ...editingResource,
        ...formData,
      })
    } else {
      onAddResource({
        courseId,
        ...formData,
      })
    }
    setIsDialogOpen(false)
    setEditingResource(null)
    setFormData({
      title: '',
      description: '',
      type: '',
      url: '',
      format: '',
      order: 0,
    })
  }

  const handleEdit = (resource: CourseResource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || '',
      type: resource.type,
      url: resource.url,
      format: resource.format || '',
      order: resource.order,
    })
    setIsDialogOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 模拟上传进度
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + 10
        })
      }, 500)

      const { url, size } = await onUploadFile(file)
      setUploadProgress(100)
      clearInterval(interval)

      setFormData((prev) => ({
        ...prev,
        url,
        type: file.type,
        format: file.name.split('.').pop()?.toUpperCase() || '',
      }))
    } catch (error) {
      console.error('文件上传失败:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">课程资源</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" />
              添加资源
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingResource ? '编辑资源' : '添加资源'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>资源标题</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="请输入资源标题"
                />
              </div>
              <div className="space-y-2">
                <Label>资源描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="请输入资源描述"
                />
              </div>
              <div className="space-y-2">
                <Label>资源类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择资源类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">文档</SelectItem>
                    <SelectItem value="video">视频</SelectItem>
                    <SelectItem value="audio">音频</SelectItem>
                    <SelectItem value="image">图片</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>上传文件</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <Progress value={uploadProgress} className="w-full" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>排序</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                  min={0}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  {editingResource ? '保存' : '添加'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {resources
          .sort((a, b) => a.order - b.order)
          .map((resource) => (
            <Card key={resource.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-sm text-gray-500">
                    {resource.description || '暂无描述'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {resource.type} · {resource.format}
                    {resource.size && ` · ${formatFileSize(resource.size)}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(resource)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onDeleteResource(resource.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
} 