import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Clock } from 'lucide-react'
import { Course, CourseSchedule } from '@/types/course'

interface CourseScheduleManagerProps {
  courseId: string
  schedules: CourseSchedule[]
  onAddSchedule: (schedule: Omit<CourseSchedule, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateSchedule: (schedule: CourseSchedule) => void
  onDeleteSchedule: (scheduleId: string) => void
}

export const CourseScheduleManager: FC<CourseScheduleManagerProps> = ({
  courseId,
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<CourseSchedule | null>(null)
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    location: '',
    room: '',
  })

  const getDayOfWeek = (day: number) => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return days[day - 1]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSchedule) {
      onUpdateSchedule({
        ...editingSchedule,
        ...formData,
        dayOfWeek: Number(formData.dayOfWeek),
      })
    } else {
      onAddSchedule({
        courseId,
        dayOfWeek: Number(formData.dayOfWeek),
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        room: formData.room,
        teacherId: '', // 这里需要从上下文或props中获取当前教师ID
      })
    }
    setIsDialogOpen(false)
    setEditingSchedule(null)
    setFormData({
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      location: '',
      room: '',
    })
  }

  const handleEdit = (schedule: CourseSchedule) => {
    setEditingSchedule(schedule)
    setFormData({
      dayOfWeek: schedule.dayOfWeek.toString(),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location || '',
      room: schedule.room || '',
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">课程时间表</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" />
              添加时间表
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? '编辑时间表' : '添加时间表'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>上课日期</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dayOfWeek: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择上课日期" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {getDayOfWeek(day)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>开始时间</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>结束时间</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>上课地点</Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="请输入上课地点"
                />
              </div>
              <div className="space-y-2">
                <Label>教室</Label>
                <Input
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  placeholder="请输入教室"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  {editingSchedule ? '保存' : '添加'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">
                  {getDayOfWeek(schedule.dayOfWeek)}
                </div>
                <div className="text-sm text-gray-500">
                  {schedule.startTime} - {schedule.endTime}
                </div>
                <div className="text-sm text-gray-500">
                  {schedule.location}
                  {schedule.room && ` · ${schedule.room}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(schedule)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onDeleteSchedule(schedule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 