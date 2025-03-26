'use client';

import { useState } from 'react';
import { Card } from '@/components/display/Card';
import { Button } from '@/components/form/Button';
import { Modal } from '@/components/display/Modal';

export default function CoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courses = [
    {
      id: 1,
      name: '高等数学',
      teacher: '张三',
      schedule: '周一 8:00-10:00',
      students: 45,
      progress: '进行中'
    },
    {
      id: 2,
      name: '大学物理',
      teacher: '李四',
      schedule: '周二 10:00-12:00',
      students: 38,
      progress: '未开始'
    },
    {
      id: 3,
      name: '计算机基础',
      teacher: '王五',
      schedule: '周三 14:00-16:00',
      students: 42,
      progress: '已结束'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">课程管理</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          创建课程
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
              <span className={`px-2 py-1 text-sm rounded ${
                course.progress === '进行中' ? 'bg-green-100 text-green-800' :
                course.progress === '未开始' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {course.progress}
              </span>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>教师：{course.teacher}</p>
              <p>上课时间：{course.schedule}</p>
              <p>学生人数：{course.students}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="small">
                编辑
              </Button>
              <Button variant="outline" size="small">
                查看详情
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="创建新课程"
      >
        <div className="p-4">
          <p>课程创建表单将在这里实现</p>
        </div>
      </Modal>
    </div>
  );
} 