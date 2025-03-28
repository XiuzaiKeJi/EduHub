import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CourseDetail } from '@/components/courses/CourseDetail';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
        },
      },
      schedules: true,
      resources: true,
      files: true,
    },
  });

  if (!course) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <CourseDetail course={course} />
    </div>
  );
} 