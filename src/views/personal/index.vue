<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import teacher from '~/assets/img/avatar-teacher.jpg'
import avatar from '~/assets/img/avatar-volunteer.jpg'
import qrcode from '~/assets/img/qrcode.png'
import EChart from '~/components/EChart.vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import { myCerts, myEvaluations, myHours, mySignups, projects } from '~/mock'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'signup', label: '我的报名' },
  { key: 'hours', label: '我的时长' },
  { key: 'certs', label: '我的证书' },
  { key: 'evaluations', label: '我的评价' },
  { key: 'favorites', label: '我的收藏' },
  { key: 'profile', label: '个人资料' },
]
const tab = computed({
  get: () => {
    const t = String(route.params.tab)
    return tabs.some(x => x.key === t) ? t : 'signup'
  },
  set: v => router.replace(`/personal/${v}`),
})

const stats = [
  { value: 120, label: '志愿服务时长（小时）', icon: 'i-ri-time-line', color: '#1a6fe0', bg: '#eaf3ff', tab: 'hours' },
  { value: 18, label: '参与活动（次）', icon: 'i-ri-file-text-fill', color: '#1fb36c', bg: '#e8f8ef', tab: 'signup' },
  { value: 3, label: '获得证书（个）', icon: 'i-ri-heart-fill', color: '#f05454', bg: '#fdecec', tab: 'certs' },
  { value: 5, label: '志愿服务评价（次）', icon: 'i-ri-star-fill', color: '#8a6cf7', bg: '#f1edff', tab: 'evaluations' },
]

