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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TeacherQualification } from '@/types/teacher'

const qualificationFormSchema = z.object({
  name: z.string().min(1, '资质名称不能为空'),
  issuer: z.string().min(1, '发证机构不能为空'),
  issueDate: z.date({
    required_error: '请选择发证日期',
  }),
  expiryDate: z.date().optional(),
  description: z.string().optional(),
  level: z.string().optional(),
  certificateNumber: z.string().optional(),
})

type QualificationFormValues = z.infer<typeof qualificationFormSchema>

interface QualificationFormProps {
  initialData?: Partial<TeacherQualification>
  onSubmit: (data: QualificationFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export const QualificationForm: FC<QualificationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<QualificationFormValues>({
    resolver: zodResolver(qualificationFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      issuer: initialData?.issuer || '',
      issueDate: initialData?.issueDate ? new Date(initialData.issueDate) : new Date(),
      expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate) : undefined,
      description: initialData?.description || '',
      level: initialData?.level || '',
      certificateNumber: initialData?.certificateNumber || '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>资质名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入资质名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>发证机构</FormLabel>
                <FormControl>
                  <Input placeholder="请输入发证机构" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>资质等级</FormLabel>
                <FormControl>
                  <Input placeholder="请输入资质等级（可选）" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>证书编号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入证书编号（可选）" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 时间信息 */}
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>发证日期</FormLabel>
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
                          <span>选择发证日期</span>
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

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>过期日期 (可选)</FormLabel>
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
                          <span>选择过期日期</span>
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
                      disabled={(date) =>
                        date < form.getValues('issueDate')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 描述信息 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>资质描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入资质描述（可选）"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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