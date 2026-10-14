<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import listBanner from '~/assets/img/list-banner.jpg'
import SoftTag from '~/components/SoftTag.vue'
import { districts, projects, serviceTypes } from '~/mock'

const route = useRoute()
const router = useRouter()

const orgOptions = [...new Set(projects.map(p => p.org))]
const form = reactive({
  keyword: String(route.query.keyword ?? ''),
  type: '',
  region: '',
  status: '',
  dates: [] as string[],
  org: '',
})
const applied = ref({ ...form })

const tabs = ['社区服务', '环境整治', '文化宣传', '助老助残']
const activeTab = ref('all')

const filtered = computed(() => {
  const f = applied.value
  return projects.filter((p) => {
    if (f.keyword && !p.title.includes(f.keyword) && !p.org.includes(f.keyword))
      return false
    if (f.type && !p.tags.includes(f.type))
      return false
    if (f.region && p.region !== f.region)
      return false
    if (f.status && p.status !== f.status)
      return false
    if (f.org && p.org !== f.org)
      return false
    if (f.dates?.length === 2) {
      const d = p.start.slice(0, 10)
      if (d < f.dates[0] || d > f.dates[1])
        return false
    }
    return true
  })
})

function inTab(tags: string[], tab: string) {
  if (tab === 'all')
    return true
  if (tab === 'other')
    return !tags.some(t => tabs.includes(t))
  return tags.includes(tab)
}
const countOf = (tab: string) => filtered.value.filter(p => inTab(p.tags, tab)).length
const tabbed = computed(() => filtered.value.filter(p => inTab(p.tags, activeTab.value)))

const page = ref(1)
const size = ref(9)
const paged = computed(() => tabbed.value.slice((page.value - 1) * size.value, page.value * size.value))
watch([activeTab, applied], () => (page.value = 1))

function search() {
  applied.value = { ...form }
}
function reset() {
  Object.assign(form, { keyword: '', type: '', region: '', status: '', dates: [], org: '' })
  search()
}
watch(() => route.query.keyword, (k) => {
  form.keyword = String(k ?? '')
  search()
})

const toDetail = (id: number) => router.push(`/project/detail/${id}`)
</script>

