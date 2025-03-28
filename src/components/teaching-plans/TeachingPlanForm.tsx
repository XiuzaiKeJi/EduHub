'use client'

import { useState, useEffect } from 'react'
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
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { TeachingPlan } from '@/types/teaching-plan'

const formSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  objectives: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
})

interface TeachingPlanFormProps {
  courseId: string
  planId?: string
  mode: 'create' | 'edit'
}

export function TeachingPlanForm({ courseId, planId, mode }: TeachingPlanFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialData, setInitialData] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      objectives: '',
      semester: '',
      academicYear: '',
    },
  })

  // 获取教学计划数据
  useEffect(() => {
    if (mode === 'edit' && planId) {
      const fetchPlan = async () => {
        try {
          const response = await fetch(
            `/api/courses/${courseId}/teaching-plans/${planId}`
          )
          if (!response.ok) {
            throw new Error('获取教学计划失败')
          }
          const data = await response.json()
          setInitialData(data)
          form.reset(data)
        } catch (err) {
          toast.error('获取教学计划失败')
        }
      }
      fetchPlan()
    }
  }, [courseId, planId, mode, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const url = mode === 'create'
        ? `/api/courses/${courseId}/teaching-plans`
        : `/api/courses/${courseId}/teaching-plans/${planId}`
      
      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(mode === 'create' ? '创建教学计划失败' : '更新教学计划失败')
      }

      toast.success(mode === 'create' ? '创建成功' : '更新成功')
      router.push(`/courses/${courseId}/teaching-plans`)
    } catch (err) {
      toast.error(mode === 'create' ? '创建失败' : '更新失败')
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'edit' && !initialData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder="请输入教学计划标题" {...field} />
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
                    placeholder="请输入教学计划描述"
                    className="resize-none"
                    {...field}
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
                    placeholder="请输入教学目标"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>学期</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入学期" {...field} />
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
                    <Input placeholder="请输入学年" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : mode === 'create' ? '创建' : '更新'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

export default TeachingPlanForm 