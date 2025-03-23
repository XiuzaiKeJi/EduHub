<template>
  <div class="error-container" v-if="error">
    <el-alert
      :title="error"
      type="error"
      :closable="true"
      show-icon
      @close="clearError"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: string | null;
}>();

const emit = defineEmits<{
  (e: 'clear'): void;
}>();

const clearError = () => {
  emit('clear');
};
</script>

<style scoped>
.error-container {
  margin: 10px 0;
  width: 100%;
}
</style> 