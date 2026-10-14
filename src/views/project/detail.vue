<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import detailMain from '~/assets/img/detail-main.jpg'
import homeMap from '~/assets/img/home-map.jpg'
import AppLogo from '~/components/AppLogo.vue'
import SoftTag from '~/components/SoftTag.vue'
import { getProject, projects, serviceContentByType } from '~/mock'

const route = useRoute()
const router = useRouter()

const p = computed(() => getProject(Number(route.params.id)))
const cover = computed(() => (p.value.id === 1 ? detailMain : p.value.img))
const contents = computed(() => serviceContentByType[p.value.type] ?? serviceContentByType.default)
const signed = ref(p.value.signed)
const joined = ref(false)
const favored = ref(false)
const tab = ref('intro')

const canJoin = computed(() => p.value.status === '报名中' && !joined.value)

async function join() {
  await ElMessageBox.confirm(`确认报名「${p.value.title}」？报名后请留意审核结果和活动提醒。`, '报名确认', {
    confirmButtonText: '确认报名',
    cancelButtonText: '再想想',
    type: 'info',
  })
  joined.value = true
  signed.value += 1
  ElMessage.success('报名成功，等待组织方审核')
}

function toggleFavor() {
  favored.value = !favored.value
  ElMessage.success(favored.value ? '已收藏' : '已取消收藏')
}

function share() {
  navigator.clipboard?.writeText(location.href).catch(() => {})
  ElMessage.success('项目链接已复制，快去分享吧')
}

const mapVisible = ref(false)

const related = computed(() => projects.filter(x => x.id !== p.value.id && x.status === '报名中').slice(0, 3))
const sections = [
  { key: 'intro', label: '项目介绍' },
  { key: 'content', label: '服务内容' },
  { key: 'require', label: '招募要求' },
  { key: 'plan', label: '活动安排' },
  { key: 'notice', label: '注意事项' },
  { key: 'past', label: '往期精彩' },
]
</script>

