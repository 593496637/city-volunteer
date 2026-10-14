<script setup lang="ts">
import { computed } from 'vue'
import { statusColor, typeColor } from '~/mock'

const props = defineProps<{ text: string, color?: string, size?: 'lg' }>()
const cls = computed(() => props.color ?? statusColor[props.text] ?? typeColor[props.text] ?? 'blue')
</script>

<template>
  <span class="soft-tag" :class="[cls, size]">{{ text }}</span>
</template>
