<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="welcome-header">
              <h2>欢迎回来，{{ user?.username }}</h2>
              <el-button type="danger" @click="handleLogout" :loading="loading">
                退出登录
              </el-button>
            </div>
          </template>
          <div class="user-info">
            <p><strong>邮箱：</strong>{{ user?.email }}</p>
            <p><strong>注册时间：</strong>{{ formatDate(user?.created_at) }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>待办任务</h3>
              <el-tag type="warning">{{ todoCount }}</el-tag>
            </div>
          </template>
          <div class="task-list">
            <!-- 待实现：显示待办任务列表 -->
            <el-empty description="暂无待办任务" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>进行中</h3>
              <el-tag type="primary">{{ inProgressCount }}</el-tag>
            </div>
          </template>
          <div class="task-list">
            <!-- 待实现：显示进行中任务列表 -->
            <el-empty description="暂无进行中任务" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>已完成</h3>
              <el-tag type="success">{{ completedCount }}</el-tag>
            </div>
          </template>
          <div class="task-list">
            <!-- 待实现：显示已完成任务列表 -->
            <el-empty description="暂无已完成任务" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const loading = ref(false);

// 模拟数据
const todoCount = ref(0);
const inProgressCount = ref(0);
const completedCount = ref(0);

const formatDate = (date: string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleLogout = async () => {
  try {
    loading.value = true;
    authStore.logout();
    ElMessage.success('已退出登录');
    router.push('/login');
  } catch (error) {
    ElMessage.error('退出登录失败');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    await authStore.fetchUserInfo();
  } catch (error) {
    ElMessage.error('获取用户信息失败');
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-header h2 {
  margin: 0;
}

.user-info {
  margin-top: 10px;
}

.user-info p {
  margin: 5px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.task-list {
  min-height: 200px;
}

.mt-4 {
  margin-top: 24px;
}
</style> 