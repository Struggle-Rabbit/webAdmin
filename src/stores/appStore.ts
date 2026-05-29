import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useResponsive } from '@/composables/useResponsive'

export const useAppStore = defineStore('app', () => {
  const { windowWidth, isMobile, isTablet, isDesktop, isSmallScreen, breakpoints } = useResponsive()
  
  const sidebarCollapsed = ref(false)
  const mobileSidebarVisible = ref(false)
  const deviceType = ref<'mobile' | 'tablet' | 'desktop'>('desktop')

  // 根据屏幕尺寸自动调整侧边栏状态
  watch(windowWidth, (width) => {
    if (width < breakpoints.mobile) {
      // 移动端：隐藏侧边栏，但不使用collapse模式（保留文字）
      deviceType.value = 'mobile'
      sidebarCollapsed.value = false  // 移动端不collapse，显示文字
      mobileSidebarVisible.value = false
    } else if (width < breakpoints.tablet) {
      // 平板：自动收起侧边栏
      deviceType.value = 'tablet'
      sidebarCollapsed.value = true
      mobileSidebarVisible.value = false
    } else {
      // 桌面端：显示侧边栏
      deviceType.value = 'desktop'
      mobileSidebarVisible.value = false
      // 只在从移动端切换到桌面端时才展开侧边栏
      if (width >= breakpoints.tablet) {
        sidebarCollapsed.value = false
      }
    }
  }, { immediate: true })

  function toggleSidebar() {
    if (deviceType.value === 'mobile') {
      // 移动端：切换抽屉式侧边栏
      mobileSidebarVisible.value = !mobileSidebarVisible.value
    } else {
      // 桌面端/平板：切换收起状态
      sidebarCollapsed.value = !sidebarCollapsed.value
    }
  }

  function closeMobileSidebar() {
    mobileSidebarVisible.value = false
  }

  return {
    sidebarCollapsed,
    mobileSidebarVisible,
    deviceType,
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    breakpoints,
    toggleSidebar,
    closeMobileSidebar,
  }
})
