<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskStatus } from '@/types/task'
import { formatDate, isOverdue } from '@/utils/date'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'status-change', taskId: number, status: TaskStatus): void
  (e: 'delete', taskId: number): void
}>()

// 计算任务状态样式
const statusStyle = computed(() => {
  switch (props.task.status) {
    case 'completed':
      return 'success'
    case 'in_progress':
      return 'warning'
    case 'cancelled':
      return 'info'
    default:
      return ''
  }
})

// 计算优先级样式
const priorityStyle = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    case 'low':
      return 'info'
    default:
      return ''
  }
})

// 处理状态变更
const handleStatusChange = (status: TaskStatus) => {
  emit('status-change', props.task.id, status)
}

// 处理删除
const handleDelete = () => {
  emit('delete', props.task.id)
}
</script>

<template>
  <div class="task-item">
    <div class="task-item__header">
      <h3 class="task-item__title">
        {{ task.title }}
        <el-tag
          v-if="task.isArchived"
          type="info"
          size="small"
          class="task-item__archived-tag"
        >
          已归档
        </el-tag>
      </h3>
      
      <div class="task-item__tags">
        <el-tag
          :type="priorityStyle"
          size="small"
          class="task-item__tag"
        >
          {{ task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级' }}
        </el-tag>
        
        <el-tag
          :type="statusStyle"
          size="small"
          class="task-item__tag"
        >
          {{ 
            task.status === 'completed' ? '已完成' :
            task.status === 'in_progress' ? '进行中' :
            task.status === 'cancelled' ? '已取消' : '待处理'
          }}
        </el-tag>
      </div>
    </div>

    <p v-if="task.description" class="task-item__description">
      {{ task.description }}
    </p>

    <div class="task-item__footer">
      <div class="task-item__dates">
        <span v-if="task.dueDate" :class="{ 'text-danger': isOverdue(task.dueDate) }">
          截止日期: {{ formatDate(task.dueDate) }}
        </span>
        <span v-if="task.completedAt">
          完成时间: {{ formatDate(task.completedAt) }}
        </span>
      </div>

      <div class="task-item__actions">
        <el-dropdown @command="handleStatusChange">
          <el-button size="small">
            更改状态
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="'pending'" :disabled="task.status === 'pending'">
                待处理
              </el-dropdown-item>
              <el-dropdown-item :command="'in_progress'" :disabled="task.status === 'in_progress'">
                进行中
              </el-dropdown-item>
              <el-dropdown-item :command="'completed'" :disabled="task.status === 'completed'">
                已完成
              </el-dropdown-item>
              <el-dropdown-item :command="'cancelled'" :disabled="task.status === 'cancelled'">
                已取消
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button
          size="small"
          type="danger"
          @click="handleDelete"
        >
          删除
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  padding: 15px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  margin-bottom: 10px;
}

.task-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.task-item__title {
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.task-item__archived-tag {
  margin-left: 8px;
}

.task-item__tags {
  display: flex;
  gap: 8px;
}

.task-item__description {
  margin: 10px 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.task-item__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.task-item__dates {
  display: flex;
  gap: 20px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.task-item__actions {
  display: flex;
  gap: 10px;
}

.text-danger {
  color: var(--el-color-danger);
}
</style> 