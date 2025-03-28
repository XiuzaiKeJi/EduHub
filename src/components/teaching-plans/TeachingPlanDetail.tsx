'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TeachingPlan } from '@/types/teaching-plan'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Calendar, Edit, Trash2, UploadCloud, ClipboardList, MoreVertical } from 'lucide-react'
import TeachingPlanProgressList from './TeachingPlanProgressList'
import TeachingPlanResourceList from './TeachingPlanResourceList'
import { toast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { FileText, Video, Book } from "lucide-react";

interface TeachingPlanDetailProps {
  courseId: string
  planId: string
}

export function TeachingPlanDetail({ courseId, planId }: TeachingPlanDetailProps) {
  const router = useRouter()
  const [plan, setPlan] = useState<TeachingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 获取教学计划详情
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          `/api/courses/${courseId}/teaching-plans/${planId}`
        )
        if (!response.ok) {
          throw new Error("获取教学计划失败")
        }
        const data = await response.json()
        setPlan(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取教学计划失败")
        toast.error("获取教学计划失败")
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [courseId, planId])

  const handleEdit = () => {
    router.push(`/courses/${courseId}/teaching-plans/${planId}/edit`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(
        `/api/courses/${courseId}/teaching-plans/${planId}`,
        {
          method: 'DELETE',
        }
      )
      
      if (!response.ok) {
        throw new Error("删除教学计划失败")
      }
      
      toast.success("删除成功")
      router.push(`/courses/${courseId}/teaching-plans`)
    } catch (err) {
      toast.error("删除失败")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || "教学计划不存在"}</p>
      </div>
    )
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleEdit}
            >
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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