<template>
  <div class="page">
    <section class="list-banner" :style="{ backgroundImage: `url(${listBanner})` }">
      <div>
        <h1>志愿服务项目列表</h1>
        <p>汇聚城市志愿力量，共同建设美好家园</p>
      </div>
      <el-button type="primary" size="large" class="publish-btn" @click="router.push('/project/publish')">
        <i class="i-ri-add-line mr-6px" />发布项目
      </el-button>
    </section>

    <section class="card filter-card mb-14px">
      <el-form :model="form" inline label-width="72px">
        <el-form-item label="项目名称">
          <el-input v-model="form.keyword" placeholder="请输入项目名称" clearable class="!w-280px" @keyup.enter="search">
            <template #prefix>
              <i class="i-ri-search-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="form.type" placeholder="全部" clearable class="!w-180px">
            <el-option label="全部" value="" />
            <el-option v-for="t in serviceTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目区域">
          <el-select v-model="form.region" placeholder="全部" clearable class="!w-200px">
            <el-option label="全部" value="" />
            <el-option v-for="d in districts" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="form.status" placeholder="全部" clearable class="!w-220px">
            <el-option label="全部" value="" />
            <el-option v-for="s in ['报名中', '进行中', '已结束']" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="form.dates" type="daterange" value-format="YYYY-MM-DD"
            start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" class="!w-280px"
          />
        </el-form-item>
        <el-form-item label="组织单位">
          <el-select v-model="form.org" placeholder="全部" clearable class="!w-180px">
            <el-option label="全部" value="" />
            <el-option v-for="o in orgOptions" :key="o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item class="!ml-auto !mr-0">
          <el-button class="!w-90px" @click="reset">
            重置
          </el-button>
          <el-button type="primary" class="!w-104px" @click="search">
            <i class="i-ri-search-line mr-6px" />查询
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <el-tabs v-model="activeTab" class="cat-tabs">
      <el-tab-pane :label="`全部项目 (${countOf('all')})`" name="all" />
      <el-tab-pane v-for="t in tabs" :key="t" :label="`${t} (${countOf(t)})`" :name="t" />
      <el-tab-pane :label="`其他 (${countOf('other')})`" name="other" />
    </el-tabs>

    <div v-if="paged.length" class="grid">
      <div v-for="p in paged" :key="p.id" class="card project" @click="toDetail(p.id)">
        <img :src="p.img" alt="">
        <div class="project-body">
          <div class="flex items-start justify-between gap-8px">
            <h3>{{ p.title }}</h3>
            <SoftTag :text="p.status" />
          </div>
          <div class="mb-8px mt-6px flex gap-6px">
            <SoftTag v-for="t in p.tags" :key="t" :text="t" />
          </div>
          <ul class="meta">
            <li><i class="i-ri-map-pin-line" />项目区域：{{ p.region }}</li>
            <li><i class="i-ri-time-line" />开始时间：{{ p.start }}</li>
            <li><i class="i-ri-user-line" />招募人数：{{ p.recruit }}人（已报 {{ p.signed }}人）</li>
            <li><i class="i-ri-building-line" />组织单位：{{ p.org }}</li>
          </ul>
        </div>
        <div class="project-foot">
          <span><i class="i-ri-eye-line" /> {{ p.views }}</span>
          <span><i class="i-ri-heart-line" /> {{ p.likes }}</span>
          <el-button v-if="p.status === '报名中'" type="primary" size="small" class="ml-auto" @click.stop="toDetail(p.id)">
            立即报名
          </el-button>
          <el-button v-else type="primary" plain size="small" class="ml-auto" @click.stop="toDetail(p.id)">
            查看详情
          </el-button>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无符合条件的项目" class="card" />

    <div class="pager !justify-end">
      <el-pagination
        v-model:current-page="page" v-model:page-size="size" :total="tabbed.length" :page-sizes="[9, 18, 36]"
        background layout="total, prev, pager, next, sizes, jumper"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-banner {
  height: 90px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 20px;
  border-radius: var(--cv-card-radius);
  background-color: #f2f7fd;
  background-repeat: no-repeat;
  background-position: right 150px center;
  background-size: auto 100%;

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #15233a;
  }

  p {
    margin: 6px 0 0;
    color: var(--cv-text-2);
    font-size: 15px;
  }

  .publish-btn {
    width: 116px;
  }
}

.cat-tabs {
  --ep-tabs-header-height: 44px;
  background: #fff;
  border-radius: var(--cv-card-radius) var(--cv-card-radius) 0 0;
  padding: 0 16px;
  margin-bottom: 12px;
  box-shadow: var(--cv-card-shadow);

  :deep(.ep-tabs__header) {
    margin: 0;
  }

  :deep(.ep-tabs__item) {
    font-size: 14px;
    padding: 0 22px;
  }

  :deep(.ep-tabs__nav-wrap::after) {
    height: 1px;
    background: var(--cv-border);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.project {
  display: grid;
  grid-template-columns: 124px 1fr;
  grid-template-rows: auto auto;
  column-gap: 14px;
  padding: 12px 14px;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    box-shadow: 0 8px 20px rgba(22, 64, 128, 0.12);
    transform: translateY(-2px);

    h3 {
      color: var(--cv-primary);
    }
  }

  img {
    width: 124px;
    height: 132px;
    object-fit: cover;
    border-radius: 4px;
  }

  h3 {
    margin: 2px 0 0;
    font-size: 15px;
    font-weight: 700;
  }

  .meta {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 12px;
    color: var(--cv-text-2);

    li {
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 21px;
      white-space: nowrap;
    }

    i {
      color: var(--cv-text-3);
    }
  }
}

.project-foot {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--cv-text-3);

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
