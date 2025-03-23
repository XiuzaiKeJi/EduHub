import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { api } from '@/utils/api';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const loading = ref(false);
  const error = ref('');

  // 获取任务列表
  const getTasks = async () => {
    const response = await api.get<Task[]>('/tasks');
    tasks.value = response.data;
    return response.data;
  };

  // 获取单个任务详情
  async function fetchTaskById(id: number) {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await api.get<Task>(`/tasks/${id}`);
      currentTask.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取任务详情失败';
    } finally {
      loading.value = false;
    }
  }

  // 创建任务
  const createTask = async (task: CreateTaskDto) => {
    const response = await api.post<Task>('/tasks', task);
    tasks.value.unshift(response.data);
    return response.data;
  };

  // 更新任务
  const updateTask = async (id: number, task: UpdateTaskDto) => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
    if (currentTask.value?.id === id) {
      currentTask.value = response.data;
    }
    return response.data;
  };

  // 删除任务
  const deleteTask = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value.splice(index, 1);
    }
    if (currentTask.value?.id === id) {
      currentTask.value = null;
    }
  };

  return {
    tasks,
    currentTask,
    loading,
    error,
    getTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask
  };
}); 