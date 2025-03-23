<template>
  <div class="main-layout">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="logo">
            <router-link to="/">EduHub</router-link>
          </div>
          <div class="nav-menu">
            <el-menu
              mode="horizontal"
              :router="true"
              :default-active="route.path"
            >
              <el-menu-item index="/">首页</el-menu-item>
              <el-menu-item v-if="authStore.isAuthenticated" index="/dashboard">控制台</el-menu-item>
              <el-menu-item v-if="authStore.isAuthenticated" index="/tasks">任务管理</el-menu-item>
              <el-menu-item v-if="authStore.isAdmin" index="/admin">系统管理</el-menu-item>
            </el-menu>
          </div>
          <div class="user-actions">
            <template v-if="authStore.isAuthenticated">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ authStore.user?.username }}
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button type="primary" @click="router.push('/login')">登录</el-button>
              <el-button @click="router.push('/register')">注册</el-button>
            </template>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile');
      break;
    case 'logout':
      authStore.logout();
      ElMessage.success('已退出登录');
      router.push('/login');
      break;
  }
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.logo a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.nav-menu {
  flex: 1;
  margin: 0 20px;
}

.user-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--el-color-primary);
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-header) {
  background-color: white;
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 20px;
}

:deep(.el-main) {
  padding: 20px;
  background-color: var(--el-bg-color-page);
}
</style> 