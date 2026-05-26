<template>
  <header class="app-header h-[--header-height] px-4 flex-between bg-[--header-bg] border-b border-[--border-color] transition-all duration-300">
    <div class="flex items-center gap-4">
      <div 
        class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
        @click="appStore.toggleSidebar"
      >
        <el-icon :size="20" class="text-[--text-color]">
          <Fold v-if="!appStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>
      <AppBreadcrumb />
    </div>
    
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3 mr-2">
        <el-tooltip content="全屏" placement="bottom">
          <div class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors" @click="toggleFullscreen">
            <el-icon :size="18" class="text-[--text-color]"><FullScreen /></el-icon>
          </div>
        </el-tooltip>
        
        <el-tooltip content="主题设置" placement="bottom">
          <div class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <ThemePicker />
          </div>
        </el-tooltip>
      </div>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity">
          <el-avatar 
            :size="32" 
            :src="authStore.userInfo?.avatar"
            class="bg-primary/10 text-primary border border-primary/20"
          >
            <template #icon><UserFilled /></template>
          </el-avatar>
          <div class="hidden sm:flex flex-col items-start leading-tight">
            <span class="text-sm font-bold text-[--text-color]">{{ authStore.userInfo?.nickname || authStore.userInfo?.username }}</span>
            <span class="text-[10px] text-gray-400 uppercase tracking-wider">{{ authStore.userInfo?.roles?.[0]?.name || 'User' }}</span>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="w-40">
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided class="text-red-500!">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Fold, Expand, FullScreen, UserFilled, User, SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import AppBreadcrumb from './AppBreadcrumb.vue'
import ThemePicker from './ThemePicker.vue'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function handleCommand(command: string) {
  if (command === 'logout') {
    ElMessageBox.confirm('确认退出登录？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      authStore.logout()
      router.push('/login')
    }).catch(() => {})
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped lang="scss">
.app-header {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}
</style>
