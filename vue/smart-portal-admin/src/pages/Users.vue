<template>
  <div class="users-management">
    <el-card class="operation-card mb-20">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="showAddUser = true">
            ➕ 添加用户
          </el-button>
        </div>
      </template>

      <!-- 搜索 -->
      <el-row :gutter="20" class="mb-20">
        <el-col :xs="24" :sm="8">
          <el-input v-model="searchQuery" placeholder="搜索用户名或邮箱..." clearable />
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-select v-model="selectedRole" placeholder="选择角色" clearable>
            <el-option label="系统管理员" value="admin" />
            <el-option label="乡镇管理员" value="townAdmin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-select v-model="selectedStatus" placeholder="选择状态" clearable>
            <el-option label="激活" value="active" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-col>
      </el-row>

      <!-- 用户表格 -->
      <el-table :data="filteredUsers" stripe style="width: 100%">
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="150" />
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="负责地区" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '激活' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinedAt" label="加入时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEditUser(row)">编辑</el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" link size="small">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleResetPassword(row)">重置密码</el-dropdown-item>
                  <el-dropdown-item @click="handleToggleStatus(row)">
                    {{ row.status === 'active' ? '禁用' : '启用' }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDeleteUser(row)" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="usersList.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
      />
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model="showAddUser" :title="editingUser?.id ? '编辑用户' : '添加用户'" width="50%">
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" placeholder="输入用户名" :disabled="!!editingUser?.id" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" placeholder="输入邮箱地址" type="email" />
        </el-form-item>

        <el-form-item label="真实姓名">
          <el-input v-model="userForm.realName" placeholder="输入真实姓名" />
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="选择角色">
            <el-option label="系统管理员" value="admin" />
            <el-option label="乡镇管理员" value="townAdmin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>

        <el-form-item label="负责地区">
          <el-select v-model="userForm.region" placeholder="选择地区">
            <el-option label="全省" value="province" />
            <el-option label="A镇" value="town-a" />
            <el-option label="B镇" value="town-b" />
            <el-option label="C镇" value="town-c" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="!editingUser?.id" label="密码">
          <el-input v-model="userForm.password" placeholder="输入初始密码" type="password" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddUser = false">取消</el-button>
          <el-button type="primary" @click="handleSaveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showAddUser = ref(false)
const editingUser = ref(null)

const usersList = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    realName: '管理员',
    role: 'admin',
    region: '全省',
    status: 'active',
    joinedAt: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'townadmin_a',
    email: 'admin_a@example.com',
    realName: '张三',
    role: 'townAdmin',
    region: 'A镇',
    status: 'active',
    joinedAt: '2025-03-15 14:30:00'
  },
  {
    id: 3,
    username: 'user1',
    email: 'user1@example.com',
    realName: '李四',
    role: 'user',
    region: 'A镇',
    status: 'active',
    joinedAt: '2025-05-20 09:15:00'
  },
  {
    id: 4,
    username: 'user2',
    email: 'user2@example.com',
    realName: '王五',
    role: 'user',
    region: 'B镇',
    status: 'disabled',
    joinedAt: '2025-06-10 11:45:00'
  },
  {
    id: 5,
    username: 'townadmin_b',
    email: 'admin_b@example.com',
    realName: '赵六',
    role: 'townAdmin',
    region: 'B镇',
    status: 'active',
    joinedAt: '2025-07-08 16:20:00'
  }
])

const userForm = ref({
  username: '',
  email: '',
  realName: '',
  role: '',
  region: '',
  password: ''
})

const filteredUsers = computed(() => {
  let filtered = usersList.value

  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.username.includes(searchQuery.value) ||
      item.email.includes(searchQuery.value)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(item => item.role === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  return filtered.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
})

const getRoleLabel = (role) => {
  const labels = {
    admin: '系统管理员',
    townAdmin: '乡镇管理员',
    user: '普通用户'
  }
  return labels[role] || role
}

const getRoleType = (role) => {
  const types = {
    admin: 'danger',
    townAdmin: 'warning',
    user: 'info'
  }
  return types[role] || ''
}

const handleEditUser = (row) => {
  editingUser.value = row
  userForm.value = { ...row }
  showAddUser.value = true
}

const handleSaveUser = () => {
  if (!userForm.value.username || !userForm.value.email || !userForm.value.realName) {
    ElMessage.warning('请填写所有必填项')
    return
  }

  if (editingUser.value?.id) {
    // 编辑
    const index = usersList.value.findIndex(item => item.id === editingUser.value.id)
    if (index > -1) {
      usersList.value[index] = { ...usersList.value[index], ...userForm.value }
    }
  } else {
    // 新增
    usersList.value.push({
      ...userForm.value,
      id: Math.max(...usersList.value.map(item => item.id), 0) + 1,
      status: 'active',
      joinedAt: new Date().toLocaleString('zh-CN')
    })
  }

  ElMessage.success(editingUser.value?.id ? '更新成功' : '用户添加成功')
  showAddUser.value = false
  resetForm()
}

const resetForm = () => {
  userForm.value = {
    username: '',
    email: '',
    realName: '',
    role: '',
    region: '',
    password: ''
  }
  editingUser.value = null
}

const handleResetPassword = (row) => {
  ElMessageBox.confirm(`确认重置 ${row.username} 的密码吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('密码已重置为默认值，请提示用户修改')
    })
    .catch(() => {})
}

const handleToggleStatus = (row) => {
  const status = row.status === 'active' ? 'disabled' : 'active'
  const index = usersList.value.findIndex(item => item.id === row.id)
  if (index > -1) {
    usersList.value[index].status = status
  }
  ElMessage.success('更新成功')
}

const handleDeleteUser = (row) => {
  ElMessageBox.confirm(`确认删除用户 ${row.username} 吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'danger'
  })
    .then(() => {
      const index = usersList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        usersList.value.splice(index, 1)
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<style scoped>
.users-management {
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

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
