import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CourseScheduleProps {
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
}

const DAYS_OF_WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function CourseSchedule({ schedules }: CourseScheduleProps) {
  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), 'HH:mm', { locale: zhCN });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>课程时间表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">星期</th>
                <th className="py-2 px-4 text-left">时间</th>
                <th className="py-2 px-4 text-left">地点</th>
                <th className="py-2 px-4 text-left">教师</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{DAYS_OF_WEEK[schedule.dayOfWeek - 1]}</td>
                  <td className="py-2 px-4">
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </td>
                  <td className="py-2 px-4">{schedule.location}</td>
                  <td className="py-2 px-4">{schedule.teacher.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 