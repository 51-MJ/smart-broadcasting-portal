<template>
  <div class="content-management">
    <!-- 操作栏 -->
    <el-card class="operation-card mb-20">
      <template #header>
        <div class="card-header">
          <span>内容列表</span>
          <el-button type="primary" @click="showAddDialog = true">
            ➕ 发布新内容
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <el-row :gutter="20" class="mb-20">
        <el-col :xs="24" :sm="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索内容标题..."
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-select v-model="selectedCategory" placeholder="选择分类" clearable>
            <el-option label="资讯" value="news" />
            <el-option label="公告" value="notice" />
            <el-option label="教育" value="education" />
            <el-option label="党建" value="party" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-select v-model="selectedStatus" placeholder="选择状态" clearable>
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已下线" value="offline" />
          </el-select>
        </el-col>
      </el-row>

      <!-- 内容表格 -->
      <el-table :data="filteredContent" stripe style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCategoryLabel(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="views" label="浏览次数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishedAt" label="发布时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="contentList.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
      />
    </el-card>

    <!-- 发布/编辑对话框 -->
    <el-dialog v-model="showAddDialog" title="发布新内容" width="60%">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="formData.title" placeholder="输入内容标题" />
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="formData.category" placeholder="选择分类">
            <el-option label="资讯" value="news" />
            <el-option label="公告" value="notice" />
            <el-option label="教育" value="education" />
            <el-option label="党建" value="party" />
          </el-select>
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            v-model="formData.content"
            type="textarea"
            rows="6"
            placeholder="输入内容主体"
          />
        </el-form-item>

        <el-form-item label="目标地区">
          <el-select v-model="formData.region" placeholder="选择目标地区">
            <el-option label="全省" value="province" />
            <el-option label="A镇" value="town-a" />
            <el-option label="B镇" value="town-b" />
            <el-option label="C镇" value="town-c" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSave">发布</el-button>
          <el-button @click="handleSaveDraft">保存为草稿</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showAddDialog = ref(false)

const contentList = ref([
  {
    id: 1,
    title: '关于2026年春节放假通知',
    category: 'notice',
    author: '张三',
    views: 1240,
    status: 'published',
    publishedAt: '2026-01-28 10:30:00'
  },
  {
    id: 2,
    title: '乡村振兴示范点考察总结',
    category: 'news',
    author: '李四',
    views: 856,
    status: 'published',
    publishedAt: '2026-01-27 14:15:00'
  },
  {
    id: 3,
    title: '教育系统2026年工作计划',
    category: 'education',
    author: '王五',
    views: 645,
    status: 'draft',
    publishedAt: '2026-01-26 09:45:00'
  },
  {
    id: 4,
    title: '党风廉政建设专项检查',
    category: 'party',
    author: '赵六',
    views: 432,
    status: 'published',
    publishedAt: '2026-01-25 16:20:00'
  },
  {
    id: 5,
    title: '新增教学设备采购公示',
    category: 'education',
    author: '孙七',
    views: 321,
    status: 'published',
    publishedAt: '2026-01-24 11:00:00'
  }
])

const formData = ref({
  title: '',
  category: '',
  content: '',
  region: ''
})

const filteredContent = computed(() => {
  let filtered = contentList.value

  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.title.includes(searchQuery.value)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(item =>
      item.category === selectedCategory.value
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(item =>
      item.status === selectedStatus.value
    )
  }

  return filtered.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
})

const getCategoryLabel = (category) => {
  const labels = {
    news: '资讯',
    notice: '公告',
    education: '教育',
    party: '党建'
  }
  return labels[category] || category
}

const getStatusLabel = (status) => {
  const labels = {
    published: '已发布',
    draft: '草稿',
    offline: '已下线'
  }
  return labels[status] || status
}

const getStatusType = (status) => {
  const types = {
    published: 'success',
    draft: 'info',
    offline: 'danger'
  }
  return types[status] || ''
}

const handleEdit = (row) => {
  formData.value = { ...row }
  showAddDialog.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除"${row.title}"吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = contentList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        contentList.value.splice(index, 1)
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const handleSave = () => {
  if (!formData.value.title || !formData.value.category || !formData.value.content) {
    ElMessage.warning('请填写所有必填项')
    return
  }

  if (formData.value.id) {
    // 编辑
    const index = contentList.value.findIndex(item => item.id === formData.value.id)
    if (index > -1) {
      contentList.value[index] = { ...formData.value, status: 'published', publishedAt: new Date().toLocaleString('zh-CN') }
    }
  } else {
    // 新增
    contentList.value.unshift({
      ...formData.value,
      id: Math.max(...contentList.value.map(item => item.id)) + 1,
      author: '张三',
      views: 0,
      status: 'published',
      publishedAt: new Date().toLocaleString('zh-CN')
    })
  }

  ElMessage.success('发布成功')
  showAddDialog.value = false
  resetForm()
}

const handleSaveDraft = () => {
  ElMessage.success('已保存为草稿')
  showAddDialog.value = false
}

const resetForm = () => {
  formData.value = {
    title: '',
    category: '',
    content: '',
    region: ''
  }
}
</script>

<style scoped>
.content-management {
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
