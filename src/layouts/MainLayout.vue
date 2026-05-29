<template>
  <div class="layout" :class="{ collapsed: appStore.sidebarCollapsed, 'mobile-layout': appStore.isMobile }">
    <!-- 移动端遮罩层 -->
    <div 
      v-if="appStore.isMobile && appStore.mobileSidebarVisible" 
      class="sidebar-overlay"
      @click="appStore.closeMobileSidebar"
    />
    <AppSidebar />
    <div class="layout-main">
      <AppHeader />
      <AppTabs />
      <div class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useTabsStore } from '@/stores/tabsStore'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppTabs from '@/components/AppTabs.vue'

const route = useRoute()
const appStore = useAppStore()
const tabsStore = useTabsStore()

// 路由变化时关闭移动端侧边栏
watch(
  () => route.path,
  () => {
    if (route.name) {
      tabsStore.addTab(route)
    }
    if (appStore.isMobile) {
      appStore.closeMobileSidebar()
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100vh;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 19;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.3s;
}

.layout-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: var(--bg-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .layout-content {
    padding: 12px;
  }
}

/* 平板适配 */
@media (min-width: 768px) and (max-width: 1023px) {
  .layout-content {
    padding: 14px;
  }
}
</style>