<template>
  <div class="page">
    <el-breadcrumb separator=">" class="mb-14px">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/project/list' }">
        志愿项目
      </el-breadcrumb-item>
      <el-breadcrumb-item>项目详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="layout">
      <div class="main">
        <!-- 概要 -->
        <section class="card summary">
          <img :src="cover" class="cover" alt="">
          <div class="info">
            <SoftTag :text="p.type" />
            <h1>{{ p.title }}</h1>
            <div class="slogan">
              {{ p.slogan }}
            </div>
            <p class="desc">
              组织志愿者在{{ p.region }}社区公园、街道及周边区域开展环境卫生清理，宣传垃圾分类知识，提升社区环境卫生水平，共建整洁、文明、宜居的城市环境。
            </p>
            <ul>
              <li><i class="i-ri-map-pin-2-line" /><span>服务区域</span>{{ p.region }} {{ p.street }}</li>
              <li><i class="i-ri-time-line" /><span>活动时间</span>{{ p.start }} 至 {{ p.end }}</li>
              <li><i class="i-ri-group-line" /><span>招募人数</span>{{ p.recruit }}人（已报名 {{ signed }} 人）</li>
              <li><i class="i-ri-flag-line" /><span>服务类型</span>{{ p.type }}</li>
              <li><i class="i-ri-stack-line" /><span>项目状态</span><SoftTag :text="p.status" /></li>
            </ul>
          </div>
        </section>

        <!-- 详情 tabs -->
        <section class="card detail">
          <el-tabs v-model="tab" class="detail-tabs">
            <el-tab-pane v-for="s in sections" :key="s.key" :label="s.label" :name="s.key" />
          </el-tabs>

          <template v-if="tab === 'intro' || tab === 'content'">
            <div v-if="tab === 'intro'" class="block">
              <h3><i class="i-ri-file-text-fill" />项目背景</h3>
              <p>
                为进一步改善社区环境卫生，提升居民生活质量，增强公众垃圾分类意识，{{ p.street.replace('街道', '') }}街道组织开展{{ p.title }}，通过志愿服务的方式，带动更多市民参与环境保护，共建整洁、文明、宜居的城市环境。
              </p>
            </div>
            <div class="block">
              <h3><i class="i-ri-clipboard-line" />服务内容</h3>
              <ol>
                <li v-for="(c, i) in contents" :key="c">
                  <b>{{ i + 1 }}</b>{{ c }}
                </li>
              </ol>
            </div>
            <div class="block">
              <h3><i class="i-ri-map-pin-2-line" />服务地点</h3>
              <div class="flex items-center justify-between">
                <p>北京市{{ p.region }}{{ p.street }}（具体集合地点：{{ p.street.replace('街道', '') }}社区服务中心门口）</p>
                <el-button type="primary" plain @click="mapVisible = true">
                  <i class="i-ri-map-pin-line mr-4px" />查看地图
                </el-button>
              </div>
            </div>
          </template>

          <div v-else-if="tab === 'require'" class="block">
            <h3><i class="i-ri-user-star-fill" />招募要求</h3>
            <ol>
              <li><b>1</b>年满 16 周岁，身体健康，热心公益事业</li>
              <li><b>2</b>已完成平台实名认证，垃圾分类类活动需完成基础培训</li>
              <li><b>3</b>能够按时参加活动，服从现场组织安排</li>
              <li><b>4</b>具有良好的沟通能力，能够耐心向居民讲解</li>
            </ol>
          </div>

          <div v-else-if="tab === 'plan'" class="block">
            <h3><i class="i-ri-calendar-event-fill" />活动安排</h3>
            <el-timeline class="ml-4px mt-10px">
              <el-timeline-item :timestamp="`${p.start.slice(0, 10)} ${p.start.slice(11)}`" type="primary">
                集合签到，领取志愿者马甲与物资，按点位分组
              </el-timeline-item>
              <el-timeline-item timestamp="活动进行中" type="success">
                按点位开展清理、宣传与引导工作，组长负责现场协调
              </el-timeline-item>
              <el-timeline-item :timestamp="`${p.end.slice(0, 10)} ${p.end.slice(11)}`" type="warning">
                归还物资、签退，负责人确认服务时长
              </el-timeline-item>
            </el-timeline>
          </div>

          <div v-else-if="tab === 'notice'" class="block">
            <h3><i class="i-ri-information-line" />注意事项</h3>
            <ol>
              <li><b>1</b>请提前 10 分钟到达集合地点，扫码或定位签到</li>
              <li><b>2</b>着装轻便，注意防暑防晒，自备饮用水</li>
              <li><b>3</b>如临时无法参加，请于活动开始 24 小时前取消报名</li>
              <li><b>4</b>活动结束后请及时签退，未签退将影响服务时长记录</li>
            </ol>
          </div>

          <div v-else class="block">
            <h3><i class="i-ri-award-fill" />往期精彩</h3>
            <div class="past">
              <img v-for="r in projects.slice(0, 6)" :key="r.id" :src="r.img" alt="">
            </div>
          </div>
        </section>
      </div>

      <aside class="side">
        <section class="card apply">
          <div class="deadline">
            <i class="i-ri-time-fill" />
            <div>
              <div class="text-muted text-13px">
                报名截止时间
              </div>
              <b>{{ p.deadline }}</b>
              <div class="mt-4px text-13px">
                距离报名截止还有 <b class="!text-13px">1天5小时</b>
              </div>
            </div>
          </div>
          <el-button type="primary" size="large" class="apply-btn" :disabled="!canJoin" @click="join">
            <i class="i-ri-send-plane-fill mr-8px" />{{ joined ? '已报名，待审核' : p.status === '报名中' ? '立即报名' : `项目${p.status}` }}
          </el-button>
          <div class="grid grid-cols-2 mt-12px gap-12px">
            <el-button size="large" class="!m-0" @click="toggleFavor">
              <i :class="favored ? 'i-ri-star-fill text-#f7b500' : 'i-ri-star-line'" class="mr-6px" />{{ favored ? '已收藏' : '收藏项目' }}
            </el-button>
            <el-button size="large" class="!m-0" @click="share">
              <i class="i-ri-share-line mr-6px" />分享项目
            </el-button>
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <h3 class="!text-primary">
              发布组织
            </h3>
          </div>
          <div class="org" @click="router.push('/organization')">
            <span class="org-logo"><AppLogo /></span>
            <div class="flex-1">
              <div class="font-600">
                {{ p.org }}
              </div>
              <span class="soft-tag blue mt-6px"><i class="i-ri-shield-check-fill mr-2px" />实名认证</span>
            </div>
            <i class="i-ri-arrow-right-s-line text-#86909c" />
          </div>
          <div class="org-stats">
            <div><b>12</b><span>发布项目</span></div>
            <div><b>320</b><span>组织成员</span></div>
            <div><b>4.9</b><span>组织评分</span></div>
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <h3>联系方式</h3>
          </div>
          <div class="contact">
            <i class="i-ri-phone-line" />010-12345678（工作日 9:00-18:00）
          </div>
          <div class="contact">
            <i class="i-ri-mail-line" />volunteer@wangjing.gov.cn
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <h3>相关项目推荐</h3>
            <span class="more-link"><i class="i-ri-refresh-line" /> 换一批</span>
          </div>
          <div v-for="r in related" :key="r.id" class="related" @click="router.push(`/project/detail/${r.id}`)">
            <img :src="r.img" alt="">
            <div class="min-w-0 flex-1">
              <div class="truncate font-600">
                {{ r.title }}
              </div>
              <div class="text-muted mt-6px text-13px">
                {{ r.start }}
              </div>
            </div>
            <SoftTag :text="r.status" />
          </div>
        </section>
      </aside>
    </div>

    <el-dialog v-model="mapVisible" title="服务地点" width="560px">
      <img :src="homeMap" class="w-full rounded-6px" alt="地图">
      <p class="mt-10px">
        <i class="i-ri-map-pin-2-line text-primary" /> 北京市{{ p.region }}{{ p.street }}
      </p>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.text-primary {
  color: var(--cv-primary);
}

.layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side {
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary {
  display: flex;
  gap: 24px;
  padding: 0;
  overflow: hidden;

  .cover {
    width: 50%;
    max-width: 500px;
    aspect-ratio: 495 / 360;
    object-fit: cover;
  }

  .info {
    flex: 1;
    padding: 20px 20px 16px 0;
  }

  h1 {
    margin: 10px 0 4px;
    font-size: 28px;
    font-weight: 800;
    color: #15233a;
  }

  .slogan {
    color: var(--cv-text-2);
    font-size: 15px;
  }

  .desc {
    font-size: 12px;
    color: var(--cv-text-2);
    line-height: 20px;
    margin: 10px 0 14px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    line-height: 34px;
    font-size: 14px;

    i {
      color: #2f4b7c;
      font-size: 18px;
    }

    span:not(.soft-tag) {
      color: var(--cv-text-2);
      width: 64px;
    }
  }
}

.detail {
  padding: 4px 24px 22px;
}

.detail-tabs {
  :deep(.ep-tabs__item) {
    font-size: 16px;
    height: 54px;
    padding: 0 24px;
  }

  :deep(.ep-tabs__active-bar) {
    height: 3px;
  }
}

.block {
  margin-top: 10px;
  margin-bottom: 8px;

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    margin: 16px 0 10px;

    i {
      color: var(--cv-primary);
      font-size: 22px;
    }
  }

  p {
    margin: 0 0 0 32px;
    line-height: 26px;
    color: #3b4757;
    font-size: 15px;
  }

  ol {
    list-style: none;
    margin: 0 0 0 32px;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    line-height: 40px;
    font-size: 15px;
    color: #3b4757;

    b {
      width: 26px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      border-radius: 50%;
      background: var(--cv-primary-soft);
      color: var(--cv-primary);
      font-weight: 500;
    }
  }
}

.past {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-left: 32px;

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 6px;
  }
}

.apply {
  padding: 8px 16px 16px;
}

.deadline {
  display: flex;
  gap: 14px;
  background: linear-gradient(120deg, #e4f6ee, #eef9f4);
  border-radius: 6px;
  padding: 14px 16px;
  margin: 0 -8px 14px;

  > i {
    color: #1fb36c;
    font-size: 34px;
  }

  b {
    font-size: 20px;
    color: #15233a;
  }
}

.apply-btn {
  width: 100%;
  height: 46px;
  font-size: 17px;
}

.org {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  .org-logo {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.org-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 16px;
  text-align: center;

  div + div {
    border-left: 1px solid var(--cv-border);
  }

  b {
    display: block;
    font-size: 18px;
  }

  span {
    font-size: 12px;
    color: var(--cv-text-3);
  }
}

.contact {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 32px;
  color: #3b4757;

  i {
    color: var(--cv-primary);
    font-size: 18px;
  }
}

.related {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 0;
  cursor: pointer;

  img {
    width: 76px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }

  &:hover .font-600 {
    color: var(--cv-primary);
  }
}
</style>
