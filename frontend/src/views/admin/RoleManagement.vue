<template>
  <div class="role-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">添加角色</el-button>
        </div>
      </template>

      <el-table :data="roles" style="width: 100%">
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="权限">
          <template #default="{ row }">
            <el-tag v-for="permission in row.permissions" :key="permission.id" class="mx-1">
              {{ permission.description }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)" :disabled="isSystemRole(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="权限" prop="permissionIds">
          <el-select
            v-model="roleForm.permissionIds"
            multiple
            placeholder="请选择权限"
          >
            <el-option
              v-for="permission in permissions"
              :key="permission.id"
              :label="permission.description"
              :value="permission.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import axios from 'axios';
import type { Role, Permission } from '@/types/auth';

const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const formRef = ref<FormInstance>();
const roleForm = ref({
  name: '',
  description: '',
  permissionIds: [] as number[]
});

const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ],
  permissionIds: [
    { required: true, message: '请选择权限', trigger: 'change' }
  ]
};

// 获取角色列表
const fetchRoles = async () => {
  try {
    const response = await axios.get('/api/admin/roles');
    roles.value = response.data;
  } catch (error) {
    ElMessage.error('获取角色列表失败');
  }
};

// 获取权限列表
const fetchPermissions = async () => {
  try {
    const response = await axios.get('/api/admin/permissions');
    permissions.value = response.data;
  } catch (error) {
    ElMessage.error('获取权限列表失败');
  }
};

// 添加角色
const handleAdd = () => {
  dialogType.value = 'add';
  roleForm.value = {
    name: '',
    description: '',
    permissionIds: []
  };
  dialogVisible.value = true;
};

// 编辑角色
const handleEdit = (row: Role) => {
  dialogType.value = 'edit';
  roleForm.value = {
    name: row.name,
    description: row.description,
    permissionIds: row.permissions.map(p => p.id)
  };
  dialogVisible.value = true;
};

// 删除角色
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      type: 'warning'
    });
    await axios.delete(`/api/admin/roles/${row.id}`);
    ElMessage.success('删除成功');
    fetchRoles();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await axios.post('/api/admin/roles', roleForm.value);
          ElMessage.success('添加成功');
        } else {
          await axios.put(`/api/admin/roles/${roleForm.value.id}`, roleForm.value);
          ElMessage.success('更新成功');
        }
        dialogVisible.value = false;
        fetchRoles();
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败');
      }
    }
  });
};

// 判断是否为系统角色
const isSystemRole = (role: Role) => {
  return ['admin', 'teacher', 'student'].includes(role.name);
};

onMounted(() => {
  fetchRoles();
  fetchPermissions();
});
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mx-1 {
  margin: 0 4px;
}
</style> 