<template>
  <div class="settings-page">
    <el-row :gutter="20">
      <!-- 左侧菜单 -->
      <el-col :xs="24" :md="6">
        <el-card class="settings-menu">
          <div class="menu-title">系统设置</div>
          <ul class="menu-list">
            <li
              v-for="item in menuItems"
              :key="item.id"
              :class="{ active: activeTab === item.id }"
              @click="activeTab = item.id"
            >
              {{ item.label }}
            </li>
          </ul>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :md="18">
        <!-- 基本设置 -->
        <el-card v-if="activeTab === 'basic'" class="settings-card mb-20">
          <template #header>
            <span>基本设置</span>
          </template>

          <el-form :model="basicSettings" label-width="150px">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" placeholder="输入系统名称" />
            </el-form-item>

            <el-form-item label="系统描述">
              <el-input v-model="basicSettings.description" type="textarea" placeholder="输入系统描述" />
            </el-form-item>

            <el-form-item label="系统URL">
              <el-input v-model="basicSettings.siteUrl" placeholder="输入系统URL" />
            </el-form-item>

            <el-form-item label="维护模式">
              <el-switch v-model="basicSettings.maintenanceMode" />
              <span style="margin-left: 10px; color: #999;">启用后，只有管理员能访问系统</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSave">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 邮件设置 -->
        <el-card v-if="activeTab === 'email'" class="settings-card mb-20">
          <template #header>
            <span>邮件设置</span>
          </template>

          <el-form :model="emailSettings" label-width="150px">
            <el-form-item label="SMTP服务器">
              <el-input v-model="emailSettings.smtpServer" placeholder="例如: smtp.gmail.com" />
            </el-form-item>

            <el-form-item label="SMTP端口">
              <el-input-number v-model="emailSettings.smtpPort" :min="1" :max="65535" />
            </el-form-item>

            <el-form-item label="发件人邮箱">
              <el-input v-model="emailSettings.fromEmail" placeholder="输入发件人邮箱" type="email" />
            </el-form-item>

            <el-form-item label="发件人密码">
              <el-input v-model="emailSettings.fromPassword" placeholder="输入密码或授权码" type="password" show-password />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSendTest">发送测试邮件</el-button>
              <el-button @click="handleSave">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 备份设置 -->
        <el-card v-if="activeTab === 'backup'" class="settings-card mb-20">
          <template #header>
            <span>数据备份</span>
          </template>

          <el-form label-width="150px">
            <el-form-item label="备份频率">
              <el-select v-model="backupSettings.frequency" placeholder="选择备份频率">
                <el-option label="每天" value="daily" />
                <el-option label="每周" value="weekly" />
                <el-option label="每月" value="monthly" />
              </el-select>
            </el-form-item>

            <el-form-item label="保留备份数">
              <el-input-number v-model="backupSettings.keepCount" :min="1" :max="100" />
            </el-form-item>

            <el-form-item>
              <div class="backup-history">
                <h4 style="margin-bottom: 12px;">最近备份记录</h4>
                <el-timeline>
                  <el-timeline-item
                    v-for="backup in backupHistory"
                    :key="backup.id"
                    :timestamp="backup.timestamp"
                    placement="top"
                  >
                    <p>
                      <strong>{{ backup.name }}</strong>
                      <span style="margin-left: 20px; color: #999;">{{ backup.size }}</span>
                    </p>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleBackupNow">立即备份</el-button>
              <el-button @click="handleSave">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 安全设置 -->
        <el-card v-if="activeTab === 'security'" class="settings-card mb-20">
          <template #header>
            <span>安全设置</span>
          </template>

          <el-form :model="securitySettings" label-width="150px">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securitySettings.passwordMinLength" :min="6" :max="32" />
            </el-form-item>

            <el-form-item label="密码过期天数">
              <el-input-number v-model="securitySettings.passwordExpireDays" :min="0" />
              <span style="margin-left: 10px; color: #999;">0表示不过期</span>
            </el-form-item>

            <el-form-item label="登录失败尝试次数">
              <el-input-number v-model="securitySettings.loginAttempts" :min="1" :max="10" />
            </el-form-item>

            <el-form-item label="启用两因素认证">
              <el-switch v-model="securitySettings.twoFactor" />
            </el-form-item>

            <el-form-item label="IP白名单">
              <el-input
                v-model="securitySettings.ipWhitelist"
                type="textarea"
                rows="4"
                placeholder="输入IP地址，每行一个"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSave">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 日志设置 -->
        <el-card v-if="activeTab === 'logs'" class="settings-card mb-20">
          <template #header>
            <span>日志管理</span>
          </template>

          <el-form label-width="150px">
            <el-form-item label="操作日志">
              <el-switch v-model="logSettings.operationLog" />
              <span style="margin-left: 10px;">记录所有用户操作</span>
            </el-form-item>

            <el-form-item label="登录日志">
              <el-switch v-model="logSettings.loginLog" />
              <span style="margin-left: 10px;">记录用户登录信息</span>
            </el-form-item>

            <el-form-item label="日志保留天数">
              <el-input-number v-model="logSettings.retentionDays" :min="1" :max="365" />
            </el-form-item>

            <el-form-item>
              <el-button @click="handleClearLogs">清空日志</el-button>
              <el-button @click="handleExportLogs">导出日志</el-button>
              <el-button type="primary" @click="handleSave">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('basic')

