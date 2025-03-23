import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskFilters, TaskListResponse } from '@/types/task';
import { api } from '@/utils/api';
import { request } from '@/utils/request';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    total: 0,
    loading: false,
    error: null as string | null
  }),

  getters: {
    // 获取未完成的任务数量
    uncompletedCount: (state) => 
      state.tasks.filter(task => task.status !== 'completed').length,
    
    // 获取已归档的任务数量
    archivedCount: (state) =>
      state.tasks.filter(task => task.isArchived).length,
    
    // 按优先级分组的任务
    tasksByPriority: (state) => {
      const groups = {
        high: [] as Task[],
        medium: [] as Task[],
        low: [] as Task[]
      }
      state.tasks.forEach(task => {
        groups[task.priority].push(task)
      })
      return groups
    }
  },

  actions: {
    // 获取任务列表
    async getTasks(filters: TaskFilters) {
      this.loading = true;
      this.error = null;
      try {
        const response = await request.get<TaskListResponse>('/tasks', { params: filters });
        this.tasks = response.data.tasks;
        this.total = response.data.pagination.total;
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取单个任务详情
    async fetchTaskById(id: number) {
      try {
        this.loading = true;
        this.error = '';
        
        const response = await api.get<Task>(`/tasks/${id}`);
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = response.data;
        }
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || '获取任务详情失败';
      } finally {
        this.loading = false;
      }
    },

    // 创建任务
    async createTask(task: Partial<Task>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await request.post<Task>('/tasks', task);
        this.tasks.unshift(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新任务
    async updateTask(id: number, task: Partial<Task>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await request.put<Task>(`/tasks/${id}`, task);
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除任务
    async deleteTask(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await request.delete(`/tasks/${id}`);
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 批量更新任务状态
    async batchUpdateStatus(taskIds: number[], status: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await request.post('/tasks/batch/status', { taskIds, status });
        // 更新本地状态
        response.data.forEach((updatedTask: Task) => {
          const index = this.tasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
        });
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清除错误
    clearError() {
      this.error = null;
    }
  }
}); 