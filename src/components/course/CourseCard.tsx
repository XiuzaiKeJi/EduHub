import { FC } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Course } from '@/types/course'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { 
  BookOpen, 
  Calendar, 
  User, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  MapPin,
  GraduationCap
} from 'lucide-react'

interface CourseCardProps {
  course: Course
  onView?: (course: Course) => void
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
}

export const CourseCard: FC<CourseCardProps> = ({
  course,
  onView,
  onEdit,
  onDelete
}) => {
  const isActive = new Date() >= new Date(course.startDate) && 
                   new Date() <= new Date(course.endDate)

  const getStatusBadge = () => {
    if (new Date() < new Date(course.startDate)) {
      return <Badge variant="secondary">未开始</Badge>
    }
    if (new Date() > new Date(course.endDate)) {
      return <Badge variant="destructive">已结束</Badge>
    }
    return <Badge variant="default">进行中</Badge>
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* 课程标题和状态 */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{course.name}</h3>
            <p className="text-sm text-gray-500">{course.code}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* 课程描述 */}
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

        {/* 课程信息 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(course.startDate), 'yyyy年MM月dd日', { locale: zhCN })} - 
              {format(new Date(course.endDate), 'yyyy年MM月dd日', { locale: zhCN })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>教师：{course.teacher?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>学生：{course.currentStudents}/{course.maxStudents}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>分类：{course.category?.name}</span>
          </div>
          {course.schedules && course.schedules.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  {course.schedules[0].startTime} - {course.schedules[0].endTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{course.schedules[0].location || '未设置'}</span>
              </div>
            </>
          )}
          {course.resources && course.resources.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <GraduationCap className="w-4 h-4" />
              <span>资源：{course.resources.length}个</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onView?.(course)}
          >
            <Eye className="w-4 h-4 mr-1" />
            查看
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onEdit?.(course)}
          >
            <Edit className="w-4 h-4 mr-1" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-red-500 hover:text-red-600"
            onClick={() => onDelete?.(course)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            删除
          </Button>
        </div>
      </div>
    </Card>
  )
} 