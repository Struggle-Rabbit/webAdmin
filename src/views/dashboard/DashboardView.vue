<template>
  <div class="dashboard p-4 sm:p-6 space-y-6">
    <!-- Stat Cards -->
    <el-row :gutter="16">
      <el-col v-for="card in statCards" :key="card.label" :xs="12" :sm="12" :md="6" class="mb-4 sm:mb-4">
        <el-card shadow="never" class="border-none rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs sm:text-sm text-gray-400 font-medium">{{ card.label }}</p>
              <p class="text-xl sm:text-2xl font-bold text-[--text-color]">
                {{ loading ? '...' : card.value.toLocaleString() }}
              </p>
            </div>
            <div 
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-center transition-colors"
              :style="{ backgroundColor: card.color + '15', color: card.color }"
            >
              <el-icon :size="20" class="sm:text-xl">
                <component :is="card.icon" />
              </el-icon>
            </div>
          </div>
          <div class="mt-3 sm:mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-500">
            <el-icon><CaretTop /></el-icon>
            <span>+12% from last month</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts Section -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :md="16" class="mb-4 sm:mb-4">
        <el-card shadow="never" class="border-none rounded-xl">
          <template #header>
            <div class="flex flex-col sm:flex-between gap-2">
              <span class="font-bold text-lg text-[--text-color]">注册趋势（近7天）</span>
              <el-radio-group v-model="chartRange" size="small">
                <el-radio-button label="7d">7天</el-radio-button>
                <el-radio-button label="30d">30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="h-[250px] sm:h-[350px]">
            <el-skeleton :loading="loading" animated :rows="10">
              <v-chart v-if="lineOption" :option="lineOption" autoresize class="w-full h-full" />
              <el-empty v-else-if="!loading" description="暂无数据" />
            </el-skeleton>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card shadow="never" class="border-none rounded-xl h-full">
          <template #header>
            <span class="font-bold text-lg text-[--text-color]">角色分布</span>
          </template>
          <div class="h-[250px] sm:h-[350px]">
            <el-skeleton :loading="loading" animated :rows="10">
              <v-chart v-if="pieOption" :option="pieOption" autoresize class="w-full h-full" />
              <el-empty v-else-if="!loading" description="暂无数据" />
            </el-skeleton>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Activities -->
    <el-card shadow="never" class="border-none rounded-xl">
      <template #header>
        <div class="flex-between">
          <span class="font-bold text-lg text-[--text-color]">最近活动</span>
          <el-button link type="primary" class="hidden sm:block">查看全部</el-button>
        </div>
      </template>
      <el-skeleton :loading="loading" animated :count="5">
        <div class="space-y-3 sm:space-y-4">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <el-avatar :size="36" class="bg-primary/10 text-primary hidden sm:flex">
              {{ activity.username.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-[--text-color] truncate">
                {{ activity.username }} 
                <span class="font-normal text-gray-400">执行了</span> 
                {{ activity.action }}
              </p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(activity.createTime) }}</p>
            </div>
            <el-tag :type="activity.status === 1 ? 'success' : 'danger'" size="small" round class="flex-shrink-0">
              {{ activity.status === 1 ? '成功' : '失败' }}
            </el-tag>
          </div>
        </div>
        <el-empty v-if="!loading && recentActivities.length === 0" description="暂无活动" />
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { User, Avatar, Menu, Odometer, CaretTop } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { getDashboardStatsApi, getDashboardChartsApi } from '@/api/dashboard'
import { getLogListApi } from '@/api/log'
import type { DashboardStats } from '@/types'

use([CanvasRenderer, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const loading = ref(true)
const chartRange = ref('7d')
const stats = ref<DashboardStats>({ userCount: 0, roleCount: 0, menuCount: 0, activeUserCount: 0 })
const lineData = ref<{ dates: string[]; values: number[] }>({ dates: [], values: [] })
const pieData = ref<{ name: string; value: number }[]>([])
const recentActivities = ref<any[]>([])

const statCards = computed(() => [
  { label: '用户总数', value: stats.value.userCount, icon: User, color: '#409eff' },
  { label: '角色总数', value: stats.value.roleCount, icon: Avatar, color: '#67c23a' },
  { label: '菜单总数', value: stats.value.menuCount, icon: Menu, color: '#e6a23c' },
  { label: '活跃用户', value: stats.value.activeUserCount, icon: Odometer, color: '#f56c6c' },
])

const lineOption = computed(() => {
  if (lineData.value.dates.length === 0) return undefined
  return {
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: lineData.value.dates, 
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#9ca3af' }
    },
    yAxis: { 
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
      axisLabel: { color: '#9ca3af' }
    },
    series: [{ 
      type: 'line', 
      data: lineData.value.values, 
      smooth: true, 
      showSymbol: false,
      lineStyle: { width: 3, color: '#409eff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0)' }
          ]
        }
      }
    }],
    tooltip: { trigger: 'axis' },
  }
})

const pieOption = computed(() => {
  if (pieData.value.length === 0) return undefined
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: '0', icon: 'circle' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: pieData.value
    }]
  }
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function fetchData() {
  loading.value = true
  try {
    const [statsRes, chartsRes, logsRes] = await Promise.all([
      getDashboardStatsApi(),
      getDashboardChartsApi(),
      getLogListApi({ page: 1, pageSize: 5 })
    ])
    stats.value = statsRes
    lineData.value = {
      dates: chartsRes.registrationTrend.map((i: any) => i.date),
      values: chartsRes.registrationTrend.map((i: any) => i.count),
    }
    pieData.value = chartsRes.roleDistribution
    recentActivities.value = logsRes.list
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.dashboard {
  background-color: var(--bg-color);
  min-height: 100%;
}

:deep(.el-card) {
  background-color: var(--header-bg);
  color: var(--text-color);
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--border-color);
  padding: 16px 20px;
}
</style>
