<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import TaskForm from '@/components/task/TaskForm.vue'

const route = useRoute()
const router = useRouter()

const taskId = route.params.id ? Number(route.params.id) : undefined

const handleSuccess = () => {
  router.push('/tasks')
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="task-form-view">
    <h2>{{ taskId ? '编辑任务' : '创建任务' }}</h2>
    <TaskForm
      :task-id="taskId"
      @success="handleSuccess"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.task-form-view {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}
</style> 