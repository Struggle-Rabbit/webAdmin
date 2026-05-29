<template>
  <div class="role-list p-4 sm:p-0">
    <el-card class="search-card mb-4">
      <el-form :model="query" :inline="!isMobile" class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        <el-form-item label="关键词" class="w-full sm:w-auto">
          <el-input v-model="query.keyword" placeholder="角色名称" clearable class="w-full sm:w-auto" @keyup.enter="handleSearch" />
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
          <el-button v-permission="'role:create'" type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <el-table v-loading="loading" :data="roleList" stripe border class="w-full">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="name" label="角色名称" min-width="120" />
          <el-table-column prop="code" label="角色编码" min-width="120" class-name="hidden sm:table-cell" />
          <el-table-column prop="description" label="描述" min-width="150" class-name="hidden md:table-cell" />
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" class-name="hidden md:table-cell">
            <template #default="{ row }">{{ row.createTime?.slice(0, 16) }}</template>
          </el-table-column>
          <el-table-column label="操作" :width="isMobile ? '180' : '280'" :fixed="isMobile ? false : 'right'">
            <template #default="{ row }">
              <el-button v-permission="'role:edit'" type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button v-permission="'role:edit'" type="warning" link size="small" @click="handlePermission(row)">分配权限</el-button>
              <el-button v-permission="'role:delete'" type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <RoleForm v-model:visible="formVisible" :role="currentRole" @success="fetchData" />

    <el-dialog v-model="permDialogVisible" title="分配权限" width="400px" @close="permDialogVisible = false">
      <el-tree
        ref="treeRef"
        :data="menuTree"
        :props="{ label: 'name', children: 'children' }"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedKeys"
        :check-strictly="false"
      />
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="permSubmitting" @click="handleSavePermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useResponsive } from '@/composables/useResponsive'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoleListApi, deleteRoleApi, updateRolePermissionsApi } from '@/api/role'
import { getMenuListApi } from '@/api/menu'
import type { RoleInfo, MenuInfo } from '@/types'
import RoleForm from './RoleForm.vue'

const { isMobile } = useResponsive()

const loading = ref(false)
const roleList = ref<RoleInfo[]>([])
const total = ref(0)
const formVisible = ref(false)
const currentRole = ref<RoleInfo | null>(null)

const permDialogVisible = ref(false)
const permSubmitting = ref(false)
const permRole = ref<RoleInfo | null>(null)
const menuTree = ref<MenuInfo[]>([])
const checkedKeys = ref<number[]>([])
const treeRef = ref()

const query = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
})

function getAllPermissionCodes(menus: MenuInfo[]): string[] {
  const codes: string[] = []
  for (const m of menus) {
    if (m.permission) codes.push(m.permission)
    if (m.children) codes.push(...getAllPermissionCodes(m.children))
  }
  return codes
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getRoleListApi(query)
    roleList.value = res.list
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
  query.page = 1
  fetchData()
}

function handleAdd() {
  currentRole.value = null
  formVisible.value = true
}

function handleEdit(row: RoleInfo) {
  currentRole.value = { ...row }
  formVisible.value = true
}

async function handleDelete(row: RoleInfo) {
  try {
    await ElMessageBox.confirm(`确定删除角色「${row.name}」？`, '提示')
    await deleteRoleApi(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // cancelled
  }
}

async function handlePermission(row: RoleInfo) {
  permRole.value = row
  const res = await getMenuListApi()
  menuTree.value = res.list
  const allCodes = getAllPermissionCodes(res.list)
  checkedKeys.value = allCodes
    .map((code, idx) => (row.permissions?.includes(code) ? idx + 1 : -1))
    .filter((id) => id !== -1)
  permDialogVisible.value = true
}

async function handleSavePermission() {
  if (!permRole.value) return
  permSubmitting.value = true
  try {
    const checkedNodes = treeRef.value.getCheckedNodes()
    const halfCheckedNodes = treeRef.value.getHalfCheckedNodes()
    const permissions = [...checkedNodes, ...halfCheckedNodes]
      .filter((n: any) => n.permission)
      .map((n: any) => n.permission)
    await updateRolePermissionsApi(permRole.value.id, permissions)
    ElMessage.success('权限更新成功')
    permDialogVisible.value = false
  } finally {
    permSubmitting.value = false
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
