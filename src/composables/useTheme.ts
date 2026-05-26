import { watch } from 'vue'
import { useDark, useToggle, useStorage } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  })
  const toggleDark = useToggle(isDark)

  const themeColor = useStorage('theme-color', '#409eff')

  const setTheme = (color: string) => {
    themeColor.value = color
    applyTheme(color)
  }

  const applyTheme = (color: string) => {
    const el = document.documentElement
    el.style.setProperty('--el-color-primary', color)
    el.style.setProperty('--primary-color', color)
    
    // Set RGB for UnoCSS opacity support
    const rgb = hexToRgb(color)
    if (rgb) {
      el.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
    }
    
    // Generate light colors for Element Plus
    for (let i = 1; i <= 9; i++) {
      el.style.setProperty(`--el-color-primary-light-${i}`, mixColor('#ffffff', color, i * 0.1))
    }
    el.style.setProperty('--el-color-primary-dark-2', mixColor('#000000', color, 0.2))
  }

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Simple color mixer
  function mixColor(color1: string, color2: string, weight: number) {
    weight = Math.max(Math.min(Number(weight), 1), 0)
    const r1 = parseInt(color1.substring(1, 3), 16)
    const g1 = parseInt(color1.substring(3, 5), 16)
    const b1 = parseInt(color1.substring(5, 7), 16)
    const r2 = parseInt(color2.substring(1, 3), 16)
    const g2 = parseInt(color2.substring(3, 5), 16)
    const b2 = parseInt(color2.substring(5, 7), 16)
    const r = Math.round(r1 * weight + r2 * (1 - weight))
    const g = Math.round(g1 * weight + g2 * (1 - weight))
    const b = Math.round(b1 * weight + b2 * (1 - weight))
    const _r = r.toString(16).padStart(2, '0')
    const _g = g.toString(16).padStart(2, '0')
    const _b = b.toString(16).padStart(2, '0')
    return `#${_r}${_g}${_b}`
  }

  watch(themeColor, (val) => {
    applyTheme(val)
  }, { immediate: true })

  return {
    isDark,
    toggleDark,
    themeColor,
    setTheme,
  }
}
