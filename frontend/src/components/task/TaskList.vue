<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Task, TaskStatus, TaskPriority } from '@/types/task'
import TaskFilter from './TaskFilter.vue'
import TaskItem from './TaskItem.vue'
import TaskPagination from './TaskPagination.vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()

const loading = ref(false)
const tasks = ref<Task[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const filters = ref({
  status: '',
  priority: '',
  isArchived: false
})

// 加载任务列表
const loadTasks = async () => {
  try {
    loading.value = true
    const response = await taskStore.getTasks({
      page: currentPage.value,
      limit: pageSize.value,
      ...filters.value
    })
    tasks.value = response.tasks
    total.value = response.pagination.total
  } catch (error) {
    ElMessage.error('加载任务列表失败')
  } finally {
    loading.value = false
  }
}

// 处理筛选变化
const handleFilterChange = (newFilters: typeof filters.value) => {
  filters.value = newFilters
  currentPage.value = 1 // 重置页码
  loadTasks()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadTasks()
}

// 处理任务状态变化
const handleStatusChange = async (taskId: number, status: TaskStatus) => {
  try {
    await taskStore.updateTask(taskId, { status })
    ElMessage.success('更新任务状态成功')
    loadTasks()
  } catch (error) {
    ElMessage.error('更新任务状态失败')
  }
}

// 处理任务删除
const handleDelete = async (taskId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
      type: 'warning'
    })
    await taskStore.deleteTask(taskId)
    ElMessage.success('删除任务成功')
    loadTasks()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除任务失败')
    }
  }
}

// 批量更新状态
const handleBatchUpdate = async (taskIds: number[], status: TaskStatus) => {
  try {
    await taskStore.batchUpdateStatus(taskIds, status)
    ElMessage.success('批量更新状态成功')
    loadTasks()
  } catch (error) {
    ElMessage.error('批量更新状态失败')
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="task-list">
    <TaskFilter
      :filters="filters"
      @change="handleFilterChange"
    />
    
    <el-table
      v-loading="loading"
      :data="tasks"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <TaskItem
            :task="row"
            @status-change="handleStatusChange"
            @delete="handleDelete"
          />
        </template>
      </el-table-column>
      
      <el-table-column prop="priority" label="优先级" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'"
          >
            {{ row.priority === 'high' ? '高' : row.priority === 'medium' ? '中' : '低' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag
            :type="row.status === 'completed' ? 'success' : row.status === 'in_progress' ? 'warning' : 'info'"
          >
            {{ 
              row.status === 'completed' ? '已完成' :
              row.status === 'in_progress' ? '进行中' :
              row.status === 'cancelled' ? '已取消' : '待处理'
            }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="dueDate" label="截止日期" width="180">
        <template #default="{ row }">
          <span :class="{ 'text-danger': isOverdue(row.dueDate) }">
            {{ formatDate(row.dueDate) }}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            @click="$router.push(`/tasks/${row.id}`)"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="$router.push(`/tasks/${row.id}/edit`)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="task-list__footer">
      <div class="task-list__batch-actions" v-if="selectedTasks.length">
        <el-button-group>
          <el-button
            type="primary"
            @click="handleBatchUpdate(selectedTasks, 'completed')"
          >
            标记为已完成
          </el-button>
          <el-button
            type="warning"
            @click="handleBatchUpdate(selectedTasks, 'in_progress')"
          >
            标记为进行中
          </el-button>
          <el-button
            type="info"
            @click="handleBatchUpdate(selectedTasks, 'pending')"
          >
            标记为待处理
          </el-button>
        </el-button-group>
      </div>
      
      <TaskPagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.task-list {
  padding: 20px;
}

.task-list__footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-danger {
  color: var(--el-color-danger);
}

.task-list__batch-actions {
  margin-right: 20px;
}
</style> 