import { Calendar, Clock, User, BookOpen, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CourseSchedule } from './CourseSchedule';
import { CourseResources } from './CourseResources';

interface CourseDetailProps {
  course: {
    id: string;
    name: string;
    description: string | null;
    code: string;
    category: {
      name: string;
    };
    startDate: Date;
    endDate: Date;
    status: string;
    maxStudents: number | null;
    currentStudents: number | null;
    teacher: {
      name: string;
      email: string;
      department: string | null;
    };
    schedules: {
      id: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      location: string;
      teacher: {
        name: string;
      };
    }[];
    resources: {
      id: string;
      name: string;
      type: string;
      url: string;
      description: string | null;
      createdAt: Date;
    }[];
  };
}

export function CourseDetail({ course }: CourseDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return '计划中';
      case 'IN_PROGRESS':
        return '进行中';
      case 'COMPLETED':
        return '已结束';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{course.name}</CardTitle>
            <Badge className={getStatusColor(course.status)}>
              {getStatusText(course.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="h-5 w-5" />
                <span>课程代码：{course.code}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(course.startDate, 'yyyy年MM月dd日', { locale: zhCN })} -{' '}
                  {format(course.endDate, 'yyyy年MM月dd日', { locale: zhCN })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>
                  学生人数：{course.currentStudents || 0}
                  {course.maxStudents && ` / ${course.maxStudents}`}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>授课教师：{course.teacher.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>课程分类：{course.category.name}</span>
              </div>
            </div>
          </div>
          {course.description && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">课程描述</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{course.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {course.schedules && course.schedules.length > 0 && (
        <CourseSchedule schedules={course.schedules} />
      )}

      {course.resources && course.resources.length > 0 && (
        <CourseResources resources={course.resources} />
      )}
    </div>
  );
} 