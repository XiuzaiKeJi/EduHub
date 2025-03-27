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
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { CourseCategory } from '@/types/course'

interface CourseCategoryManagerProps {
  categories: CourseCategory[]
  onAddCategory: (category: Omit<CourseCategory, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateCategory: (category: CourseCategory) => void
  onDeleteCategory: (categoryId: string) => void
}

interface CategoryTreeNode extends CourseCategory {
  children: CategoryTreeNode[]
  level: number
}

export const CourseCategoryManager: FC<CourseCategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
  })

  // 构建树形结构
  const buildTree = (items: CourseCategory[]): CategoryTreeNode[] => {
    const itemMap = new Map<string, CategoryTreeNode>()
    const roots: CategoryTreeNode[] = []

    // 创建所有节点的映射
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [], level: 0 })
    })

    // 构建树形结构
    items.forEach((item) => {
      const node = itemMap.get(item.id)!
      if (item.parentId) {
        const parent = itemMap.get(item.parentId)
        if (parent) {
          parent.children.push(node)
          node.level = parent.level + 1
        }
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const categoryTree = buildTree(categories)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        ...formData,
      })
    } else {
      onAddCategory({
        ...formData,
      })
    }
    setIsDialogOpen(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      parentId: '',
    })
  }

  const handleEdit = (category: CourseCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
    })
    setIsDialogOpen(true)
  }

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const renderCategoryNode = (node: CategoryTreeNode) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedCategories.has(node.id)

    return (
      <div key={node.id} className="space-y-2">
        <div className="flex items-center gap-2">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpand(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className="flex-1 flex items-center gap-2">
            <span className="font-medium">{node.name}</span>
            <span className="text-sm text-gray-500">
              ({node.courses?.length || 0} 个课程)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(node)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => onDeleteCategory(node.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-6 space-y-2">
            {node.children.map((child) => renderCategoryNode(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">课程分类</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" />
              添加分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? '编辑分类' : '添加分类'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>分类名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="请输入分类名称"
                />
              </div>
              <div className="space-y-2">
                <Label>分类描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="请输入分类描述"
                />
              </div>
              <div className="space-y-2">
                <Label>父级分类</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择父级分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">无</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {editingCategory ? '保存' : '添加'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          {categoryTree.map((node) => renderCategoryNode(node))}
        </div>
      </Card>
    </div>
  )
} 