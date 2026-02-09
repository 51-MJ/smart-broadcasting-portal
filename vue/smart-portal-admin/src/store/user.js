import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    name: '管理员',
    role: 'admin',
    email: 'admin@example.com',
    avatar: '👤'
  })

  const isLoggedIn = ref(false)

  const login = (username, password) => {
    // 模拟登录
    if (username && password) {
      isLoggedIn.value = true
      user.value.name = username
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const logout = () => {
    isLoggedIn.value = false
    localStorage.removeItem('user')
  }

  return {
    user,
    isLoggedIn,
    login,
    logout
  }
})
