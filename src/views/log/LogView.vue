<template>
  <div class="log-view">
    <el-card class="search-card">
      <el-form :model="query" inline>
        <el-form-item label="类型">
          <el-select v-model="query.type" placeholder="全部" clearable style="width: 120px" @change="handleSearch">
            <el-option label="操作日志" value="operation" />
            <el-option label="登录日志" value="login" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="用户名/操作" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-toolbar">
        <div />
        <div>
          <el-button v-permission="'log:export'" type="warning" @click="handleExport">导出日志</el-button>
        </div>
      </div>
      <el-table v-loading="loading" :data="logList" stripe border @row-click="handleRowClick">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'login' ? 'info' : 'primary'" size="small">{{ row.type === 'login' ? '登录' : '操作' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="target" label="目标" />
        <el-table-column prop="ip" label="IP" />
        <el-table-column label="状态" width="70">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="170">
          <template #default="{ row }">{{ row.createTime?.slice(0, 16) }}</template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @change="fetchData"
        />
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" title="日志详情" size="400px">
      <template v-if="detailData">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ detailData.type === 'login' ? '登录日志' : '操作日志' }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ detailData.username }}</el-descriptions-item>
          <el-descriptions-item label="操作">{{ detailData.action }}</el-descriptions-item>
          <el-descriptions-item label="目标">{{ detailData.target }}</el-descriptions-item>
          <el-descriptions-item label="IP">{{ detailData.ip }}</el-descriptions-item>
          <el-descriptions-item label="User-Agent">{{ detailData.userAgent }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ detailData.status === 1 ? '成功' : '失败' }}</el-descriptions-item>
          <el-descriptions-item label="详情">{{ detailData.detail }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ detailData.createTime }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLogListApi, getLogDetailApi, exportLogsApi } from '@/api/log'
import type { LogInfo } from '@/types'

const loading = ref(false)
const logList = ref<LogInfo[]>([])
const total = ref(0)
const detailVisible = ref(false)
const detailData = ref<LogInfo | null>(null)
const dateRange = ref<[string, string] | null>(null)

const query = reactive({
  page: 1,
  pageSize: 10,
  type: '',
  keyword: '',
  startTime: '',
  endTime: '',
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getLogListApi(query)
    logList.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  query.page = 1
  fetchData()
}

function handleReset() {
  query.type = ''
  query.keyword = ''
  query.startTime = ''
  query.endTime = ''
  dateRange.value = null
  query.page = 1
  fetchData()
}

function handleDateChange(val: [string, string] | null) {
  if (val) {
    query.startTime = val[0]
    query.endTime = val[1]
  } else {
    query.startTime = ''
    query.endTime = ''
  }
  handleSearch()
}

async function handleRowClick(row: LogInfo) {
  try {
    const res = await getLogDetailApi(row.id)
    detailData.value = res
    detailVisible.value = true
  } catch {
    // handled
  }
}

async function handleExport() {
  try {
    const blob = await exportLogsApi({ type: query.type || undefined })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch {
    // handled
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.search-card {
  margin-bottom: 16px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
