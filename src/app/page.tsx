'use client';

import Card from '@/components/display/Card';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      title: '课程管理',
      description: '创建和管理课程、教学资料和作业',
      href: '/courses'
    },
    {
      title: '学生管理',
      description: '管理学生信息、考勤和成绩',
      href: '/students'
    },
    {
      title: '教师管理',
      description: '管理教师信息和课程分配',
      href: '/teachers'
    },
    {
      title: '班级管理',
      description: '管理班级、课表和学生分组',
      href: '/classes'
    },
    {
      title: '考试管理',
      description: '创建和管理考试、成绩统计',
      href: '/exams'
    },
    {
      title: '资源中心',
      description: '上传和共享教学资源',
      href: '/resources'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">功能概览</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.title}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => router.push(feature.href)}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
