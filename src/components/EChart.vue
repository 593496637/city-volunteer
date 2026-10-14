<script setup lang="ts">
import type { EChartsCoreOption } from 'echarts/core'
import { useResizeObserver } from '@vueuse/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, MarkPointComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

const props = withDefaults(defineProps<{ option: EChartsCoreOption, height?: string }>(), { height: '220px' })

echarts.use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, MarkPointComponent, TooltipComponent, CanvasRenderer])

const el = useTemplateRef<HTMLDivElement>('el')
const chart = shallowRef<echarts.ECharts>()

onMounted(() => {
  chart.value = echarts.init(el.value!)
  chart.value.setOption(props.option)
})
watch(() => props.option, opt => chart.value?.setOption(opt, true), { deep: true })
useResizeObserver(el, () => chart.value?.resize())
onBeforeUnmount(() => chart.value?.dispose())
</script>

<template>
  <div ref="el" :style="{ height, width: '100%' }" />
</template>
