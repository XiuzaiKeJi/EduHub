<template>
  <div class="task-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>任务详情</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <template v-if="task">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="标题">{{ task.title }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ task.description || '无' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(task.status)">{{ getStatusText(task.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(task.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(task.updatedAt) }}</el-descriptions-item>
        </el-descriptions>

        <div class="actions">
          <el-button type="primary" @click="showEditDialog">编辑</el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
      </template>

      <el-empty v-else description="任务不存在" />
    </el-card>

    <!-- 编辑任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑任务"
      width="500px"
    >
      <el-form :model="taskForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="taskForm.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="taskForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="taskForm.status">
            <el-option label="待处理" value="pending" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTaskStore } from '@/stores/task'
import type { Task, UpdateTaskDto } from '@/types/task'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const loading = ref(false)
const task = ref<Task | null>(null)
const dialogVisible = ref(false)
const taskForm = ref<UpdateTaskDto>({
  title: '',
  description: '',
  status: 'pending'
})

// 获取任务详情
const fetchTask = async () => {
  try {
    loading.value = true
    const taskId = parseInt(route.params.id as string)
    task.value = await taskStore.getTaskById(taskId)
  } catch (error) {
    ElMessage.error('获取任务详情失败')
  } finally {
    loading.value = false
  }
}

// 显示编辑对话框
const showEditDialog = () => {
  if (task.value) {
    taskForm.value = {
      title: task.value.title,
      description: task.value.description,
      status: task.value.status
    }
    dialogVisible.value = true
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (task.value) {
      await taskStore.updateTask(task.value.id, taskForm.value)
      ElMessage.success('更新任务成功')
      dialogVisible.value = false
      fetchTask()
    }
  } catch (error) {
    ElMessage.error('更新任务失败')
  }
}

// 删除任务
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
      type: 'warning'
    })
    if (task.value) {
      await taskStore.deleteTask(task.value.id)
      ElMessage.success('删除任务成功')
      router.push('/tasks')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除任务失败')
    }
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成'
  }
  return texts[status] || status
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  fetchTask()
})
</script>

<style scoped>
.task-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 