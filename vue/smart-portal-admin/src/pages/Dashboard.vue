<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users-icon">👥</div>
            <div class="stat-info">
              <div class="stat-label">用户总数</div>
              <div class="stat-value">{{ stats.users }}</div>
              <div class="stat-change">↑ 15.2% 本月</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon content-icon">📄</div>
            <div class="stat-info">
              <div class="stat-label">内容总数</div>
              <div class="stat-value">{{ stats.content }}</div>
              <div class="stat-change">↑ 8.3% 本月</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon views-icon">📊</div>
            <div class="stat-info">
              <div class="stat-label">总浏览量</div>
              <div class="stat-value">{{ stats.views }}</div>
              <div class="stat-change">↑ 24.5% 本月</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon activity-icon">🔥</div>
            <div class="stat-info">
              <div class="stat-label">日活跃用户</div>
              <div class="stat-value">{{ stats.active }}</div>
              <div class="stat-change">↑ 12.1% 本月</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-select v-model="timeRange" placeholder="选择时间范围" size="small" style="width: 150px">
                <el-option label="最近7天" value="7days" />
                <el-option label="最近30天" value="30days" />
                <el-option label="最近90天" value="90days" />
              </el-select>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-text">
              📈 用户增长趋势图
              <div style="font-size: 12px; color: #999; margin-top: 8px;">
                需要集成 ECharts 库来展示真实图表
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>内容分类分布</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-text">
              🥧 内容分类分布图
              <div style="font-size: 12px; color: #999; margin-top: 8px;">
                需要集成 ECharts 库来展示真实图表
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-card class="activity-card">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="recentActivity" style="width: 100%">
            <el-table-column prop="type" label="操作类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getActivityType(row.type)">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="200" />
            <el-table-column prop="user" label="操作用户" width="100" />
            <el-table-column prop="timestamp" label="时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  users: 12840,
  content: 568,
  views: 128456,
  active: 3245
})

const timeRange = ref('7days')

const recentActivity = ref([
  {
    type: '新增内容',
    description: '发布了新的广电资讯文章',
    user: '张三',
    timestamp: '2026-01-30 14:30:45'
  },
  {
    type: '用户注册',
    description: '新用户注册成功',
    user: '系统',
    timestamp: '2026-01-30 13:45:22'
  },
  {
    type: '权限更新',
    description: '更新了乡镇管理员权限',
    user: '李四',
    timestamp: '2026-01-30 12:20:15'
  },
  {
    type: '内容删除',
    description: '删除了过期的通知内容',
    user: '王五',
    timestamp: '2026-01-30 11:15:30'
  },
  {
    type: '系统维护',
    description: '完成了系统日常备份',
    user: '系统',
    timestamp: '2026-01-30 10:00:00'
  }
])

const getActivityType = (type) => {
  const typeMap = {
    '新增内容': 'success',
    '用户注册': 'info',
    '权限更新': 'warning',
    '内容删除': 'danger',
    '系统维护': ''
  }
  return typeMap[type] || ''
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}

.mb-20 {
  margin-bottom: 20px;
}

.stat-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.stat-icon {
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
}

.users-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.views-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.activity-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  color: #67c23a;
}

.chart-card,
.activity-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #f9f9f9;
  border-radius: 8px;
}

.chart-text {
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
