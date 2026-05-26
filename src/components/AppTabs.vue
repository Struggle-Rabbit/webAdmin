<template>
  <div class="app-tabs flex items-center h-[--tabs-height] bg-[--header-bg] px-3 border-b border-[--border-color] select-none">
    <div class="flex-1 flex items-center overflow-x-auto no-scrollbar gap-1.5" ref="scrollRef">
      <div
        v-for="tab in tabsStore.tabList"
        :key="tab.name"
        class="tab-item group flex items-center gap-1.5 px-3 py-1 rounded-md cursor-pointer transition-all duration-200 border border-transparent"
        :class="[
          tabsStore.activeTab === tab.name 
            ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' 
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
        @click="handleTabClick(tab.name)"
        @contextmenu.prevent="showContextMenu($event, tab.name)"
      >
        <span class="text-xs font-medium whitespace-nowrap">{{ tab.title }}</span>
        <el-icon 
          v-if="tab.closable" 
          class="tab-close rounded-full p-0.5 opacity-60 hover:opacity-100 hover:bg-white/20 transition-all" 
          :size="12" 
          @click.stop="tabsStore.closeTab(tab.name)"
        >
          <Close />
        </el-icon>
      </div>
    </div>

    <el-dropdown trigger="click" @command="handleContextCommand">
      <div class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ml-2">
        <el-icon class="text-gray-400"><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOthers">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div
      v-if="contextMenu.visible"
      class="fixed z-50 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg py-1 w-32"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
    >
      <div class="px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2" @click="tabsStore.closeOthers(contextMenu.tabName!)">
        <el-icon><Remove /></el-icon>关闭其他
      </div>
      <div class="px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-red-500" @click="tabsStore.closeAll()">
        <el-icon><CircleClose /></el-icon>关闭全部
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Close, ArrowDown, Remove, CircleClose } from '@element-plus/icons-vue'
import { useTabsStore } from '@/stores/tabsStore'

const router = useRouter()
const tabsStore = useTabsStore()
const scrollRef = ref<HTMLElement>()

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  tabName: null as string | null,
})

function handleTabClick(name: string) {
  tabsStore.setActiveTab(name)
  const tab = tabsStore.tabList.find((t) => t.name === name)
  if (tab) router.push(tab.path)
}

function showContextMenu(e: MouseEvent, name: string) {
  contextMenu.visible = true
  contextMenu.x = e.clientX
  contextMenu.y = e.clientY
  contextMenu.tabName = name
}

function handleContextCommand(command: string) {
  if (command === 'closeOthers') tabsStore.closeOthers(tabsStore.activeTab)
  else if (command === 'closeAll') tabsStore.closeAll()
}

const hideContextMenu = () => {
  contextMenu.visible = false
}

onMounted(() => {
  document.addEventListener('click', hideContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})
</script>

<style scoped lang="scss">
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  &.active {
    .tab-close {
      opacity: 1;
    }
  }
}
</style>
