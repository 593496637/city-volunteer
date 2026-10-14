<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import heatMap from '~/assets/img/heat-map.jpg'
import EChart from '~/components/EChart.vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import StatTile from '~/components/StatTile.vue'
import { hoursTop5, orgTop5, recentDynamics } from '~/mock'

const range = ref<[string, string]>(['2024-01-01', '2024-06-30'])

const tabs = ['总体概况', '志愿项目分析', '志愿活动分析', '志愿者分析', '服务时长分析', '区域分布分析']
const tab = ref('总体概况')
// 各分析维度展示的面板
const panelsOf: Record<string, string[]> = {
  总体概况: ['trend', 'type', 'age', 'region', 'map', 'org', 'recent', 'rank'],
  志愿项目分析: ['type', 'org', 'region', 'recent'],
  志愿活动分析: ['type', 'trend', 'map', 'recent'],
  志愿者分析: ['age', 'rank', 'org'],
  服务时长分析: ['trend', 'rank', 'region'],
  区域分布分析: ['region', 'map', 'org'],
}
const show = (k: string) => panelsOf[tab.value].includes(k)

const kpis = [
  { label: '注册志愿者总数', value: '3,560', trend: '12%', icon: 'i-ri-user-3-fill', color: '#3a8bf5' },
  { label: '志愿项目总数', value: '320', trend: '8%', icon: 'i-ri-file-list-3-fill', color: '#1fb36c' },
  { label: '志愿活动总数', value: '586', trend: '15%', icon: 'i-ri-flag-fill', color: '#8a6cf7' },
  { label: '志愿服务时长(小时)', value: '12,680', trend: '20%', icon: 'i-ri-time-line', color: '#f05454' },
  { label: '参与人次', value: '8,230', trend: '18%', icon: 'i-ri-group-line', color: '#f7932c' },
  { label: '群众满意度', value: '98.2%', trend: '2%', icon: 'i-ri-thumb-up-fill', color: '#1fb36c' },
]

