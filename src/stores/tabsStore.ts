import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TabItem {
  title: string
  name: string
  path: string
  closable: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([
    { title: '仪表盘', name: 'Dashboard', path: '/dashboard', closable: false },
  ])
  const activeTab = ref('Dashboard')

  const tabList = computed(() => tabs.value)

  function addTab(route: RouteLocationNormalized) {
    const name = route.name as string
    const exists = tabs.value.some((t) => t.name === name)
    if (exists) {
      activeTab.value = name
      return
    }
    tabs.value.push({
      title: (route.meta?.title as string) || name,
      name,
      path: route.path,
      closable: tabs.value.length > 1,
    })
    activeTab.value = name
  }

  function closeTab(name: string) {
    tabs.value = tabs.value.filter((t) => t.name !== name)
    if (activeTab.value === name && tabs.value.length > 0) {
      activeTab.value = tabs.value[tabs.value.length - 1].name
    }
  }

  function closeOthers(name: string) {
    tabs.value = tabs.value.filter((t) => t.name === name || !t.closable)
    activeTab.value = name
  }

  function closeAll() {
    tabs.value = tabs.value.filter((t) => !t.closable)
    activeTab.value = tabs.value[0]?.name || 'Dashboard'
  }

  function setActiveTab(name: string) {
    activeTab.value = name
  }

  function refreshTab(name: string) {
    const tab = tabs.value.find((t) => t.name === name)
    if (tab) {
      const path = tab.path
      tabs.value = tabs.value.filter((t) => t.name !== name)
      setTimeout(() => {
        tabs.value.push({ ...tab, path })
      }, 0)
    }
  }

  return {
    tabs,
    activeTab,
    tabList,
    addTab,
    closeTab,
    closeOthers,
    closeAll,
    setActiveTab,
    refreshTab,
  }
})
