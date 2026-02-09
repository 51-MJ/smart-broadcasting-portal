<template>
  <div class="app-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="260px" class="sidebar">
        <div class="sidebar-header">
          <div class="logo">🌐 智慧广电</div>
          <div class="subtitle">后台管理系统</div>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          router
          class="el-menu-vertical"
          background-color="#001f3f"
          text-color="#b3c1d1"
          active-text-color="#667eea"
        >
          <el-menu-item index="/dashboard">
            <el-icon><component :is="'DataAnalysis'" /></el-icon>
            <span>仪表板</span>
          </el-menu-item>
          
          <el-menu-item index="/content">
            <el-icon><component :is="'DocumentCopy'" /></el-icon>
            <span>内容管理</span>
          </el-menu-item>
          
          <el-menu-item index="/users">
            <el-icon><component :is="'User'" /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          
          <el-menu-item index="/permissions">
            <el-icon><component :is="'Setting'" /></el-icon>
            <span>权限管理</span>
          </el-menu-item>
          
          <el-divider />
          
          <el-menu-item index="/settings">
            <el-icon><component :is="'Tools'" /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container class="main-container">
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-left">
            <h2>{{ pageTitle }}</h2>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click">
              <span class="user-menu">
                👤 <span>{{ userName }}</span>
                <el-icon class="el-icon--right">
                  <component :is="'ArrowDown'" />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>账户设置</el-dropdown-item>
                  <el-divider style="margin: 5px 0;" />
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容 -->
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </el-main>

        <!-- 底部 -->
        <el-footer class="footer">
          <span>© 2026 智慧广电. 保留所有权利。</span>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from './store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userName = ref('Admin')
const activeMenu = ref('/dashboard')

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '仪表板',
    '/content': '内容管理',
    '/users': '用户管理',
    '/permissions': '权限管理',
    '/settings': '系统设置'
  }
  return titles[route.path] || '仪表板'
})

watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  background: linear-gradient(180deg, #0a1628 0%, #001f3f 100%) !important;
  border-right: 1px solid rgba(102, 126, 234, 0.2);
  overflow-y: auto;
}

.sidebar-header {
  padding: 30px 20px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(165, 180, 252, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.el-menu-vertical {
  border-right: none !important;
}

.el-menu-vertical :deep(.el-menu-item) {
  padding-left: 20px !important;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.el-menu-vertical :deep(.el-menu-item:hover) {
  background-color: rgba(102, 126, 234, 0.1) !important;
  border-left-color: #667eea;
}

.el-menu-vertical :deep(.is-active) {
  background-color: rgba(102, 126, 234, 0.2) !important;
  border-left-color: #667eea;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 30px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-left h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  color: #333;
  font-size: 14px;
}

.user-menu:hover {
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.footer {
  background: white;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 15px 0 !important;
}
</style>
