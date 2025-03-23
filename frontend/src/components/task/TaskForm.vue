<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Task, TaskStatus, TaskPriority, CreateTaskDto, UpdateTaskDto } from '@/types/task'
import { useTaskStore } from '@/stores/task'

const props = defineProps<{
  taskId?: number // 编辑模式时传入任务ID
}>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
}>()

const taskStore = useTaskStore()

const formRef = ref()
const loading = ref(false)

// 初始表单数据
const initialFormData: CreateTaskDto = {
  title: '',
  description: '',
  priority: TaskPriority.MEDIUM,
  status: TaskStatus.PENDING,
  dueDate: undefined
}

// 表单数据
const formData = ref<CreateTaskDto | UpdateTaskDto>({ ...initialFormData })

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  priority: [
    { required: true, message: '请选择任务优先级', trigger: 'change' }
  ],
  dueDate: [
    { type: 'datetime', message: '请选择有效的截止日期', trigger: 'change' }
  ]
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.value = { ...initialFormData }
}

// 加载任务数据
const loadTask = async () => {
  if (!props.taskId) {
    resetForm()
    return
  }
  
  try {
    loading.value = true
    const task = await taskStore.fetchTaskById(props.taskId)
    if (task) {
      formData.value = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }
    }
  } catch (error) {
    ElMessage.error('加载任务数据失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    if (props.taskId) {
      await taskStore.updateTask(props.taskId, formData.value as UpdateTaskDto)
      ElMessage.success('更新任务成功')
    } else {
      await taskStore.createTask(formData.value as CreateTaskDto)
      ElMessage.success('创建任务成功')
    }
    
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    loading.value = false
  }
}

// 取消操作
const handleCancel = () => {
  resetForm()
  emit('cancel')
}

onMounted(() => {
  loadTask()
})
</script>

<template>
  <div class="task-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入任务标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入任务描述"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="formData.priority" placeholder="请选择优先级">
          <el-option
            v-for="priority in Object.values(TaskPriority)"
            :key="priority"
            :label="priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'"
            :value="priority"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option
            v-for="status in Object.values(TaskStatus)"
            :key="status"
            :label="
              status === 'completed' ? '已完成' :
              status === 'in_progress' ? '进行中' :
              status === 'cancelled' ? '已取消' : '待处理'
            "
            :value="status"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="截止日期" prop="dueDate">
        <el-date-picker
          v-model="formData.dueDate"
          type="datetime"
          placeholder="选择截止日期"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ props.taskId ? '更新' : '创建' }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.task-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style> 