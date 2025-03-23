<template>
  <div class="user-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </div>
      </template>

      <el-table :data="users" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="isActive" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role.id" class="mx-1">
              {{ role.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleAssignRoles(row)">分配角色</el-button>
            <el-button 
              type="danger" 
              link 
              @click="handleDelete(row)"
              :disabled="isSystemUser(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="状态" prop="isActive">
          <el-switch v-model="userForm.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="分配角色"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <span>{{ selectedUser?.username }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="roleForm.roleIds"
            multiple
            placeholder="请选择角色"
          >
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRoleSubmit">确定</el-button>
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
import type { User, Role } from '@/types/auth';

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const dialogVisible = ref(false);
const roleDialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const formRef = ref<FormInstance>();
const roleFormRef = ref<FormInstance>();
const selectedUser = ref<User | null>(null);

const userForm = ref({
  username: '',
  email: '',
  password: '',
  isActive: true
});

const roleForm = ref({
  roleIds: [] as number[]
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
  ]
};

// 获取用户列表
const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/admin/users');
    users.value = response.data;
  } catch (error) {
    ElMessage.error('获取用户列表失败');
  }
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

// 添加用户
const handleAdd = () => {
  dialogType.value = 'add';
  userForm.value = {
    username: '',
    email: '',
    password: '',
    isActive: true
  };
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row: User) => {
  dialogType.value = 'edit';
  userForm.value = {
    username: row.username,
    email: row.email,
    isActive: row.isActive
  };
  dialogVisible.value = true;
};

// 分配角色
const handleAssignRoles = (row: User) => {
  selectedUser.value = row;
  roleForm.value = {
    roleIds: row.roles.map(role => role.id)
  };
  roleDialogVisible.value = true;
};

// 删除用户
const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning'
    });
    await axios.delete(`/api/admin/users/${row.id}`);
    ElMessage.success('删除成功');
    fetchUsers();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 提交用户表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await axios.post('/api/admin/users', userForm.value);
          ElMessage.success('添加成功');
        } else {
          await axios.put(`/api/admin/users/${selectedUser.value?.id}`, userForm.value);
          ElMessage.success('更新成功');
        }
        dialogVisible.value = false;
        fetchUsers();
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败');
      }
    }
  });
};

// 提交角色分配
const handleRoleSubmit = async () => {
  if (!selectedUser.value) return;
  
  try {
    await axios.put(`/api/admin/users/${selectedUser.value.id}/roles`, roleForm.value);
    ElMessage.success('角色分配成功');
    roleDialogVisible.value = false;
    fetchUsers();
  } catch (error) {
    ElMessage.error('角色分配失败');
  }
};

// 判断是否为系统用户
const isSystemUser = (user: User) => {
  return user.roles.some(role => ['admin', 'teacher', 'student'].includes(role.name));
};

onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>

<style scoped>
.user-management {
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