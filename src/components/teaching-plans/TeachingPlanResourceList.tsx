'use client'

import { useState, useEffect } from 'react'
import { TeachingPlanResource, TeachingPlanResourceListResponse } from '@/types/teaching-plan'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { PlusIcon, Pencil, Trash2, FileText, FileVideo, FileImage, File, ExternalLink, Download } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { formatDate, formatBytes } from '@/lib/utils'

const resourceSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  type: z.string().min(1, '类型不能为空'),
  url: z.string().min(1, 'URL不能为空'),
  size: z.coerce.number().optional(),
  format: z.string().optional(),
  order: z.coerce.number().optional().default(0),
})

type ResourceFormValues = z.infer<typeof resourceSchema>

interface TeachingPlanResourceListProps {
  courseId: string
  planId: string
}

const TeachingPlanResourceList = ({ courseId, planId }: TeachingPlanResourceListProps) => {
  const [resources, setResources] = useState<TeachingPlanResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentResource, setCurrentResource] = useState<TeachingPlanResource | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      description: '',
      type: '文档',
      url: '',
      size: undefined,
      format: '',
      order: 0,
    },
  })

  const fetchResources = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/courses/${courseId}/teaching-plans/${planId}/resources`)
      
      if (!response.ok) {
        throw new Error('获取资源列表失败')
      }
      
      const data: TeachingPlanResourceListResponse = await response.json()
      setResources(data.resources)
    } catch (err) {
      console.error('获取资源列表出错:', err)
      setError(err instanceof Error ? err.message : '获取资源列表时出错')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchResources()
  }, [courseId, planId])
  
  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      type: '文档',
      url: '',
      size: undefined,
      format: '',
      order: 0,
 