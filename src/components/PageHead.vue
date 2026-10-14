<script setup lang="ts">
defineProps<{ title: string, desc?: string }>()
</script>

<template>
  <div class="page-head">
    <div class="page-head__title">
      <h1>{{ title }}</h1>
      <span v-if="desc">{{ desc }}</span>
    </div>
    <div class="flex items-center gap-12px">
      <slot />
    </div>
  </div>
</template>
