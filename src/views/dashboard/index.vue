<script setup lang="ts">
import { useRouter } from 'vue-router'
import garbageBanner from '~/assets/img/garbage-banner.jpg'
import homeBanner from '~/assets/img/home-banner.jpg'
import homeMap from '~/assets/img/home-map.jpg'
import EChart from '~/components/EChart.vue'
import SoftTag from '~/components/SoftTag.vue'
import { districtTop10, latestActivities, noticeColor, notices, schedules } from '~/mock'

const router = useRouter()

const kpis = [
  { label: '志愿者总数', value: '12,586', trend: '+8%', icon: 'i-ri-user-3-fill', from: '#3393fd', to: '#58b2fe', to2: '/volunteer' },
  { label: '志愿组织', value: '368', trend: '+5%', icon: 'i-ri-team-fill', from: '#2ec191', to: '#47d6ac', to2: '/organization' },
  { label: '志愿项目', value: '286', trend: '+12%', icon: 'i-ri-file-text-fill', from: '#fd9a4a', to: '#ffb35f', to2: '/project/list' },
  { label: '志愿活动', value: '1,245', trend: '+18%', icon: 'i-ri-flag-fill', from: '#8d84fb', to: '#a294fd', to2: '/activity/list' },
  { label: '累计服务时长', value: '28,560', trend: '+16%', icon: 'i-ri-time-fill', from: '#f66164', to: '#fe7473', to2: '/points' },
]

