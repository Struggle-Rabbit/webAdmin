<template>
  <el-dialog
    :model-value="visible"
    :title="role ? '编辑角色' : '新增角色'"
    width="500px"
    @update:model-value="$emit('update:visible', $event)"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createRoleApi, updateRoleApi } from '@/api/role'
import type { RoleInfo } from '@/types'

const props = defineProps<{ visible: boolean; role: RoleInfo | null }>()
const emit = defineEmits<{ (e: 'update:visible', v: boolean): void; (e: 'success'): void }>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  name: '',
  code: '',
  description: '',
  status: 1,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

watch(
  () => props.visible,
  (v) => {
    if (v && props.role) {
      form.name = props.role.name
      form.code = props.role.code
      form.description = props.role.description || ''
      form.status = props.role.status
    } else if (v) {
      form.name = ''
      form.code = ''
      form.description = ''
      form.status = 1
    }
  }
)

function handleClose() {
  emit('update:visible', false)
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (props.role) {
      await updateRoleApi(props.role.id, { name: form.name, code: form.code, description: form.description, status: form.status })
      ElMessage.success('更新成功')
    } else {
      await createRoleApi({ name: form.name, code: form.code, description: form.description, status: form.status })
      ElMessage.success('创建成功')
    }
    emit('success')
    handleClose()
  } finally {
    submitting.value = false
  }
}
</script>
