<template>
  <div class="menu-view">
    <el-card class="table-card">
      <div class="table-toolbar">
        <div />
        <div>
          <el-button v-permission="'menu:create'" type="primary" @click="handleAdd(null)">新增菜单</el-button>
        </div>
      </div>
      <el-table v-loading="loading" :data="menuList" row-key="id" stripe border default-expand-all :tree-props="{ children: 'children' }">
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="icon" label="图标" width="60" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'menu' ? 'primary' : 'warning'" size="small">{{ row.type === 'menu' ? '菜单' : '按钮' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="permission" label="权限码" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.visible" @change="handleToggleVisible(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'menu:create'" type="primary" link size="small" @click="handleAdd(row)">添加子级</el-button>
            <el-button v-permission="'menu:edit'" type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-permission="'menu:delete'" type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="500px"
      @close="handleFormClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="menuTreeSelect"
            :props="{ label: 'name', children: 'children', value: 'id', disabled: (data: any) => data.id === editingId }"
            placeholder="顶级菜单"
            check-strictly
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio value="menu">菜单</el-radio>
            <el-radio value="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item v-if="form.type === 'menu'" label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="/example" />
        </el-form-item>
        <el-form-item v-if="form.type === 'menu'" label="组件路径">
          <el-input v-model="form.component" placeholder="example/ExampleView.vue" />
        </el-form-item>
        <el-form-item v-if="form.type === 'menu'" label="图标">
          <el-input v-model="form.icon" placeholder="Menu, User, etc." />
        </el-form-item>
        <el-form-item label="权限码">
          <el-input v-model="form.permission" placeholder="module:action" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="可见">
          <el-switch v-model="form.visible" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="formSubmitting" @click="handleFormSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getMenuListApi, createMenuApi, updateMenuApi, deleteMenuApi } from '@/api/menu'
import type { MenuInfo } from '@/types'

const loading = ref(false)
const menuList = ref<MenuInfo[]>([])
const formVisible = ref(false)
const formSubmitting = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  parentId: null as number | null,
  type: 'menu',
  name: '',
  path: '',
  component: '',
  icon: '',
  permission: '',
  sort: 0,
  visible: true,
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
}

function flattenTreeForSelect(items: MenuInfo[]): any[] {
  return items.map((item) => ({
    ...item,
    disabled: item.id === editingId.value,
    children: item.children ? flattenTreeForSelect(item.children) : undefined,
  }))
}

const menuTreeSelect = computed(() => flattenTreeForSelect(menuList.value))

const formTitle = computed(() => (editingId.value ? '编辑菜单' : '新增菜单'))

function resetForm() {
  form.parentId = null
  form.type = 'menu'
  form.name = ''
  form.path = ''
  form.component = ''
  form.icon = ''
  form.permission = ''
  form.sort = 0
  form.visible = true
  editingId.value = null
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getMenuListApi()
    menuList.value = res.list
  } finally {
    loading.value = false
  }
}

function handleAdd(parent: MenuInfo | null) {
  resetForm()
  form.parentId = parent ? parent.id : null
  formVisible.value = true
}

function handleEdit(row: MenuInfo) {
  resetForm()
  editingId.value = row.id
  form.parentId = row.parentId
  form.type = row.type
  form.name = row.name
  form.path = row.path
  form.component = row.component || ''
  form.icon = row.icon || ''
  form.permission = row.permission || ''
  form.sort = row.sort
  form.visible = row.visible
  formVisible.value = true
}

async function handleDelete(row: MenuInfo) {
  try {
    await ElMessageBox.confirm(`确定删除「${row.name}」及其所有子级？`, '提示')
    await deleteMenuApi(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // cancelled
  }
}

async function handleToggleVisible(row: MenuInfo) {
  try {
    await updateMenuApi(row.id, { visible: !row.visible })
    ElMessage.success('更新成功')
    fetchData()
  } catch {
    // handled
  }
}

function handleFormClose() {
  resetForm()
}

async function handleFormSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  formSubmitting.value = true
  try {
    if (editingId.value) {
      await updateMenuApi(editingId.value, { ...form } as any)
      ElMessage.success('更新成功')
    } else {
      await createMenuApi({ ...form } as any)
      ElMessage.success('创建成功')
    }
    formVisible.value = false
    fetchData()
  } finally {
    formSubmitting.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
