import { ref } from 'vue'

export function useFullscreen() {
  const isFullscreen = ref(!!document.fullscreenElement)

  async function toggle() {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      isFullscreen.value = false
    } else {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    }
  }

  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })

  return {
    isFullscreen,
    toggle,
  }
}