const period = ref('6m')
const trendData: Record<string, { x: string[], y: number[] }> = {
  '6m': { x: ['1月', '2月', '3月', '4月', '5月', '6月'], y: [820, 1180, 1620, 1360, 1980, 2160] },
  '1y': { x: ['7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月'], y: [620, 700, 880, 760, 940, 680, 820, 1180, 1620, 1360, 1980, 2160] },
  '3y': { x: ['2022H1', '2022H2', '2023H1', '2023H2', '2024H1'], y: [3200, 4100, 5600, 6400, 9120] },
}
const trendOption = computed(() => ({
  grid: { left: 46, right: 20, top: 30, bottom: 26 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: trendData[period.value].x, axisTick: { show: false }, axisLine: { lineStyle: { color: '#d9e0ea' } }, axisLabel: { color: '#4e5969' } },
  yAxis: { type: 'value', name: '小时', nameTextStyle: { color: '#86909c', align: 'right' }, axisLabel: { color: '#86909c' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
  series: [{
    type: 'line',
    data: trendData[period.value].y,
    symbol: 'circle',
    symbolSize: 7,
    lineStyle: { width: 2.5, color: '#1a6fe0' },
    itemStyle: { color: '#1a6fe0' },
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(26,111,224,0.2)' }, { offset: 1, color: 'rgba(26,111,224,0.02)' }] } },
  }],
}))

const typeColors = ['#3a8bf5', '#4cd39b', '#fbb45c', '#a48cf7', '#6cb8f7', '#f98aa0']
const typeOption = {
  grid: { left: 36, right: 10, top: 30, bottom: 26 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['垃圾分类', '环境整治', '文明劝导', '社区服务', '文化教育', '其他'], axisTick: { show: false }, axisLine: { lineStyle: { color: '#d9e0ea' } }, axisLabel: { color: '#4e5969', fontSize: 11 } },
  yAxis: { type: 'value', name: '单位：次', max: 200, interval: 50, nameTextStyle: { color: '#86909c', align: 'left' }, axisLabel: { color: '#86909c' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
  series: [{
    type: 'bar',
    barWidth: 30,
    data: [156, 98, 76, 64, 52, 48].map((v, i) => ({ value: v, itemStyle: { color: typeColors[i] } })),
    label: { show: true, position: 'top', color: '#1f2d3d' },
  }],
}

const ages = [
  { name: '18岁以下', value: 12, color: '#3a8bf5' },
  { name: '18-30岁', value: 28, color: '#2fc58a' },
  { name: '31-45岁', value: 36, color: '#fb9a3c' },
  { name: '46-60岁', value: 18, color: '#9b7cf5' },
  { name: '60岁以上', value: 6, color: '#f25f7a' },
]
const ageOption = {
  tooltip: { trigger: 'item', formatter: '{b}：{c}%' },
  series: [{
    type: 'pie',
    radius: ['56%', '86%'],
    center: ['50%', '50%'],
    label: { show: false },
    itemStyle: { borderColor: '#fff', borderWidth: 2 },
    data: ages.map(a => ({ name: a.name, value: a.value, itemStyle: { color: a.color } })),
  }],
}

const regions = [['朝阳区', 120, '#3a8bf5'], ['海淀区', 98, '#5fd3a0'], ['西城区', 76, '#fbb45c'], ['东城区', 62, '#a48cf7'], ['丰台区', 58, '#6cb8f7'], ['石景山区', 40, '#f98aa0']] as [string, number, string][]
const regionOption = {
  grid: { left: 64, right: 40, top: 6, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'value', max: 150, interval: 30, axisLabel: { color: '#86909c' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
  yAxis: { type: 'category', inverse: true, data: regions.map(r => r[0]), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#4e5969' } },
  series: [{
    type: 'bar',
    barWidth: 14,
    data: regions.map(r => ({ value: r[1], itemStyle: { color: r[2], borderRadius: [0, 2, 2, 0] } })),
    label: { show: true, position: 'right', color: '#4e5969' },
  }],
}

const rankColor = ['#f7b500', '#9aa8bd', '#f08a3c']
</script>

<template>
  <div class="page">
    <PageHead title="数据统计分析" desc="用数据记录志愿力量，让城市更美好">
      <el-date-picker
        v-model="range" type="daterange" value-format="YYYY-MM-DD" range-separator="→" size="large"
        class="!w-264px"
      />
      <el-button type="primary" size="large" class="!w-120px" @click="ElMessage.success('报表已生成，正在下载…')">
        导出报表
      </el-button>
    </PageHead>

    <el-tabs v-model="tab" class="ana-tabs">
      <el-tab-pane v-for="t in tabs" :key="t" :label="t" :name="t" />
    </el-tabs>

    <section class="kpis">
      <StatTile v-for="k in kpis" :key="k.label" v-bind="k" />
    </section>

    <section class="grid">
      <div v-if="show('trend')" class="card span-5">
        <div class="card-title">
          <h3>志愿服务时长趋势</h3>
          <el-radio-group v-model="period" size="small">
            <el-radio-button label="近6个月" value="6m" />
            <el-radio-button label="近一年" value="1y" />
            <el-radio-button label="近三年" value="3y" />
          </el-radio-group>
        </div>
        <EChart :option="trendOption" height="186px" />
      </div>

      <div v-if="show('type')" class="card span-5">
        <div class="card-title">
          <h3>活动类型分布</h3>
        </div>
        <EChart :option="typeOption" height="186px" />
      </div>

      <div v-if="show('age')" class="card span-4">
        <div class="card-title">
          <h3>志愿者年龄分布</h3>
        </div>
        <div class="flex items-center">
          <div class="relative w-50%">
            <EChart :option="ageOption" height="170px" />
            <div class="donut-center">
              <b>3,560</b><span>志愿者总数</span>
            </div>
          </div>
          <ul class="legend">
            <li v-for="a in ages" :key="a.name">
              <i :style="{ background: a.color }" />{{ a.name }}<b>{{ a.value }}%</b>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="show('region')" class="card span-5">
        <div class="card-title">
          <h3>各区域活动开展情况</h3>
          <span class="text-muted text-13px">单位：次</span>
        </div>
        <EChart :option="regionOption" height="190px" />
      </div>

      <div v-if="show('map')" class="card span-5 !p-10px">
        <div class="card-title !mb-6px !px-6px">
          <h3>活动区域分布</h3>
        </div>
        <img :src="heatMap" class="heat" alt="活动区域热力分布">
      </div>

      <div v-if="show('org')" class="card span-4">
        <div class="card-title">
          <h3>志愿组织活跃度 TOP5</h3>
          <span class="more-link" @click="$router.push('/organization')">查看更多 <i class="i-ri-arrow-right-s-line" /></span>
        </div>
        <el-table :data="orgTop5" class="cv-table" size="small">
          <el-table-column label="排名" width="48" align="center">
            <template #default="{ $index }">
              <span class="rank" :style="{ background: rankColor[$index] }">{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="组织名称" min-width="120" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row[0] }}
            </template>
          </el-table-column>
          <el-table-column label="活动次数" width="68" align="center">
            <template #default="{ row }">
              {{ row[1] }}
            </template>
          </el-table-column>
          <el-table-column label="参与人次" width="68" align="center">
            <template #default="{ row }">
              {{ row[2].toLocaleString() }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="show('recent')" class="card span-7">
        <div class="card-title">
          <h3>近期活动动态</h3>
          <span class="more-link" @click="$router.push('/activity/list')">查看更多 <i class="i-ri-arrow-right-s-line" /></span>
        </div>
        <el-table :data="recentDynamics" class="cv-table" size="small">
          <el-table-column label="时间" width="120">
            <template #default="{ row }">
              {{ row[0] }}
            </template>
          </el-table-column>
          <el-table-column label="活动名称" min-width="160">
            <template #default="{ row }">
              {{ row[1] }}
            </template>
          </el-table-column>
          <el-table-column label="所属区域" width="100">
            <template #default="{ row }">
              {{ row[2] }}
            </template>
          </el-table-column>
          <el-table-column label="参与人数" width="90" align="center">
            <template #default="{ row }">
              {{ row[3] }}
            </template>
          </el-table-column>
          <el-table-column label="活动状态" width="100" align="center">
            <template #default="{ row }">
              <SoftTag :text="row[4]" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="show('rank')" class="card span-7">
        <div class="card-title">
          <h3>服务时长排名 TOP5</h3>
          <span class="more-link" @click="$router.push('/volunteer')">查看更多 <i class="i-ri-arrow-right-s-line" /></span>
        </div>
        <el-table :data="hoursTop5" class="cv-table" size="small">
          <el-table-column label="排名" width="70" align="center">
            <template #default="{ $index }">
              <span class="rank" :style="{ background: rankColor[$index] }">{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="110">
            <template #default="{ row }">
              {{ row[0] }}
            </template>
          </el-table-column>
          <el-table-column label="所属组织" min-width="180">
            <template #default="{ row }">
              {{ row[1] }}
            </template>
          </el-table-column>
          <el-table-column label="服务时长（小时）" width="140" align="center">
            <template #default="{ row }">
              {{ row[2] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.ana-tabs {
  margin-top: -6px;

  :deep(.ep-tabs__item) {
    font-size: 15px;
    height: 44px;
    padding: 0 18px;
  }

  :deep(.ep-tabs__nav-wrap::after) {
    background: transparent;
  }

  :deep(.ep-tabs__active-bar) {
    height: 3px;
  }
}

.kpis {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 14px;
}

.span-4 {
  grid-column: span 4;
}

.span-5 {
  grid-column: span 5;
}

.span-7 {
  grid-column: span 7;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  b {
    font-size: 22px;
  }

  span {
    font-size: 12px;
    color: var(--cv-text-2);
  }
}

.legend {
  list-style: none;
  margin: 0 0 0 10px;
  padding: 0;
  flex: 1;
  font-size: 13px;
  color: var(--cv-text-2);

  li {
    display: flex;
    align-items: center;
    line-height: 30px;

    i {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 10px;
    }

    b {
      margin-left: auto;
      font-weight: 400;
    }
  }
}

.heat {
  display: block;
  width: 100%;
  height: 196px;
  object-fit: cover;
  border-radius: 6px;
}

.rank {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  background: transparent;
}

.rank:not([style*='background']) {
  color: var(--cv-text);
}
</style>
