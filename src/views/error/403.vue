<template>
  <div class="error-page">
    <h1 class="error-code">403</h1>
    <p class="error-message">抱歉，您没有权限访问此页面</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.error-code {
  font-size: 120px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.error-message {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}
</style>
