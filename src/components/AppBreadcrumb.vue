<template>
  <el-breadcrumb class="app-breadcrumb select-none ml-2">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span 
          v-if="index === breadcrumbs.length - 1" 
          class="text-gray-400 dark:text-gray-500 cursor-default"
        >
          {{ item.title }}
        </span>
        <a 
          v-else 
          @click.prevent="handleLink(item)" 
          class="text-gray-600 dark:text-gray-300 font-medium hover:text-primary transition-colors cursor-pointer"
        >
          {{ item.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((r) => r.meta?.title)
  return matched.map((r) => ({
    path: r.path || '/',
    title: r.meta?.title as string,
    redirect: r.redirect,
  }))
})

function handleLink(item: any) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}
</script>

<style scoped lang="scss">
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.3s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
