<template>
  <div class="home">
    <el-row justify="center" align="middle" class="welcome-section">
      <el-col :span="24" class="text-center">
        <h1>欢迎来到 EduHub</h1>
        <p>您的智慧教育资源管理平台</p>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="feature-section">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>任务管理</h3>
            </div>
          </template>
          <div class="card-content">
            <el-icon><Calendar /></el-icon>
            <p>高效的任务跟踪和管理系统</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>资源共享</h3>
            </div>
          </template>
          <div class="card-content">
            <el-icon><Share /></el-icon>
            <p>便捷的教育资源共享平台</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>协作交流</h3>
            </div>
          </template>
          <div class="card-content">
            <el-icon><ChatLineRound /></el-icon>
            <p>实时的团队协作与交流</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Share, ChatLineRound } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  padding: 2rem;
}

.welcome-section {
  min-height: 200px;
  margin-bottom: 3rem;
}

.text-center {
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: var(--el-color-primary);
  margin-bottom: 1rem;
}

.feature-section {
  margin-top: 2rem;
}

.el-card {
  transition: transform 0.3s ease;
}

.el-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 1rem;
}

.el-icon {
  font-size: 2rem;
  color: var(--el-color-primary);
  margin-bottom: 1rem;
}
</style> 