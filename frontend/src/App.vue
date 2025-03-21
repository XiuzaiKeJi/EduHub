<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="app-container">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <h2>欢迎使用 EduHub 管理系统</h2>
        </div>
      </template>
      <div class="card-content">
        <el-result
          icon="success"
          title="开发环境已就绪"
          sub-title="前端服务运行正常"
        >
          <template #extra>
            <el-button type="primary">开始使用</el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.welcome-card {
  width: 600px;
}

.card-header {
  text-align: center;
}

.card-content {
  padding: 20px;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
