<script setup lang="ts">
defineProps<{
  currentPage: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'current-change', page: number): void
}>()
</script>

<template>
  <div class="task-pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="page => emit('current-change', page)"
    />
  </div>
</template>

<style scoped>
.task-pagination {
  display: flex;
  justify-content: center;
}
</style> 