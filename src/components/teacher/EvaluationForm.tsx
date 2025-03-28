import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TeacherEvaluation } from '@/types/teacher'
import { Course } from '@/types/course'

const evaluationFormSchema = z.object({
  courseId: z.string().min(1, '请选择课程'),
  rating: z.number().min(1, '评分不能低于1').max(5, '评分不能高于5'),
  comment: z.string().optional(),
  evaluationDate: z.date({
    required_error: '请选择评价日期',
  }),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendations: z.string().optional(),
})

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>

interface EvaluationFormProps {
  initialData?: Partial<TeacherEvaluation>
  courses: Course[]
  onSubmit: (data: EvaluationFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export const EvaluationForm: FC<EvaluationFormProps> = ({
  initialData,
  courses,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      courseId: initialData?.courseId || '',
      rating: initialData?.rating || 5,
      comment: initialData?.comment || '',
      evaluationDate: initialData?.evaluationDate 
        ? new Date(initialData.evaluationDate) 
        : new Date(),
      strengths: initialData?.strengths || '',
      weaknesses: initialData?.weaknesses || '',
      recommendations: initialData?.recommendations || '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 课程信息 */}
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>评价课程</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择评价课程" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 评价日期 */}
          <FormField
            control={form.control}
            name="evaluationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>评价日期</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'yyyy年MM月dd日', { locale: zhCN })
                        ) : (
                          <span>选择评价日期</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 评分 */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>评分 (1-5)</FormLabel>
                <FormControl>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`w-12 h-12 p-0 ${
                            field.value >= rating ? 'bg-yellow-50' : ''
                          }`}
                          onClick={() => field.onChange(rating)}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              field.value >= rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>非常差</span>
                      <span>非常好</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 评价内容 */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>评价内容</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入评价内容"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="strengths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>优势</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入教师优势"
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
            name="weaknesses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>有待改进</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入有待改进的地方"
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
            name="recommendations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>建议</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入建议"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '提交中...' : '提交'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 