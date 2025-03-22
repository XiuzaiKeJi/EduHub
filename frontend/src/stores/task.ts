import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const loading = ref(false);
  const error = ref('');

  // 获取任务列表
  async function fetchTasks() {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await axios.get('/api/tasks');
      tasks.value = response.data.tasks;
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取任务列表失败';
    } finally {
      loading.value = false;
    }
  }

  // 获取单个任务详情
  async function fetchTaskById(id: number) {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await axios.get(`/api/tasks/${id}`);
      currentTask.value = response.data.task;
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取任务详情失败';
    } finally {
      loading.value = false;
    }
  }

  // 创建任务
  async function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await axios.post('/api/tasks', taskData);
      tasks.value.push(response.data.task);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '创建任务失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 更新任务
  async function updateTask(id: number, taskData: Partial<Task>) {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await axios.put(`/api/tasks/${id}`, taskData);
      const index = tasks.value.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks.value[index] = response.data.task;
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data.task;
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新任务失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 删除任务
  async function deleteTask(id: number) {
    try {
      loading.value = true;
      error.value = '';
      
      await axios.delete(`/api/tasks/${id}`);
      tasks.value = tasks.value.filter(task => task.id !== id);
      if (currentTask.value?.id === id) {
        currentTask.value = null;
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '删除任务失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask
  };
}); 