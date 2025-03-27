export async function updateCourse(id: string, data: Partial<Course>): Promise<Course> {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('更新课程失败')
  }

  return response.json()
}

export async function updateCourseSchedule(id: string, data: Partial<CourseSchedule>): Promise<CourseSchedule> {
  const response = await fetch(`/api/courses/schedules/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('更新课程时间表失败')
  }

  return response.json()
}

export async function createCourseSchedule(data: Omit<CourseSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<CourseSchedule> {
  const response = await fetch('/api/courses/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('创建课程时间表失败')
  }

  return response.json()
}

export async function deleteCourseSchedule(id: string): Promise<void> {
  const response = await fetch(`/api/courses/schedules/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('删除课程时间表失败')
  }
}

export async function checkScheduleConflict(courseId: string, schedule: Omit<CourseSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
  const response = await fetch(`/api/courses/schedules/check-conflict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseId,
      schedule,
    }),
  })

  if (!response.ok) {
    throw new Error('检查时间冲突失败')
  }

  const data = await response.json()
  return data.hasConflict
} 