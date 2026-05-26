<template>
  <div class="p-6">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="text-center pb-8 border-none shadow-sm rounded-xl">
          <div class="flex flex-col items-center py-6">
            <el-avatar :size="100" :icon="UserFilled" class="mb-4 bg-primary/10 text-primary" />
            <h3 class="text-xl font-bold mb-1">{{ authStore.userInfo?.nickname || authStore.userInfo?.username }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ authStore.userInfo?.roles?.[0]?.name || '普通用户' }}</p>
            <div class="flex gap-2 mb-6">
              <el-tag size="small" v-for="role in authStore.userInfo?.roles" :key="role.id">{{ role.name }}</el-tag>
            </div>
          </div>
          <div class="border-t border-gray-100 dark:border-gray-800 pt-6 px-4">
            <div class="flex justify-between mb-4">
              <span class="text-gray-500">用户名</span>
              <span>{{ authStore.userInfo?.username }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-gray-500">邮箱</span>
              <span>{{ authStore.userInfo?.email || '未设置' }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-gray-500">手机号</span>
              <span>{{ authStore.userInfo?.phone || '未设置' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">注册时间</span>
              <span>{{ formatDate(authStore.userInfo?.createTime) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="border-none shadow-sm rounded-xl h-full">
          <template #header>
            <div class="flex items-center gap-2">
              <span class="font-bold text-lg">基本信息设置</span>
            </div>
          </template>
          <el-form :model="form" label-width="100px" class="max-w-xl mt-4">
            <el-form-item label="昵称">
              <el-input v-model="form.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="form.bio" type="textarea" :rows="4" placeholder="介绍一下你自己吧" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleSubmit">保存修改</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const loading = ref(false)

const form = reactive({
  nickname: authStore.userInfo?.nickname || '',
  email: authStore.userInfo?.email || '',
  phone: authStore.userInfo?.phone || '',
  bio: '',
})

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

async function handleSubmit() {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('个人信息更新成功')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.nickname = authStore.userInfo?.nickname || ''
  form.email = authStore.userInfo?.email || ''
  form.phone = authStore.userInfo?.phone || ''
  form.bio = ''
}
</script>

<style scoped>
:deep(.el-card__header) {
  border-bottom: 1px solid var(--border-color);
  padding: 16px 20px;
}
</style>
