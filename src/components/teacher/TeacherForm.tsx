import { FC } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Teacher } from '@/types/teacher'
import { User } from '@/types/course'

const teacherFormSchema = z.object({
  userId: z.string().min(1, '请选择用户'),
  title: z.string().optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  specialties: z.string().optional(),
  subjects: z.string().optional(),
  achievements: z.string().optional(),
  contactInfo: z.string().optional(),
  officeHours: z.string().optional(),
  officeLocation: z.string().optional(),
})

type TeacherFormValues = z.infer<typeof teacherFormSchema>

interface TeacherFormProps {
  initialData?: Partial<Teacher>
  users: User[]
  onSubmit: (data: TeacherFormValues) => void
  onCancel: () => void
  isLoading?: boolean
  isEditing?: boolean
}

export const TeacherForm: FC<TeacherFormProps> = ({
  initialData,
  users,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}) => {
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      userId: initialData?.userId || '',
      title: initialData?.title || '',
      bio: initialData?.bio || '',
      education: initialData?.education || '',
      experience: initialData?.experience || '',
      specialties: initialData?.specialties || '',
      subjects: initialData?.subjects || '',
      achievements: initialData?.achievements || '',
      contactInfo: initialData?.contactInfo || '',
      officeHours: initialData?.officeHours || '',
      officeLocation: initialData?.officeLocation || '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          {!isEditing && (
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择用户</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择要创建教师档案的用户" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users
                        .filter(user => user.role !== 'TEACHER')
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>职称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入职称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>专业领域</FormLabel>
                <FormControl>
                  <Input placeholder="请输入专业领域，多个领域用逗号分隔" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>教授科目</FormLabel>
                <FormControl>
                  <Input placeholder="请输入教授科目，多个科目用逗号分隔" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>联系方式</FormLabel>
                <FormControl>
                  <Input placeholder="请输入联系方式" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officeLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>办公室位置</FormLabel>
                <FormControl>
                  <Input placeholder="请输入办公室位置" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officeHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>办公时间</FormLabel>
                <FormControl>
                  <Input placeholder="请输入办公时间，例如：周一至周五 9:00-17:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 详细信息 */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>个人简介</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入个人简介"
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
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>教育背景</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入教育背景"
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
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>工作经验</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入工作经验"
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
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>成就与奖项</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入成就与奖项"
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