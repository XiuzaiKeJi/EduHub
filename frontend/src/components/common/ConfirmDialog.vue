<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="30%"
    :close-on-click-modal="false"
  >
    <span>{{ message }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const visible = ref(true);
const loading = ref(false);

const handleConfirm = async () => {
  loading.value = true;
  try {
    emit('confirm');
  } finally {
    loading.value = false;
    visible.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 