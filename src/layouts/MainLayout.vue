<template>
  <div class="layout" :class="{ collapsed: appStore.sidebarCollapsed }">
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

watch(
  () => route.path,
  () => {
    if (route.name) {
      tabsStore.addTab(route)
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
</style>
