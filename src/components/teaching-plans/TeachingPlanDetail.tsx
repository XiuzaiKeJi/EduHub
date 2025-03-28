'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeachingPlan } from '@/types/teaching-plan'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Calendar, Edit, Trash2, UploadCloud, ClipboardList } from 'lucide-react'
import TeachingPlanProgressList from './TeachingPlanProgressList'
import TeachingPlanResourceList from './TeachingPlanResourceList'
import { toast } from '@/components/ui/use-toast'

interface TeachingPlanDetailProps {
  courseId: string
  plan: TeachingPlan
}

const TeachingPlanDetail = ({ courseId, plan }: TeachingPlanDetailProps) => {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/courses/${courseId}/teaching-plans/${plan.id}/edit`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/courses/${courseId}/teaching-plans/${plan.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '删除失败')
      }
      
      toast({
        title: '教学计划已删除',
        description: '成功删除教学计划',
      })
      
      router.refresh()
      router.push(`/courses/${courseId}/teaching-plans`)
    } catch (error) {
      console.error('删除教学计划出错:', error)
      toast({
        title: '删除失败',
        description: error instanceof Error ? error.message : '删除教学计划时出错',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          {plan.description && (
            <p className="mt-2 text-muted-foreground">{plan.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            {plan.semester && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{plan.semester}</span>
              </Badge>
            )}
            
            {plan.academicYear && (
              <Badge variant="outline" className="flex items-center gap-1">
                <span>{plan.academicYear}学年</span>
              </Badge>
            )}
            
            <Badge variant="outline" className="flex items-center gap-1">
              <span>创建于 {formatDate(new Date(plan.createdAt))}</span>
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </Button>
        </div>
      </div>
      
      {plan.objectives && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>教学目标</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{plan.objectives}</p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="progress">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            进度计划
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            教学资源
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="mt-4">
          <TeachingPlanProgressList courseId={courseId} planId={plan.id} />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-4">
          <TeachingPlanResourceList courseId={courseId} planId={plan.id} />
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除此教学计划吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该教学计划及其所有关联的进度和资源，且无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? '删除中...' : '确定删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TeachingPlanDetail 