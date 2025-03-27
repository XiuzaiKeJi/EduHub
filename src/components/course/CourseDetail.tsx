import { FC } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Calendar, 
  User, 
  Users, 
  Clock,
  MapPin,
  GraduationCap,
  FileText,
  ListTodo,
  Edit,
  Trash2,
  Mail,
  Building2
} from 'lucide-react'
import { Course } from '@/types/course'

interface CourseDetailProps {
  course: Course
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
}

export const CourseDetail: FC<CourseDetailProps> = ({
  course,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = () => {
    switch (course.status) {
      case 'PLANNED':
        return <Badge variant="secondary">未开始</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="default">进行中</Badge>
      case 'COMPLETED':
        return <Badge variant="destructive">已结束</Badge>
      default:
        return null
    }
  }

  const getDayOfWeek = (day: number) => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return days[day - 1]
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{course.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{course.code}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(course)}
          >
            <Edit className="w-4 h-4 mr-1" />
            编辑
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => onDelete?.(course)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            删除
          </Button>
        </div>
      </div>

      {/* 基本信息卡片 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>分类：{course.category?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>教师：{course.teacher?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>学生：{course.currentStudents}/{course.maxStudents}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(course.startDate), 'yyyy年MM月dd日', { locale: zhCN })} - 
                {format(new Date(course.endDate), 'yyyy年MM月dd日', { locale: zhCN })}
              </span>
            </div>
            {course.schedules && course.schedules.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {getDayOfWeek(course.schedules[0].dayOfWeek)} {course.schedules[0].startTime} - {course.schedules[0].endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{course.schedules[0].location || '未设置'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* 描述信息 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">课程描述</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{course.description || '暂无描述'}</p>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">课程时间表</TabsTrigger>
          <TabsTrigger value="resources">课程资源</TabsTrigger>
          <TabsTrigger value="tasks">相关任务</TabsTrigger>
          <TabsTrigger value="teacher">教师信息</TabsTrigger>
        </TabsList>

        {/* 课程时间表 */}
        <TabsContent value="schedule" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">课程时间表</h2>
            {course.schedules && course.schedules.length > 0 ? (
              <div className="space-y-4">
                {course.schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        {getDayOfWeek(schedule.dayOfWeek)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {schedule.location || '未设置'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">暂无课程时间表</p>
            )}
          </Card>
        </TabsContent>

        {/* 课程资源 */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">课程资源</h2>
            {course.resources && course.resources.length > 0 ? (
              <div className="space-y-4">
                {course.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-gray-500">
                        {resource.description || '暂无描述'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {resource.type} · {resource.format}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">暂无课程资源</p>
            )}
          </Card>
        </TabsContent>

        {/* 相关任务 */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">相关任务</h2>
            {course.tasks && course.tasks.length > 0 ? (
              <div className="space-y-4">
                {course.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">
                        {task.description || '暂无描述'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.status}</Badge>
                      <Badge variant="outline">{task.priority}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">暂无相关任务</p>
            )}
          </Card>
        </TabsContent>

        {/* 教师信息 */}
        <TabsContent value="teacher" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">教师信息</h2>
            {course.teacher ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{course.teacher.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{course.teacher.email}</span>
                </div>
                {course.teacher.department && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span>{course.teacher.department}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span>角色：{course.teacher.role === 'TEACHER' ? '教师' : course.teacher.role}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">暂无教师信息</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 