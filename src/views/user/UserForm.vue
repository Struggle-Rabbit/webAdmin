<template>
  <el-dialog
    :model-value="visible"
    :title="user ? '编辑用户' : '新增用户'"
    width="500px"
    @update:model-value="$emit('update:visible', $event)"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-select v-model="form.roles" multiple value-key="code" placeholder="请选择角色" style="width: 100%">
          <el-option v-for="r in roleList" :key="r.code" :label="r.name" :value="r" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!user" label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password />
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
import { createUserApi, updateUserApi } from '@/api/user'
import { getRoleListApi } from '@/api/role'
import type { UserInfo, RoleInfo } from '@/types'

const props = defineProps<{ visible: boolean; user: UserInfo | null }>()
const emit = defineEmits<{ (e: 'update:visible', v: boolean): void; (e: 'success'): void }>()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const roleList = ref<RoleInfo[]>([])

const form = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  roles: [] as RoleInfo[],
  password: '',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

watch(
  () => props.visible,
  async (v) => {
    if (v) {
      const res = await getRoleListApi({ page: 1, pageSize: 50 })
      roleList.value = res.list
      if (props.user) {
        form.username = props.user.username
        form.nickname = props.user.nickname
        form.email = props.user.email
        form.phone = props.user.phone || ''
        form.roles = props.user.roles || []
      } else {
        form.username = ''
        form.nickname = ''
        form.email = ''
        form.phone = ''
        form.roles = []
        form.password = ''
      }
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
    if (props.user) {
      await updateUserApi(props.user.id, {
        username: form.username,
        nickname: form.nickname,
        email: form.email,
        phone: form.phone,
        roles: form.roles,
      })
      ElMessage.success('更新成功')
    } else {
      await createUserApi({
        username: form.username,
        nickname: form.nickname,
        email: form.email,
        phone: form.phone,
        roles: form.roles,
      } as any)
      ElMessage.success('创建成功')
    }
    emit('success')
    handleClose()
  } finally {
    submitting.value = false
  }
}
</script>
