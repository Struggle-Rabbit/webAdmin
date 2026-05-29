<template>
  <div class="user-list p-4 sm:p-0">
    <el-card class="search-card mb-4">
      <el-form :model="query" :inline="!isMobile" class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        <el-form-item label="关键词" class="w-full sm:w-auto">
          <el-input v-model="query.keyword" placeholder="用户名/昵称" clearable @keyup.enter="handleSearch" class="w-full sm:w-auto" />
        </el-form-item>
        <el-form-item label="状态" class="w-full sm:w-auto">
          <el-select v-model="query.status" placeholder="全部" clearable class="w-full sm:w-[120px]" @change="handleSearch">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" class="w-full sm:w-auto">
          <el-select v-model="query.role" placeholder="全部" clearable class="w-full sm:w-[150px]" @change="handleSearch">
            <el-option v-for="r in roles" :key="r.code" :label="r.name" :value="r.code" />
          </el-select>
        </el-form-item>
        <el-form-item class="w-full sm:w-auto">
          <div class="flex gap-2 w-full sm:w-auto">
            <el-button type="primary" class="flex-1 sm:flex-none" @click="handleSearch">搜索</el-button>
            <el-button class="flex-1 sm:flex-none" @click="handleReset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-toolbar mb-4">
        <div />
        <div>
          <el-button v-permission="'user:create'" type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <el-table v-loading="loading" :data="userList" stripe border class="w-full">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="nickname" label="昵称" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="160" class-name="hidden lg:table-cell" />
          <el-table-column prop="phone" label="手机号" min-width="120" class-name="hidden md:table-cell" />
          <el-table-column label="角色" width="180" class-name="hidden sm:table-cell">
            <template #default="{ row }">
              <el-tag v-for="r in row.roles" :key="r.id" size="small" style="margin-right: 4px">{{ r.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-switch :model-value="row.status === 1" @change="handleToggleStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" class-name="hidden md:table-cell">
            <template #default="{ row }">{{ row.createTime?.slice(0, 16) }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button v-permission="'user:edit'" type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button v-permission="'user:delete'" type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination mt-4">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next'"
          @change="fetchData"
        />
      </div>
    </el-card>

    <UserForm v-model:visible="formVisible" :user="currentUser" @success="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useResponsive } from '@/composables/useResponsive'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserListApi, deleteUserApi, toggleUserStatusApi } from '@/api/user'
import { getRoleListApi } from '@/api/role'
import type { UserInfo, RoleInfo } from '@/types'
import UserForm from './UserForm.vue'

const { isMobile } = useResponsive()

const loading = ref(false)
const userList = ref<UserInfo[]>([])
const total = ref(0)
const formVisible = ref(false)
const currentUser = ref<UserInfo | null>(null)
const roles = ref<RoleInfo[]>([])

const query = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '' as string | number,
  role: '',
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getUserListApi(query)
    userList.value = res.list
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
  query.keyword = ''
  query.status = ''
  query.role = ''
  query.page = 1
  fetchData()
}

function handleAdd() {
  currentUser.value = null
  formVisible.value = true
}

function handleEdit(row: UserInfo) {
  currentUser.value = { ...row }
  formVisible.value = true
}

async function handleDelete(row: UserInfo) {
  try {
    await ElMessageBox.confirm(`确定删除用户「${row.nickname}」？`, '提示')
    await deleteUserApi(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // cancelled
  }
}

async function handleToggleStatus(row: UserInfo) {
  try {
    await toggleUserStatusApi(row.id)
    ElMessage.success('状态更新成功')
    fetchData()
  } catch {
    // handled
  }
}

onMounted(async () => {
  const roleRes = await getRoleListApi({ page: 1, pageSize: 50 })
  roles.value = roleRes.list
  fetchData()
})
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
