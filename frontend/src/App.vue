<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { permissionService } from '@/services/permissionService';

const authStore = useAuthStore();

// 权限变更监听器
const handlePermissionUpdate = (permissions: Set<string>, roles: Set<string>) => {
  authStore.permissions = permissions;
  authStore.roles = roles;
};

onMounted(() => {
  permissionService.addListener(handlePermissionUpdate);
});

onUnmounted(() => {
  permissionService.removeListener(handlePermissionUpdate);
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>
