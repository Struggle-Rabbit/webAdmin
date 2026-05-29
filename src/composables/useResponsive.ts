import { ref, onMounted, onUnmounted, computed } from 'vue'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useResponsive() {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)

  // 断点定义
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  }

  // 计算设备类型
  const deviceType = computed<DeviceType>(() => {
    if (windowWidth.value < breakpoints.mobile) {
      return 'mobile'
    } else if (windowWidth.value < breakpoints.tablet) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  })

  // 是否为移动设备
  const isMobile = computed(() => deviceType.value === 'mobile')
  // 是否为平板
  const isTablet = computed(() => deviceType.value === 'tablet')
  // 是否为桌面
  const isDesktop = computed(() => deviceType.value === 'desktop')
  // 是否为小屏幕（移动或平板）
  const isSmallScreen = computed(() => windowWidth.value < breakpoints.tablet)

  // 更新窗口尺寸
  function updateSize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  // 防抖函数
  function debounce(fn: Function, delay: number) {
    let timer: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), delay)
    }
  }

  const debouncedUpdate = debounce(updateSize, 100)

  onMounted(() => {
    window.addEventListener('resize', debouncedUpdate)
    updateSize()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', debouncedUpdate)
  })

  return {
    windowWidth,
    windowHeight,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    breakpoints,
  }
}