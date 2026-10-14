<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import garbageBanner from '~/assets/img/garbage-banner.jpg'
import EChart from '~/components/EChart.vue'
import PageHead from '~/components/PageHead.vue'
import StatTile from '~/components/StatTile.vue'
import { garbagePoints, garbageTemplates } from '~/mock'

const router = useRouter()
const points = ref(garbagePoints.map(p => ({ ...p })))
type Point = (typeof points.value)[number]

const streetOption = {
  grid: { left: 40, right: 40, top: 36, bottom: 26 },
  legend: { top: 0, right: 0, itemWidth: 12, itemHeight: 8 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['望京街道', '中关村街道', '新街口街道', '王府井街道', '方庄街道', '八角街道'], axisTick: { show: false }, axisLabel: { color: '#4e5969', fontSize: 11 }, axisLine: { lineStyle: { color: '#d9e0ea' } } },
  yAxis: [
    { type: 'value', name: '次 / 人次', nameTextStyle: { color: '#86909c' }, axisLabel: { color: '#86909c' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
    { type: 'value', name: '小时', nameTextStyle: { color: '#86909c' }, axisLabel: { color: '#86909c' }, splitLine: { show: false } },
  ],
  series: [
    { name: '活动次数', type: 'bar', barWidth: 14, data: [46, 38, 32, 26, 22, 18], itemStyle: { color: '#2fc58a', borderRadius: [2, 2, 0, 0] } },
    { name: '参与人次', type: 'bar', barWidth: 14, data: [420, 356, 298, 240, 196, 168], itemStyle: { color: '#3a8bf5', borderRadius: [2, 2, 0, 0] } },
    { name: '服务时长', type: 'line', yAxisIndex: 1, smooth: true, data: [1260, 1068, 894, 720, 588, 504], itemStyle: { color: '#f7932c' } },
  ],
}

const courses = [
  { name: '垃圾分类基础知识', type: '视频课程', duration: '25 分钟', learners: 8640, required: true },
  { name: '桶前值守服务规范', type: '图文课程', duration: '15 分钟', learners: 5320, required: true },
  { name: '与居民沟通的技巧', type: '视频课程', duration: '20 分钟', learners: 4108, required: false },
  { name: '志愿服务安全注意事项', type: '图文课程', duration: '10 分钟', learners: 6712, required: true },
]

function adjust(p: Point) {
  p.actual = p.plan
  ElMessage.success(`已从候补人员中为「${p.name}」补充人员`)
}
</script>

<template>
  <div class="page">
    <PageHead title="垃圾分类专区" desc="一期重点应用 · 标准化活动模板 · 点位调度 · 专题统计">
      <el-button type="primary" size="large" @click="router.push('/activity/publish')">
        <i class="i-ri-add-line mr-6px" />按模板发布活动
      </el-button>
    </PageHead>

    <section class="top">
      <img :src="garbageBanner" class="banner" alt="垃圾分类 从我做起">
      <div class="kpis">
        <StatTile icon="i-ri-recycle-fill" color="#1fb36c" label="专题活动" value="436" trend="21%" />
        <StatTile icon="i-ri-group-line" color="#3a8bf5" label="参与人次" value="4,862" trend="17%" />
        <StatTile icon="i-ri-time-line" color="#f7932c" label="服务时长(小时)" value="11,268" trend="19%" />
        <StatTile icon="i-ri-map-pin-line" color="#8a6cf7" label="覆盖桶站点位" value="128" trend="9%" />
      </div>
    </section>

    <section class="card mb-14px">
      <div class="card-title bar">
        <h3>标准化活动模板 <small>选择模板后补充社区、点位、时间与人数即可发布</small></h3>
      </div>
      <div class="templates">
        <div v-for="t in garbageTemplates" :key="t.name" class="tpl" @click="router.push('/activity/publish')">
          <span class="tpl-icon" :style="{ background: `${t.color}1a`, color: t.color }"><i :class="t.icon" /></span>
          <b>{{ t.name }}</b>
          <p>{{ t.desc }}</p>
          <div class="tpl-meta">
            <span><i class="i-ri-time-line" /> {{ t.duration }}</span>
            <span><i class="i-ri-user-line" /> {{ t.people }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="row">
      <div class="card flex-1.3 min-w-0">
        <div class="card-title bar">
          <h3>桶站点位调度 <small>2024-06-01 早高峰</small></h3>
          <span class="more-link" @click="router.push('/activity/list')">活动管理 <i class="i-ri-arrow-right-s-line" /></span>
        </div>
        <el-table :data="points" class="cv-table" size="small">
          <el-table-column prop="name" label="服务点位" min-width="150" />
          <el-table-column prop="street" label="所属街道" width="140" />
          <el-table-column prop="time" label="值守时段" width="100" />
          <el-table-column prop="leader" label="组长" width="70" />
          <el-table-column label="到岗 / 计划" width="150">
            <template #default="{ row }">
              <el-progress
                :percentage="Math.round((row.actual / row.plan) * 100)" :stroke-width="8"
                :status="row.actual < row.plan ? 'warning' : 'success'" :format="() => `${row.actual}/${row.plan}`"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ row }">
              <el-link v-if="row.actual < row.plan" type="warning" underline="never" @click="adjust(row as Point)">
                补员
              </el-link>
              <span v-else class="text-muted">满员</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="card min-w-0 flex-1">
        <div class="card-title bar">
          <h3>各街道专题开展情况</h3>
        </div>
        <EChart :option="streetOption" height="250px" />
      </div>
    </section>

    <section class="card">
      <div class="card-title bar">
        <h3>培训与考核 <small>有培训要求的活动以完成情况作为报名条件</small></h3>
      </div>
      <div class="courses">
        <div v-for="c in courses" :key="c.name" class="course">
          <span class="course-icon"><i class="i-ri-book-open-line" /></span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-8px">
              <b>{{ c.name }}</b>
              <span v-if="c.required" class="soft-tag red">必修</span>
            </div>
            <div class="text-muted mt-4px text-12px">
              {{ c.type }} · {{ c.duration }} · {{ c.learners.toLocaleString() }} 人已学
            </div>
          </div>
          <el-button type="primary" plain size="small" @click="ElMessage.success(`开始学习「${c.name}」`)">
            学习
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.top {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;

  .banner {
    width: 360px;
    height: 196px;
    object-fit: cover;
    border-radius: var(--cv-card-radius);
  }

  .kpis {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
}

.templates {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.tpl {
  border: 1px solid var(--cv-border);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: var(--cv-primary);
    box-shadow: 0 6px 16px rgba(22, 64, 128, 0.1);
  }

  .tpl-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-size: 22px;
    margin-bottom: 10px;
  }

  p {
    margin: 6px 0 10px;
    font-size: 12px;
    color: var(--cv-text-2);
    line-height: 19px;
    min-height: 38px;
  }

  .tpl-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--cv-text-3);
  }
}

.row {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}

.courses {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.course {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f9fd;
  border-radius: 8px;
  padding: 14px;

  .course-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: #e3f7ec;
    color: #1fb36c;
    font-size: 20px;
  }
}
</style>
