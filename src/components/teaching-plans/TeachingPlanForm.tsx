'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { TeachingPlan } from '@/types/teaching-plan'

const formSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  objectives: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TeachingPlanFormProps {
  courseId: string
  plan?: TeachingPlan
  isEditing?: boolean
}

const TeachingPlanForm = ({ courseId, plan, isEditing = false }: TeachingPlanFormProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: plan?.title || '',
      description: plan?.description || '',
      objectives: plan?.objectives || '',
      semester: plan?.semester || '',
      academicYear: plan?.academicYear || '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    
    try {
      const url = isEditing
        ? `/api/courses/${courseId}/teaching-plans/${plan?.id}`
        : `/api/courses/${courseId}/teaching-plans`
      
      const method = isEditing ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '提交失败')
      }
      
      toast({
        title: isEditing ? '教学计划已更新' : '教学计划已创建',
        description: `成功${isEditing ? '更新' : '创建'}教学计划：${values.title}`,
      })
      
      router.refresh()
      router.push(`/courses/${courseId}/teaching-plans`)
    } catch (error) {
      console.error(isEditing ? '更新教学计划出错:' : '创建教学计划出错:', error)
      toast({
        title: '操作失败',
        description: error instanceof Error ? error.message : '提交表单时出错',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="教学计划标题" {...field} />
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
                  placeholder="教学计划详细描述"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
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
                <Textarea
                  placeholder="教学计划的具体目标"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>学期</FormLabel>
                <FormControl>
                  <Input placeholder="例如：2023-2024学年第一学期" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>学年</FormLabel>
                <FormControl>
                  <Input placeholder="例如：2023-2024" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>加载中...</>
            ) : isEditing ? (
              '更新教学计划'
            ) : (
              '创建教学计划'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TeachingPlanForm 