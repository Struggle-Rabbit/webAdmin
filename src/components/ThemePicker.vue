<template>
  <el-dropdown trigger="click">
    <el-icon class="header-icon" :size="18">
      <Brush />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="theme in themes" :key="theme.key" @click="setTheme(theme.key)">
          <div class="flex items-center gap-2">
            <div 
              class="w-4 h-4 rounded-full" 
              :style="{ backgroundColor: theme.color }"
              :class="{ 'ring-2 ring-primary ring-offset-1': themeColor === theme.key }"
            ></div>
            <span>{{ theme.label }}</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item divided @click="toggleDark()">
          <el-icon><Sunny v-if="!isDark" /><Moon v-else /></el-icon>
          <span class="ml-2">{{ isDark ? '浅色模式' : '深色模式' }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { Brush, Sunny, Moon } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleDark, themeColor, setTheme } = useTheme()

const themes = [
  { key: '#409eff', label: '默认蓝', color: '#409eff' },
  { key: '#67c23a', label: '清新绿', color: '#67c23a' },
  { key: '#e6a23c', label: '活力橙', color: '#e6a23c' },
  { key: '#9b59b6', label: '高贵紫', color: '#9b59b6' },
  { key: '#f56c6c', label: '热情红', color: '#f56c6c' },
  { key: '#009688', label: '青黛色', color: '#009688' },
]
</script>

<style scoped lang="scss">
.header-icon {
  cursor: pointer;
  color: var(--text-color);
  transition: transform 0.3s;
  &:hover {
    transform: rotate(30deg);
  }
}
</style>