const menuItems = ref([
  { id: 'basic', label: '📋 基本设置' },
  { id: 'email', label: '📧 邮件配置' },
  { id: 'backup', label: '💾 数据备份' },
  { id: 'security', label: '🔒 安全设置' },
  { id: 'logs', label: '📝 日志管理' }
])

const basicSettings = ref({
  systemName: '智慧广电后台管理系统',
  description: '广播电视融合传播平台',
  siteUrl: 'https://example.com',
  maintenanceMode: false
})

const emailSettings = ref({
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  fromEmail: 'noreply@example.com',
  fromPassword: ''
})

const backupSettings = ref({
  frequency: 'daily',
  keepCount: 7
})

const backupHistory = ref([
  {
    id: 1,
    name: '备份_2026-01-30',
    timestamp: '2026-01-30 02:00:00',
    size: '245.3 MB'
  },
  {
    id: 2,
    name: '备份_2026-01-29',
    timestamp: '2026-01-29 02:00:00',
    size: '243.8 MB'
  },
  {
    id: 3,
    name: '备份_2026-01-28',
    timestamp: '2026-01-28 02:00:00',
    size: '241.5 MB'
  }
])

const securitySettings = ref({
  passwordMinLength: 8,
  passwordExpireDays: 90,
  loginAttempts: 5,
  twoFactor: false,
  ipWhitelist: ''
})

const logSettings = ref({
  operationLog: true,
  loginLog: true,
  retentionDays: 30
})

const handleSave = () => {
  ElMessage.success('设置保存成功')
}

const handleSendTest = () => {
  ElMessage.info('测试邮件已发送，请检查收件箱')
}

const handleBackupNow = () => {
  ElMessage.loading('正在备份数据...')
  setTimeout(() => {
    backupHistory.value.unshift({
      id: Math.max(...backupHistory.value.map(item => item.id), 0) + 1,
      name: `备份_${new Date().toISOString().split('T')[0]}`,
      timestamp: new Date().toLocaleString('zh-CN'),
      size: '248.2 MB'
    })
    ElMessage.success('备份完成')
  }, 2000)
}

const handleClearLogs = () => {
  ElMessageBox.confirm('确认清空所有日志吗? 此操作不可恢复', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('日志已清空')
    })
    .catch(() => {})
}

const handleExportLogs = () => {
  ElMessage.success('日志已导出到 logs.csv')
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
}

.mb-20 {
  margin-bottom: 20px;
}

.settings-menu {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.menu-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 0 12px;
  color: #333;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 12px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  color: #666;
}

.menu-list li:hover {
  background-color: #f5f7fa;
  border-left-color: #667eea;
  color: #333;
}

.menu-list li.active {
  background-color: #f0f2f5;
  border-left-color: #667eea;
  color: #667eea;
  font-weight: 600;
}

.settings-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.backup-history {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}
</style>
