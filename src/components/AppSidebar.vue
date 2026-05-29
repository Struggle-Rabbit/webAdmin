<template>
  <div 
    class="sidebar h-screen bg-[#001529] text-white transition-all duration-300 overflow-hidden flex flex-col shadow-xl z-20" 
    :class="{
      'sidebar-mobile': appStore.isMobile,
      'sidebar-visible': appStore.isMobile && appStore.mobileSidebarVisible,
      'sidebar-collapsed': appStore.sidebarCollapsed && !appStore.isMobile
    }"
    :style="{ width: appStore.isMobile ? '240px' : (appStore.sidebarCollapsed ? '64px' : '240px') }"
  >
    <!-- Logo 区域 -->
    <div class="sidebar-logo h-[--header-height] flex items-center border-b border-white/5 overflow-hidden" :class="appStore.sidebarCollapsed ? 'justify-center' : 'px-5'">
      <div class="flex items-center" :class="appStore.sidebarCollapsed ? '' : 'gap-3'">
        <div class="w-8 h-8 rounded-lg bg-primary flex-center shadow-lg shadow-primary/20 flex-shrink-0">
          <span class="text-xl font-black italic">A</span>
        </div>
        <span 
          class="logo-text text-lg font-bold tracking-wider transition-opacity duration-300 whitespace-nowrap" 
          v-show="!appStore.sidebarCollapsed"
        >
          OPEN ADMIN
        </span>
      </div>
    </div>
    
    <!-- 菜单区域 -->
    <div class="flex-1 overflow-y-auto no-scrollbar py-2">
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        background-color="transparent"
        text-color="rgba(255,255,255,0.7)"
        active-text-color="#ffffff"
        router
        class="border-none!"
      >
        <template v-for="item in menuItems" :key="item.path">
          <!-- 无子菜单 -->
          <el-menu-item 
            v-if="!item.children?.length" 
            :index="item.path.startsWith('/') ? item.path : '/' + item.path"
          >
            <el-icon v-if="item.meta?.icon" :size="20">
              <component :is="item.meta.icon" />
            </el-icon>
            <template #title>
              <span class="font-medium ml-2">{{ item.meta?.title }}</span>
            </template>
          </el-menu-item>
          
          <!-- 有子菜单 -->
          <el-sub-menu v-else :index="item.path">
            <template #title>
              <el-icon v-if="item.meta?.icon" :size="20">
                <component :is="item.meta.icon" />
              </el-icon>
              <span class="font-medium ml-2">{{ item.meta?.title }}</span>
            </template>
            <el-menu-item 
              v-for="child in item.children" 
              :key="child.path" 
              :index="item.path + '/' + child.path"
              class="sub-item"
            >
              <span class="text-sm opacity-80">{{ child.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
    
    <!-- 底部状态 -->
    <div class="p-4 border-t border-white/5 transition-all duration-300" :class="appStore.sidebarCollapsed && !appStore.isMobile ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'">
      <div class="bg-white/5 rounded-xl p-3 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-green-500/20 flex-center">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-white/40 uppercase font-bold tracking-tighter">System Status</span>
          <span class="text-xs font-bold text-white/90">Operational</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { asyncRoutes } from '@/router/routes'

const route = useRoute()
const appStore = useAppStore()

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) return meta.activeMenu as string
  return path
})

const menuItems = computed(() => {
  const mainRoute = asyncRoutes.find((r) => r.path === '/')
  return mainRoute?.children?.filter(item => !item.meta?.hidden) || []
})
</script>

<style scoped lang="scss">
.sidebar {
  user-select: none;
}

/* 移动端抽屉式侧边栏 */
.sidebar-mobile {
  position: fixed;
  top: 0;
  left: -240px;
  height: 100vh;
  z-index: 20;
  transition: left 0.3s ease;
}

.sidebar-visible {
  left: 0;
}

/* 桌面端收起状态 */
.sidebar-collapsed {
  width: 64px;
}

/* 移动端菜单项样式调整 */
@media (max-width: 767px) {
  :deep(.el-menu) {
    .el-menu-item, .el-sub-menu__title {
      height: 52px !important;
      line-height: 52px !important;
    }
  }
}

:deep(.el-menu) {
  background-color: transparent;
  border-right: none;
  
  // 基础菜单项样式
  .el-menu-item, .el-sub-menu__title {
    height: 48px !important;
    line-height: 48px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05) !important;
      color: #fff !important;
    }
  }

  // 展开时的菜单项样式
  &:not(.el-menu--collapse) {
    .el-menu-item, .el-sub-menu__title {
      margin: 4px 12px !important;
      border-radius: 8px !important;
      padding: 0 16px !important;
      
      &.is-active {
        background-color: var(--el-color-primary) !important;
        color: #fff !important;
        box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
      }
    }
    
    .sub-item {
      padding-left: 52px !important;
    }
  }
  
  // 收起时的菜单项样式
  &.el-menu--collapse {
    width: 64px !important;
    
    .el-menu-item, .el-sub-menu__title {
      margin: 8px auto !important;
      border-radius: 8px !important;
      padding: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      width: 44px !important;
      height: 44px !important;
      min-height: 44px !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      text-align: center !important;
      line-height: 1 !important;
      position: relative !important;

      &::before {
        display: none !important;
      }

      // 覆盖 Element Plus 内部包装元素的样式
      .el-menu-tooltip__trigger,
      .el-tooltip__trigger {
        padding: 0 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        position: relative !important;
        left: auto !important;
        top: auto !important;
      }

      .el-icon {
        margin: 0 !important;
        padding: 0 !important;
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        flex-shrink: 0 !important;
        vertical-align: middle !important;
        
        svg {
          width: 1em;
          height: 1em;
        }
      }

      // 隐藏收起时的文字和箭头
      span, .el-sub-menu__icon-arrow {
        display: none !important;
      }
      
      &.is-active {
        background-color: var(--el-color-primary) !important;
        color: #fff !important;
        box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
      }
    }
  }
}

.no-scrollbar {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
