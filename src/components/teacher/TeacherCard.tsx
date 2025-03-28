import { FC } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Teacher } from '@/types/teacher'
import { 
  User, 
  Mail, 
  BookOpen, 
  Award, 
  MapPin,
  Phone,
  Clock,
  Eye, 
  Edit, 
  Trash2,
  Briefcase,
  GraduationCap
} from 'lucide-react'

interface TeacherCardProps {
  teacher: Teacher
  onView?: (teacher: Teacher) => void
  onEdit?: (teacher: Teacher) => void
  onDelete?: (teacher: Teacher) => void
}

export const TeacherCard: FC<TeacherCardProps> = ({
  teacher,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* 教师姓名和职称 */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{teacher.user?.name}</h3>
            {teacher.title && <p className="text-sm text-gray-500">{teacher.title}</p>}
          </div>
          <Badge variant="outline">{teacher.user?.department || '未分配部门'}</Badge>
        </div>

        {/* 教师简介 */}
        {teacher.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{teacher.bio}</p>
        )}

        {/* 教师信息 */}
        <div className="space-y-2">
          {teacher.user?.email && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{teacher.user.email}</span>
            </div>
          )}
          {teacher.specialties && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>专业领域：{teacher.specialties}</span>
            </div>
          )}
          {teacher.subjects && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Briefcase className="w-4 h-4" />
              <span>教授科目：{teacher.subjects}</span>
            </div>
          )}
          {teacher.education && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <GraduationCap className="w-4 h-4" />
              <span>教育背景：{teacher.education}</span>
            </div>
          )}
          {teacher.officeLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>办公室：{teacher.officeLocation}</span>
            </div>
          )}
          {teacher.contactInfo && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span>联系方式：{teacher.contactInfo}</span>
            </div>
          )}
          {teacher.officeHours && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>办公时间：{teacher.officeHours}</span>
            </div>
          )}
          {teacher.qualifications && teacher.qualifications.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Award className="w-4 h-4" />
              <span>资质：{teacher.qualifications.length}项</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onView?.(teacher)}
          >
            <Eye className="w-4 h-4 mr-1" />
            查看
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onEdit?.(teacher)}
          >
            <Edit className="w-4 h-4 mr-1" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-red-500 hover:text-red-600"
            onClick={() => onDelete?.(teacher)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            删除
          </Button>
        </div>
      </div>
    </Card>
  )
} 