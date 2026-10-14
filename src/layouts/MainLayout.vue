<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <AppHeader />
  <AppSidebar />
  <main class="app-main">
    <RouterView v-slot="{ Component, route }">
      <!-- 同一路由仅参数（如个人中心 tab）变化时不重建页面；详情页按 id 重建 -->
      <component :is="Component" :key="route.params.id ?? route.matched.at(-1)?.path" />
    </RouterView>
  </main>
</template>

<style scoped>
.app-main {
  margin-left: var(--cv-side-w);
  padding-top: var(--cv-header-h);
  min-height: 100vh;
  min-width: 1100px;
}
</style>
