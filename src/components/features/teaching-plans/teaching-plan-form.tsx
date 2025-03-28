import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().min(1, "描述不能为空"),
  objectives: z.string().min(1, "教学目标不能为空"),
  courseId: z.string().min(1, "课程不能为空"),
})

type FormValues = z.infer<typeof formSchema>

export function TeachingPlanForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      objectives: "",
      courseId: "",
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/teaching-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("创建教学计划失败")
      }

      toast({
        title: "创建成功",
        description: "教学计划已创建",
      })

      router.push("/teaching-plans")
      router.refresh()
    } catch (error) {
      toast({
        title: "创建失败",
        description: "创建教学计划时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="输入教学计划标题" {...field} />
              </FormControl>
              <FormDescription>
                为教学计划提供一个清晰的标题
              </FormDescription>
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
                  placeholder="输入教学计划描述"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                详细描述教学计划的内容和范围
              </FormDescription>
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
                  placeholder="输入教学目标"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                列出教学计划的具体目标
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>课程</FormLabel>
              <FormControl>
                <Input placeholder="输入课程ID" {...field} />
              </FormControl>
              <FormDescription>
                选择该教学计划所属的课程
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "创建中..." : "创建教学计划"}
        </Button>
      </form>
    </Form>
  )
} 