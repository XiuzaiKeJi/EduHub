<template>
  <div class="loading-container">
    <el-loading :fullscreen="true" text="加载中..." />
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 