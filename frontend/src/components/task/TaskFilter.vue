<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TaskStatus, TaskPriority } from '@/types/task'

const props = defineProps<{
  filters: {
    status: string
    priority: string
    isArchived: boolean
  }
}>()

const emit = defineEmits<{
  (e: 'change', filters: typeof props.filters): void
}>()

const localFilters = ref({ ...props.filters })

// 状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

// 优先级选项
const priorityOptions = [
  { label: '全部', value: '' },
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' }
]

// 监听筛选条件变化
watch(localFilters, (newFilters) => {
  emit('change', newFilters)
}, { deep: true })
</script>

<template>
  <div class="task-filter">
    <el-form :inline="true" :model="localFilters">
      <el-form-item label="状态">
        <el-select v-model="localFilters.status" placeholder="选择状态">
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="优先级">
        <el-select v-model="localFilters.priority" placeholder="选择优先级">
          <el-option
            v-for="option in priorityOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-switch
          v-model="localFilters.isArchived"
          active-text="显示已归档"
          inactive-text="隐藏已归档"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.task-filter {
  margin-bottom: 20px;
  padding: 15px;
  background-color: var(--el-bg-color-page);
  border-radius: var(--el-border-radius-base);
}
</style> 