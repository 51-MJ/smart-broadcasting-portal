<template>
  <div class="permissions-management">
    <el-card class="operation-card mb-20">
      <template #header>
        <div class="card-header">
          <span>角色权限管理</span>
          <el-button type="primary" @click="showAddRole = true">
            ➕ 添加角色
          </el-button>
        </div>
      </template>

      <!-- 角色表格 -->
      <el-table :data="rolesList" stripe style="width: 100%">
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="level" label="权限级别" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userCount" label="用户数" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEditPermission(row)">编辑权限</el-button>
            <el-button type="danger" link size="small" @click="handleDeleteRole(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 地区权限映射 -->
    <el-card class="operation-card mb-20">
      <template #header>
        <span>地区权限映射</span>
      </template>

      <el-table :data="regionPermissions" style="width: 100%">
        <el-table-column prop="region" label="地区" width="150" />
        <el-table-column prop="adminCount" label="管理员数" width="120" />
        <el-table-column prop="userCount" label="用户数" width="120" />
        <el-table-column prop="contentCount" label="内容数" width="120" />
        <el-table-column label="权限管理" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEditRegion(row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="handleViewUsers(row)">查看用户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限编辑对话框 -->
    <el-dialog v-model="showPermissionDialog" :title="`编辑 ${editingRole?.name} 的权限`" width="60%">
      <div class="permission-list">
        <el-checkbox-group v-model="selectedPermissions">
          <div v-for="perm in availablePermissions" :key="perm.id" class="permission-item">
            <el-checkbox :label="perm.id">
              <strong>{{ perm.name }}</strong>
              <div style="font-size: 12px; color: #999; margin-top: 4px;">{{ perm.description }}</div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermissionDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermission">保存权限</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog v-model="showAddRole" title="添加新角色" width="50%">
      <el-form :model="newRoleForm" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="newRoleForm.name" placeholder="输入角色名称" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="newRoleForm.description" type="textarea" placeholder="输入角色描述" />
        </el-form-item>

        <el-form-item label="权限级别">
          <el-select v-model="newRoleForm.level" placeholder="选择权限级别">
            <el-option label="省级" value="省级" />
            <el-option label="乡镇级" value="乡镇级" />
            <el-option label="村级" value="村级" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddRole = false">取消</el-button>
          <el-button type="primary" @click="handleAddRole">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const showAddRole = ref(false)
const showPermissionDialog = ref(false)
const editingRole = ref(null)
const selectedPermissions = ref([])

const rolesList = ref([
  {
    id: 1,
    name: '系统管理员',
    description: '拥有系统所有权限',
    level: '省级',
    userCount: 5
  },
  {
    id: 2,
    name: '乡镇管理员',
    description: '管理所属乡镇的内容和用户',
    level: '乡镇级',
    userCount: 12
  },
  {
    id: 3,
    name: '普通用户',
    description: '只能查看和评论内容',
    level: '村级',
    userCount: 245
  }
])

const regionPermissions = ref([
  {
    region: 'A镇',
    adminCount: 2,
    userCount: 85,
    contentCount: 156
  },
  {
    region: 'B镇',
    adminCount: 1,
    userCount: 62,
    contentCount: 98
  },
  {
    region: 'C镇',
    adminCount: 1,
    userCount: 58,
    contentCount: 87
  }
])

const availablePermissions = ref([
  {
    id: 'user.view',
    name: '查看用户',
    description: '查看系统中的用户信息'
  },
  {
    id: 'user.create',
    name: '创建用户',
    description: '创建新的用户账号'
  },
  {
    id: 'user.edit',
    name: '编辑用户',
    description: '修改用户信息和权限'
  },
  {
    id: 'user.delete',
    name: '删除用户',
    description: '删除用户账号'
  },
  {
    id: 'content.view',
    name: '查看内容',
    description: '查看所有发布的内容'
  },
  {
    id: 'content.create',
    name: '创建内容',
    description: '发布新的内容'
  },
  {
    id: 'content.edit',
    name: '编辑内容',
    description: '修改已发布的内容'
  },
  {
    id: 'content.delete',
    name: '删除内容',
    description: '删除内容'
  },
  {
    id: 'permission.view',
    name: '查看权限',
    description: '查看权限配置'
  },
  {
    id: 'permission.edit',
    name: '编辑权限',
    description: '修改权限设置'
  }
])

const newRoleForm = ref({
  name: '',
  description: '',
  level: ''
})

const getLevelType = (level) => {
  const types = {
    '省级': 'danger',
    '乡镇级': 'warning',
    '村级': 'info'
  }
  return types[level] || ''
}

const handleEditPermission = (role) => {
  editingRole.value = role
  // 模拟获取该角色的权限
  selectedPermissions.value = ['user.view', 'content.view', 'content.create']
  showPermissionDialog.value = true
}

const handleSavePermission = () => {
  ElMessage.success(`${editingRole.value.name} 的权限已更新`)
  showPermissionDialog.value = false
}

const handleDeleteRole = (role) => {
  ElMessageBox.confirm(`确认删除角色"${role.name}"吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = rolesList.value.findIndex(item => item.id === role.id)
      if (index > -1) {
        rolesList.value.splice(index, 1)
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const handleAddRole = () => {
  if (!newRoleForm.value.name || !newRoleForm.value.level) {
    ElMessage.warning('请填写所有必填项')
    return
  }

  rolesList.value.push({
    ...newRoleForm.value,
    id: Math.max(...rolesList.value.map(item => item.id), 0) + 1,
    userCount: 0
  })

  ElMessage.success('角色创建成功')
  showAddRole.value = false
  newRoleForm.value = {
    name: '',
    description: '',
    level: ''
  }
}

const handleEditRegion = (region) => {
  ElMessage.info(`编辑地区 ${region.region} 的权限`)
}

const handleViewUsers = (region) => {
  ElMessage.info(`查看 ${region.region} 的用户列表`)
}
</script>

<style scoped>
.permissions-management {
  min-height: 100vh;
}

.mb-20 {
  margin-bottom: 20px;
}

.operation-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-list {
  max-height: 400px;
  overflow-y: auto;
}

.permission-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.permission-item:last-child {
  border-bottom: none;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
