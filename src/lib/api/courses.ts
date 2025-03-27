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