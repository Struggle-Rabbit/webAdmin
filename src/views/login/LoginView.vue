<template>
  <div class="login-container min-h-screen flex-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl"></div>
    
    <div class="login-card w-[420px] p-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl z-10 border border-white/20">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-primary rounded-2xl flex-center mx-auto mb-4 shadow-lg shadow-primary/30">
          <el-icon :size="32" color="white"><Platform /></el-icon>
        </div>
        <h2 class="text-2xl font-black text-gray-800 dark:text-white tracking-tight uppercase">Open Admin</h2>
        <p class="text-gray-400 text-sm mt-2">欢迎回来，请登录您的账号</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="用户名" 
            :prefix-icon="User"
            class="custom-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="密码" 
            :prefix-icon="Lock" 
            show-password
            class="custom-input"
          />
        </el-form-item>
        
        <div class="flex-between mb-6 text-sm">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <a href="#" class="text-primary hover:underline transition-all">忘记密码？</a>
        </div>

        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            :loading="loading" 
            class="w-full !rounded-xl !h-12 !text-base font-bold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]" 
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="text-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
        <span>还没有账号？</span>
        <router-link to="/register" class="text-primary font-bold ml-1 hover:underline">立即注册</router-link>
      </div>
    </div>
    
    <div class="absolute bottom-6 text-white/40 text-xs font-medium tracking-widest uppercase">
      © 2026 Open Admin System. All Rights Reserved.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock, Platform } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await authStore.login(form)
    ElMessage.success({
      message: '欢迎回来，登录成功',
      type: 'success',
      duration: 2000,
    })
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch {
    // error handled in request interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.custom-input {
  :deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: 0 0 0 1px #e5e7eb inset;
    padding: 4px 12px;
    background-color: transparent;
    
    &.is-focus {
      box-shadow: 0 0 0 2px var(--el-color-primary) inset;
    }
  }
}

.dark {
  .custom-input {
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px #374151 inset;
    }
  }
}
</style>