const hoursOption = {
  grid: { left: 30, right: 10, top: 34, bottom: 24 },
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v} 小时` },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisTick: { show: false }, axisLine: { lineStyle: { color: '#d9e0ea' } }, axisLabel: { color: '#4e5969' } },
  yAxis: { type: 'value', name: '小时', max: 40, interval: 10, nameTextStyle: { color: '#86909c', align: 'right' }, axisLabel: { color: '#86909c' }, splitLine: { lineStyle: { color: '#eef1f6' } } },
  series: [{
    type: 'bar',
    data: [12, 18, 25, 20, 32, 13],
    barWidth: 26,
    itemStyle: { color: '#3a8bf5', borderRadius: [2, 2, 0, 0] },
    label: { show: true, position: 'top', color: '#1f2d3d' },
  }],
}

const profile = reactive({
  name: '张志愿者',
  code: 'V2024001234',
  phone: '138****6688',
  region: '北京市 朝阳区',
  intention: ['垃圾分类', '环境整治'],
  motto: '用行动传递温暖，用志愿点亮城市！',
})
const editVisible = ref(false)
const editForm = reactive({ ...profile })
function openEdit() {
  Object.assign(editForm, profile)
  editVisible.value = true
}
function saveProfile() {
  Object.assign(profile, editForm)
  editVisible.value = false
  ElMessage.success('个人资料已保存')
}

const favorites = projects.filter(p => p.status === '报名中').slice(0, 4)
const toDetail = (id: number) => router.push(`/project/detail/${id}`)
</script>

<template>
  <div class="page">
    <PageHead title="个人中心" desc="参与志愿服务 · 记录美好时光 · 让城市更温暖" />

    <section class="top">
      <div class="card profile">
        <div class="flex gap-20px">
          <img :src="avatar" class="avatar" alt="">
          <div class="flex-1">
            <div class="flex items-center gap-12px">
              <h2>{{ profile.name }}</h2>
              <span class="soft-tag blue"><i class="i-ri-verified-badge-fill mr-2px" />已认证</span>
              <el-button class="ml-auto" plain type="primary" @click="openEdit">
                编辑资料
              </el-button>
            </div>
            <p>志愿者编号：{{ profile.code }}</p>
            <p>注册时间：2024-01-15</p>
            <p>所在地区：{{ profile.region }}</p>
          </div>
        </div>
        <div class="motto">
          {{ profile.motto }}
        </div>
      </div>

      <div class="top-right">
        <div class="stats">
          <div v-for="s in stats" :key="s.label" class="stat" :style="{ background: s.bg }" @click="tab = s.tab">
            <span class="stat-icon" :style="{ background: s.color }"><i :class="s.icon" /></span>
            <b :style="{ color: s.color === '#f05454' ? s.color : '#15233a' }">{{ s.value }}</b>
            <span class="stat-label" :style="{ color: s.color === '#f05454' ? s.color : '' }">{{ s.label }}</span>
          </div>
        </div>
        <div class="flex flex-1 gap-14px">
          <div class="card level">
            <div class="card-title">
              <h3>志愿者等级</h3>
            </div>
            <div class="flex items-center gap-16px">
              <span class="medal"><i class="i-ri-award-fill" /></span>
              <div class="flex-1">
                <div class="flex justify-between">
                  <b>星级志愿者 <span class="text-#f7932c">（★★★）</span></b>
                  <span class="text-muted">120 / 200 小时</span>
                </div>
                <el-progress :percentage="60" :show-text="false" :stroke-width="8" class="my-10px" />
                <div class="text-muted text-12px">
                  再服务 80 小时可升级为 <a>四星志愿者</a>
                </div>
              </div>
            </div>
          </div>
          <div class="card qr">
            <div>
              <h3>我的二维码</h3>
              <p>志愿者电子身份码<br>用于活动签到、时长记录等</p>
            </div>
            <div class="flex flex-col items-end gap-10px">
              <img :src="qrcode" alt="二维码">
              <el-button type="primary" plain size="small" @click="ElMessage.success('二维码已保存到本地')">
                下载二维码
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bottom">
      <div class="card tabs-card">
        <el-tabs v-model="tab" class="my-tabs">
          <el-tab-pane v-for="t in tabs" :key="t.key" :label="t.label" :name="t.key" />
        </el-tabs>

        <!-- 我的报名 -->
        <template v-if="tab === 'signup'">
          <div class="card-title bar">
            <h3>我报名的活动</h3>
            <span class="more-link" @click="router.push('/project/list')">查看更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <el-table :data="mySignups" class="cv-table" border>
            <el-table-column label="活动名称" min-width="220">
              <template #default="{ row }">
                <div class="flex items-center gap-14px">
                  <img :src="row.img" class="thumb" alt="">{{ row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" width="150">
              <template #default="{ row }">
                {{ row.time[0] }}<br>{{ row.time[1] }}
              </template>
            </el-table-column>
            <el-table-column prop="region" label="服务区域" width="120" />
            <el-table-column label="活动状态" width="120" align="center">
              <template #default="{ row }">
                <SoftTag :text="row.status" size="lg" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template #default="{ row }">
                <el-link type="primary" underline="never" @click="toDetail(row.projectId)">
                  查看详情
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- 我的时长 -->
        <template v-else-if="tab === 'hours'">
          <div class="card-title bar">
            <h3>服务时长记录 <small>累计 120 小时，本月 13 小时</small></h3>
          </div>
          <el-table :data="myHours" class="cv-table" border>
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="name" label="活动名称" min-width="180" />
            <el-table-column prop="signIn" label="签到" width="90" align="center" />
            <el-table-column prop="signOut" label="签退" width="90" align="center" />
            <el-table-column prop="hours" label="时长(小时)" width="100" align="center" />
            <el-table-column label="状态" width="110" align="center">
              <template #default="{ row }">
                <SoftTag :text="row.status" />
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- 我的证书 -->
        <template v-else-if="tab === 'certs'">
          <div class="card-title bar">
            <h3>我的证书</h3>
          </div>
          <div class="cert-grid">
            <div v-for="c in myCerts" :key="c.name" class="cert-item">
              <el-image :src="c.img" :preview-src-list="[c.img]" fit="cover" class="cert-img" />
              <b>{{ c.name }}</b>
              <span class="text-muted text-12px">{{ c.issuer }} · {{ c.date }}</span>
            </div>
          </div>
        </template>

        <!-- 我的评价 -->
        <template v-else-if="tab === 'evaluations'">
          <div class="card-title bar">
            <h3>收到的评价</h3>
          </div>
          <div v-for="e in myEvaluations" :key="e.date + e.who" class="eval">
            <img :src="teacher" alt="">
            <div class="flex-1">
              <div class="flex justify-between">
                <span>{{ e.who }} <span class="text-muted ml-8px text-12px">{{ e.activity }}</span></span>
                <span class="text-muted">{{ e.date }}</span>
              </div>
              <el-rate :model-value="e.stars" disabled size="small" />
              <div class="text-#3b4757">
                {{ e.text }}
              </div>
            </div>
          </div>
        </template>

        <!-- 我的收藏 -->
        <template v-else-if="tab === 'favorites'">
          <div class="card-title bar">
            <h3>收藏的项目</h3>
          </div>
          <div class="fav-grid">
            <div v-for="f in favorites" :key="f.id" class="fav" @click="toDetail(f.id)">
              <img :src="f.img" alt="">
              <div class="min-w-0 flex-1">
                <b>{{ f.title }}</b>
                <div class="text-muted mt-6px text-12px">
                  {{ f.region }} · {{ f.start }}
                </div>
              </div>
              <SoftTag :text="f.status" />
            </div>
          </div>
        </template>

        <!-- 个人资料 -->
        <template v-else>
          <div class="card-title bar">
            <h3>个人资料</h3>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">
              {{ profile.name }}
            </el-descriptions-item>
            <el-descriptions-item label="志愿者编号">
              {{ profile.code }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ profile.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="所在地区">
              {{ profile.region }}
            </el-descriptions-item>
            <el-descriptions-item label="服务意向">
              {{ profile.intention.join('、') }}
            </el-descriptions-item>
            <el-descriptions-item label="培训情况">
              垃圾分类基础培训（已通过）
            </el-descriptions-item>
            <el-descriptions-item label="个人签名" :span="2">
              {{ profile.motto }}
            </el-descriptions-item>
          </el-descriptions>
          <el-button type="primary" class="mt-16px" @click="openEdit">
            编辑资料
          </el-button>
        </template>
      </div>

      <div class="side">
        <div class="card">
          <div class="card-title">
            <h3>我的服务时长</h3>
            <span class="more-link" @click="tab = 'hours'">查看更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <EChart :option="hoursOption" height="150px" />
        </div>
        <div class="card">
          <div class="card-title">
            <h3>我的证书</h3>
            <span class="more-link" @click="tab = 'certs'">查看更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <div class="certs">
            <div v-for="c in myCerts" :key="c.name">
              <img :src="c.img" alt="">
              <div class="mt-6px text-13px">
                {{ c.name }}
              </div>
              <div class="text-muted text-12px">
                {{ c.date }}
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">
            <h3>志愿服务评价</h3>
            <span class="more-link" @click="tab = 'evaluations'">查看更多 <i class="i-ri-arrow-right-s-line" /></span>
          </div>
          <div class="eval !border-none !py-0">
            <img :src="teacher" alt="">
            <div class="flex-1">
              <div class="flex justify-between">
                <span>{{ myEvaluations[0].who }}</span>
                <span class="text-muted">{{ myEvaluations[0].date }}</span>
              </div>
              <el-rate :model-value="5" disabled size="small" />
              <div class="text-13px text-#3b4757">
                {{ myEvaluations[0].text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <el-dialog v-model="editVisible" title="编辑资料" width="520px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="所在地区">
          <el-input v-model="editForm.region" />
        </el-form-item>
        <el-form-item label="服务意向">
          <el-checkbox-group v-model="editForm.intention">
            <el-checkbox v-for="t in ['垃圾分类', '环境整治', '文明劝导', '社区服务']" :key="t" :label="t" :value="t" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="个人签名">
          <el-input v-model="editForm.motto" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveProfile">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.top {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.profile {
  width: 490px;
  padding: 24px 20px;

  .avatar {
    width: 124px;
    height: 124px;
    border-radius: 50%;
    object-fit: cover;
  }

  h2 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 10px 0 0;
    color: #3b4757;
  }

  .motto {
    margin-top: 30px;
    color: var(--cv-text-2);
    font-size: 14px;
  }
}

.top-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.stat {
  border-radius: var(--cv-card-radius);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 20px;
  }

  b {
    font-size: 26px;
    margin-top: 6px;
  }

  .stat-label {
    font-size: 13px;
    color: var(--cv-text-2);
  }
}

.level {
  flex: 1.3;

  .medal {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 28px;
    background: radial-gradient(circle, #ffc53d 40%, #f7932c 100%);
    box-shadow: 0 0 0 4px #ffe8b8;
  }
}

.qr {
  flex: 1;
  display: flex;
  justify-content: space-between;

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
  }

  p {
    font-size: 12px;
    color: var(--cv-text-3);
    margin: 0;
    line-height: 20px;
  }

  img {
    width: 64px;
    height: 64px;
  }
}

.bottom {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.tabs-card {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}

.my-tabs :deep(.ep-tabs__item) {
  font-size: 15px;
  height: 50px;
  padding: 0 22px;
}

.thumb {
  width: 66px;
  height: 48px;
  object-fit: cover;
  border-radius: 3px;
}

.side {
  width: 456px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.certs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  img {
    width: 100%;
    aspect-ratio: 125 / 82;
    object-fit: cover;
    display: block;
  }
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  .cert-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cert-img {
    width: 100%;
    aspect-ratio: 125 / 82;
    border-radius: 4px;
  }
}

.eval {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--cv-border);

  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
}

.fav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.fav {
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid var(--cv-border);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;

  img {
    width: 80px;
    height: 56px;
    object-fit: cover;
    border-radius: 4px;
  }

  &:hover {
    border-color: var(--cv-primary);
  }
}
</style>