const trendOption = {
  grid: { left: 44, right: 22, top: 30, bottom: 26 },
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v.toLocaleString()} 小时` },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    axisLine: { lineStyle: { color: '#c9d3e0' } },
    axisTick: { show: false },
    axisLabel: { color: '#4e5969' },
  },
  yAxis: {
    type: 'value',
    max: 3200,
    interval: 800,
    axisLabel: { color: '#4e5969', formatter: (v: number) => v.toLocaleString() },
    splitLine: { lineStyle: { color: '#eef1f6' } },
  },
  series: [{
    type: 'line',
    data: [560, 1020, 1010, 1460, 1720, {
      value: 2560,
      label: {
        show: true,
        position: 'top',
        distance: 8,
        formatter: '6月\n2,560小时',
        color: '#fff',
        backgroundColor: '#2b3d58',
        padding: [5, 8],
        borderRadius: 4,
        lineHeight: 16,
        fontSize: 12,
        align: 'left',
        offset: [-40, 0],
      },
    }],
    symbol: 'circle',
    symbolSize: 7,
    lineStyle: { width: 2.5, color: '#1a6fe0' },
    itemStyle: { color: '#1a6fe0' },
    areaStyle: {
      color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(26,111,224,0.22)' }, { offset: 1, color: 'rgba(26,111,224,0.02)' }] },
    },
  }],
}

const typeData = [
  { name: '垃圾分类', value: 35, color: '#2c9cfa' },
  { name: '环境整治', value: 20, color: '#2f4fc4' },
  { name: '文明劝导', value: 18, color: '#f9a93b' },
  { name: '社区服务', value: 15, color: '#f05a5a' },
  { name: '宣传教育', value: 8, color: '#9b6cf0' },
  { name: '其他', value: 4, color: '#27c08b' },
]
const typeOption = {
  tooltip: { trigger: 'item', formatter: '{b}：{c}%' },
  series: [{
    type: 'pie',
    radius: ['36%', '58%'],
    center: ['50%', '52%'],
    avoidLabelOverlap: true,
    data: typeData.map(d => ({ name: d.name, value: d.value, itemStyle: { color: d.color } })),
    label: { formatter: '{c}%', color: '#4e5969', fontSize: 11, overflow: 'none' },
    labelLine: { length: 4, length2: 4 },
    itemStyle: { borderColor: '#fff', borderWidth: 2 },
  }],
}

const quickEntries = [
  { label: '发布活动', icon: 'i-ri-file-list-3-fill', color: '#1a6fe0', path: '/activity/publish' },
  { label: '志愿者招募', icon: 'i-ri-user-add-line', color: '#1fb36c', path: '/project/publish' },
  { label: '活动签到', icon: 'i-ri-calendar-check-fill', color: '#8a6cf7', path: '/activity/list' },
  { label: '时长审核', icon: 'i-ri-time-fill', color: '#f7932c', path: '/points' },
  { label: '数据统计', icon: 'i-ri-bar-chart-2-fill', color: '#8a6cf7', path: '/statistics' },
  { label: '积分管理', icon: 'i-ri-coins-line', color: '#f05454', path: '/points' },
  { label: '志愿组织', icon: 'i-ri-team-fill', color: '#1a6fe0', path: '/organization' },
  { label: '系统设置', icon: 'i-ri-settings-3-fill', color: '#4e5969', path: '/system' },
]

const maxTop = districtTop10[0][1]
const go = (path: string) => router.push(path)
</script>

<template>
  <div class="page dashboard">
    <!-- 横幅 -->
    <section class="banner" :style="{ backgroundImage: `url(${homeBanner})` }">
      <h2>志愿服务让城市更美好</h2>
      <p>参与城市管理<span class="dot-sep" />践行志愿精神<span class="dot-sep" />共建文明家园</p>
    </section>

    <!-- 核心指标 -->
    <section class="kpis">
      <div
        v-for="k in kpis" :key="k.label" class="kpi"
        :style="{ background: `linear-gradient(120deg, ${k.from}, ${k.to})` }"
        @click="go(k.to2)"
      >
        <i :class="k.icon" class="kpi-icon" />
        <div>
          <div class="kpi-label">
            {{ k.label }}
          </div>
          <div class="kpi-value">
            {{ k.value }}
          </div>
          <div class="kpi-trend">
            较上月 {{ k.trend }} <i class="i-ri-arrow-right-up-line" />
          </div>
        </div>
      </div>
    </section>

    <section class="board">
      <div class="board-left">
        <!-- 服务时长趋势 -->
        <div class="card">
          <div class="card-title">
            <h3>服务时长趋势 <small>（小时）</small></h3>
          </div>
          <EChart :option="trendOption" height="200px" />
        </div>

        <!-- 服务类型分布 -->
        <div class="card">
          <div class="card-title">
            <h3>服务类型分布</h3>
          </div>
          <div class="flex items-center">
            <div class="w-58%">
              <EChart :option="typeOption" height="200px" />
            </div>
            <ul class="legend">
              <li v-for="t in typeData" :key="t.name">
                <i :style="{ background: t.color }" />{{ t.name }}<b>{{ t.value }}%</b>
              </li>
            </ul>
          </div>
        </div>

        <!-- 活动分布地图 -->
        <div class="card">
          <div class="card-title">
            <h3>志愿活动分布</h3>
            <span class="more-link" @click="go('/statistics')">查看全部 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <img :src="homeMap" class="map-img" alt="志愿活动分布地图">
          <div class="map-legend">
            <span><i class="bg-#1fb36c" />进行中</span>
            <span><i class="bg-#1a6fe0" />即将开始</span>
            <span><i class="bg-#f05454" />已结束</span>
          </div>
        </div>

        <!-- 各区 TOP10 -->
        <div class="card">
          <div class="card-title">
            <h3>各区活动数量 TOP10</h3>
            <span class="more-link gray" @click="go('/statistics')">更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <div v-for="[name, val] in districtTop10" :key="name" class="top-row">
            <span class="top-name">{{ name }}</span>
            <span class="top-bar"><i :style="{ width: `${(val / maxTop) * 100}%` }" /></span>
            <span class="top-val">{{ val }}</span>
          </div>
        </div>

        <!-- 近期活动安排 -->
        <div class="card">
          <div class="card-title">
            <h3>近期活动安排</h3>
            <span class="more-link gray" @click="go('/activity/list')">更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <div v-for="s in schedules" :key="s.title" class="schedule" @click="go(`/project/detail/${s.projectId}`)">
            <div class="schedule-date">
              <b>{{ s.day }}</b><span>{{ s.month }}</span>
            </div>
            <div class="schedule-body">
              <div class="schedule-title">
                {{ s.title }}
              </div>
              <div class="schedule-meta">
                <span><i class="i-ri-time-line" /> {{ s.time }}</span>
                <span><i class="i-ri-map-pin-line" /> {{ s.place }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速入口 -->
        <div class="flex flex-col gap-14px">
          <div class="card flex-1">
            <div class="card-title">
              <h3>快速入口</h3>
            </div>
            <div class="quick">
              <div v-for="q in quickEntries" :key="q.label" class="quick-item" @click="go(q.path)">
                <span :style="{ background: `${q.color}1a`, color: q.color }"><i :class="q.icon" /></span>
                {{ q.label }}
              </div>
            </div>
          </div>
          <img :src="garbageBanner" class="garbage-banner" alt="垃圾分类 从我做起" @click="go('/garbage')">
        </div>
      </div>

      <div class="board-right">
        <!-- 通知公告 -->
        <div class="card">
          <div class="card-title">
            <h3>通知公告</h3>
            <span class="more-link gray" @click="go('/notice')">更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <div v-for="n in notices.slice(0, 5)" :key="n.id" class="notice-row" @click="go('/notice')">
            <span class="soft-tag" :class="noticeColor[n.type]">{{ n.type }}</span>
            <span class="notice-title">{{ n.title }}</span>
            <span class="text-muted">{{ n.date }}</span>
          </div>
        </div>

        <!-- 最新活动 -->
        <div class="card flex-1">
          <div class="card-title">
            <h3>最新活动</h3>
            <span class="more-link gray" @click="go('/project/list')">更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <div v-for="a in latestActivities" :key="a.title" class="latest" @click="go(`/project/detail/${a.projectId}`)">
            <img :src="a.img" alt="">
            <div class="latest-body">
              <div class="latest-title">
                {{ a.title }}
              </div>
              <div class="my-4px flex gap-6px">
                <SoftTag v-for="t in a.tags" :key="t" :text="t" />
              </div>
              <div class="latest-meta">
                <i class="i-ri-time-line" /> {{ a.time }}
              </div>
              <div class="latest-meta">
                <i class="i-ri-map-pin-line" /> {{ a.place }}
              </div>
            </div>
            <SoftTag :text="a.status" size="lg" />
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div>
        © 2024 城市管理志愿服务平台 <span class="mx-10px">|</span> 京ICP备20240001号-1 <span class="mx-10px">|</span> 建议使用 Chrome、Edge 等现代浏览器访问
      </div>
      <div class="flex gap-20px">
        <a>关于我们</a><a>使用帮助</a><a>联系我们</a>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.banner {
  height: 140px;
  border-radius: var(--cv-card-radius);
  background-color: #e3effd;
  background-repeat: no-repeat;
  background-position: right center;
  background-size: auto 100%;
  padding: 26px 56px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 62%;
    background: linear-gradient(90deg, #e6f0fd 55%, rgba(230, 240, 253, 0));
  }

  h2,
  p {
    position: relative;
  }

  h2 {
    margin: 0;
    font-size: 38px;
    font-weight: 800;
    color: #0f3567;
    letter-spacing: 3px;
  }

  p {
    margin: 12px 0 0 36px;
    font-size: 17px;
    color: #253b5a;
    letter-spacing: 2px;
  }
}

.kpis {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin: 14px 0;
}

.kpi {
  height: 112px;
  border-radius: var(--cv-card-radius);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 0 24px;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(30, 80, 160, 0.12);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .kpi-icon {
    font-size: 46px;
    opacity: 0.95;
  }

  .kpi-label {
    font-size: 15px;
  }

  .kpi-value {
    font-size: 27px;
    font-weight: 700;
    margin: 2px 0;
  }

  .kpi-trend {
    font-size: 14px;
    opacity: 0.95;
  }
}

.board {
  display: flex;
  gap: 14px;
}

.board-left {
  flex: 3;
  display: grid;
  grid-template-columns: 1fr 1fr 1.1fr;
  gap: 14px;
  min-width: 0;
}

.board-right {
  flex: 1.25;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.legend {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  font-size: 13px;
  color: var(--cv-text-2);

  li {
    display: flex;
    align-items: center;
    line-height: 28px;

    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }

    b {
      margin-left: auto;
      font-weight: 400;
    }
  }
}

.map-img {
  width: 100%;
  height: 176px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
}

.map-legend {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  font-size: 13px;
  color: var(--cv-text-2);

  i {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }
}

.top-row {
  display: flex;
  align-items: center;
  height: 27px;
  font-size: 13px;

  .top-name {
    width: 56px;
    color: var(--cv-text-2);
  }

  .top-bar {
    flex: 1;
    margin-right: 8px;

    i {
      display: block;
      height: 11px;
      border-radius: 2px;
      background: linear-gradient(90deg, #2d84f5, #4aa3ff);
    }
  }

  .top-val {
    width: 34px;
    color: var(--cv-text-2);
  }
}

.schedule {
  display: flex;
  border: 1px solid var(--cv-border);
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--cv-primary);
  }

  .schedule-date {
    width: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--cv-border);
    color: var(--cv-primary);

    b {
      font-size: 20px;
      line-height: 1.1;
    }

    span {
      font-size: 11px;
    }
  }

  .schedule-body {
    padding: 9px 12px;
    min-width: 0;
  }

  .schedule-title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .schedule-meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: var(--cv-text-3);
    white-space: nowrap;
  }
}

.quick {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 14px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--cv-text-2);
  cursor: pointer;

  span {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-size: 22px;
    transition: transform 0.2s;
  }

  &:hover span {
    transform: scale(1.08);
  }
}

.garbage-banner {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: var(--cv-card-radius);
  cursor: pointer;
  display: block;
}

.notice-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  height: 29px;
  cursor: pointer;

  .notice-title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--cv-text);
  }

  &:hover .notice-title {
    color: var(--cv-primary);
  }
}

.latest {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 7px 0;
  cursor: pointer;

  img {
    width: 92px;
    height: 74px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .latest-body {
    flex: 1;
    min-width: 0;
  }

  .latest-title {
    font-weight: 600;
    font-size: 14px;
  }

  .latest-meta {
    font-size: 12px;
    color: var(--cv-text-3);
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover .latest-title {
    color: var(--cv-primary);
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 22px;
  padding-top: 14px;
  font-size: 12px;
  color: var(--cv-text-3);

  a {
    color: var(--cv-text-3);
    cursor: pointer;
  }
}
</style>
