<script setup lang="ts">
import type { Activity } from '~/mock'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import { activities, districts, serviceTypes } from '~/mock'

const router = useRouter()
const list = ref<Activity[]>(activities.map(a => ({ ...a })))

const form = reactive({ name: '', type: '', region: '', status: '', dates: [] as string[], org: '' })
const applied = ref({ ...form })
const statuses = ['待审核', '报名中', '即将开始', '未开始', '进行中', '已结束', '已取消']
const tabs = ['待审核', '进行中', '已结束', '已取消']
const tab = ref('all')

const filtered = computed(() => {
  const f = applied.value
  return list.value.filter(a =>
    (!f.name || a.name.includes(f.name))
    && (!f.type || a.type === f.type)
    && (!f.region || a.region === f.region)
    && (!f.status || a.status === f.status)
    && (!f.org || a.org.includes(f.org))
    && (f.dates?.length !== 2 || (a.start.slice(0, 10) >= f.dates[0] && a.start.slice(0, 10) <= f.dates[1])),
  )
})
const count = (t: string) => (t === 'all' ? filtered.value.length : filtered.value.filter(a => a.status === t).length)
const tabbed = computed(() => (tab.value === 'all' ? filtered.value : filtered.value.filter(a => a.status === tab.value)))

const page = ref(1)
const size = ref(10)
const paged = computed(() => tabbed.value.slice((page.value - 1) * size.value, page.value * size.value))
watch([tab, applied], () => (page.value = 1))

const search = () => (applied.value = { ...form })
function reset() {
  Object.assign(form, { name: '', type: '', region: '', status: '', dates: [], org: '' })
  search()
}

/** 根据状态给出行内操作（第三个按钮），其余放到“更多” */
function actionsOf(a: Activity) {
  switch (a.status) {
    case '进行中': return ['编辑', '签到']
    case '已结束': return ['评价', '复制']
    case '已取消': return ['复制', '删除']
    case '待审核': return ['编辑', '审核']
    default: return ['编辑', '取消']
  }
}

const selected = ref<Activity>()
const viewVisible = ref(false)
const signVisible = ref(false)

async function act(a: Activity, op: string) {
  switch (op) {
    case '查看':
      selected.value = a
      viewVisible.value = true
      break
    case '编辑':
      router.push({ path: '/activity/publish', query: { id: a.id } })
      break
    case '签到':
      selected.value = a
      signVisible.value = true
      break
    case '评价':
      router.push('/activity/evaluate')
      break
    case '审核':
      router.push('/activity/audit')
      break
    case '复制':
      list.value.unshift({ ...a, id: Date.now(), name: `${a.name}（副本）`, status: '待审核' })
      ElMessage.success('已复制为新的待审核活动')
      break
    case '取消':
      await ElMessageBox.confirm(`确定取消活动「${a.name}」吗？系统将通知已报名的 ${a.signed} 名志愿者。`, '取消活动', { type: 'warning' })
      a.status = '已取消'
      ElMessage.success('活动已取消，已向报名志愿者发送通知')
      break
    case '删除':
      await ElMessageBox.confirm(`确定删除活动「${a.name}」吗？`, '删除活动', { type: 'warning', confirmButtonClass: 'ep-button--danger' })
      list.value = list.value.filter(x => x !== a)
      ElMessage.success('已删除')
      break
    case '导出名单':
      ElMessage.success('报名名单已导出')
      break
    case '人员分组':
      router.push('/garbage')
      break
    case '时长确认':
      router.push('/points')
      break
  }
}

const signList = computed(() => Array.from({ length: Math.min(selected.value?.signed ?? 0, 8) }, (_, i) => ({
  name: ['李志强', '王丽娜', '张伟', '刘洋', '陈静', '赵敏', '孙磊', '周婷'][i],
  point: `${i % 3 + 1} 号点位`,
  time: i === 5 ? '' : `${selected.value?.start.slice(11, 13)}:${String(i * 3 + 2).padStart(2, '0')}`,
})))
</script>

<template>
  <div class="page">
    <PageHead title="活动管理" desc="对志愿服务活动进行发布、审核、组织实施和过程管理">
      <el-button type="primary" size="large" @click="router.push('/activity/publish')">
        <i class="i-ri-add-line mr-6px" />发布活动
      </el-button>
    </PageHead>

    <section class="card filter-card mb-14px">
      <el-form :model="form" inline label-width="72px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name" placeholder="请输入活动名称" clearable class="!w-210px" @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="form.type" placeholder="请选择" clearable class="!w-180px">
            <el-option v-for="t in serviceTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select v-model="form.region" placeholder="请选择" clearable class="!w-200px">
            <el-option v-for="d in districts" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="form.status" placeholder="请选择" clearable class="!w-240px">
            <el-option v-for="s in statuses" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="form.dates" type="daterange" value-format="YYYY-MM-DD" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" class="!w-330px"
          />
        </el-form-item>
        <el-form-item label="组织单位">
          <el-input v-model="form.org" placeholder="请选择组织单位" clearable class="!w-240px" />
        </el-form-item>
        <el-form-item class="!ml-auto !mr-0">
          <el-button class="!w-110px" @click="reset">
            重 置
          </el-button>
          <el-button type="primary" class="!w-110px" @click="search">
            <i class="i-ri-search-line mr-6px" />查询
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="card !pt-0">
      <el-tabs v-model="tab" class="status-tabs">
        <el-tab-pane :label="`全部活动 (${count('all')})`" name="all" />
        <el-tab-pane v-for="t in tabs" :key="t" :label="`${t} (${count(t)})`" :name="t" />
      </el-tabs>

      <el-table :data="paged" class="cv-table" row-key="id">
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column label="序号" width="64" align="center">
          <template #default="{ $index }">
            {{ (page - 1) * size + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="活动名称" min-width="210">
          <template #default="{ row }">
            <div class="flex items-center gap-14px">
              <img :src="row.img" class="thumb" alt="">
              <span class="truncate">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" width="110" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.type" size="lg" />
          </template>
        </el-table-column>
        <el-table-column prop="region" label="所属区域" width="100" />
        <el-table-column label="活动时间" width="170" align="center">
          <template #default="{ row }">
            {{ row.start }}<br>{{ row.end }}
          </template>
        </el-table-column>
        <el-table-column prop="recruit" label="招募人数" width="90" align="center" />
        <el-table-column prop="signed" label="已报名" width="80" align="center" />
        <el-table-column label="活动状态" width="110" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.status" size="lg" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="{ row }">
            <div class="op-links">
              <el-link type="primary" underline="never" @click="act(row as Activity, '查看')">
                查看
              </el-link>
              <el-link
                v-for="op in actionsOf(row as Activity)" :key="op" :type="op === '删除' ? 'danger' : 'primary'" underline="never"
                @click="act(row as Activity, op)"
              >
                {{ op }}
              </el-link>
              <el-dropdown trigger="click" @command="(op: string) => act(row as Activity, op)">
                <el-link type="primary" underline="never">
                  更多 <i class="i-ri-arrow-down-s-line" />
                </el-link>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="导出名单">
                      导出报名名单
                    </el-dropdown-item>
                    <el-dropdown-item command="人员分组">
                      人员分组 / 点位
                    </el-dropdown-item>
                    <el-dropdown-item command="时长确认">
                      时长确认
                    </el-dropdown-item>
                    <el-dropdown-item command="复制">
                      复制活动
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <span class="text-#3b4757">共 {{ tabbed.length }} 条</span>
        <el-pagination
          v-model:current-page="page" v-model:page-size="size" :total="tabbed.length" :page-sizes="[10, 20, 50]"
          background layout="prev, pager, next, sizes, jumper"
        />
      </div>
    </section>

    <el-drawer v-model="viewVisible" title="活动详情" size="460px">
      <template v-if="selected">
        <img :src="selected.img" class="mb-14px h-200px w-full rounded-6px object-cover" alt="">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="活动名称">
            {{ selected.name }}
          </el-descriptions-item>
          <el-descriptions-item label="活动类型">
            <SoftTag :text="selected.type" />
          </el-descriptions-item>
          <el-descriptions-item label="所属区域">
            {{ selected.region }}
          </el-descriptions-item>
          <el-descriptions-item label="组织单位">
            {{ selected.org }}
          </el-descriptions-item>
          <el-descriptions-item label="活动时间">
            {{ selected.start }} 至 {{ selected.end.slice(11) }}
          </el-descriptions-item>
          <el-descriptions-item label="报名情况">
            {{ selected.signed }} / {{ selected.recruit }} 人
          </el-descriptions-item>
          <el-descriptions-item label="活动状态">
            <SoftTag :text="selected.status" />
          </el-descriptions-item>
        </el-descriptions>
        <div class="mt-14px">
          <div class="text-muted mb-6px">
            报名进度
          </div>
          <el-progress :percentage="Math.round((selected.signed / selected.recruit) * 100)" :stroke-width="10" />
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="signVisible" :title="`签到管理 - ${selected?.name ?? ''}`" width="620px">
      <div class="mb-12px flex gap-12px">
        <span class="soft-tag green lg">已签到 {{ signList.filter(s => s.time).length }} 人</span>
        <span class="soft-tag red lg">未签到 {{ signList.filter(s => !s.time).length }} 人</span>
      </div>
      <el-table :data="signList" class="cv-table" border size="small">
        <el-table-column prop="name" label="志愿者" />
        <el-table-column prop="point" label="服务点位" />
        <el-table-column label="签到时间">
          <template #default="{ row }">
            <span v-if="row.time">{{ row.time }}</span>
            <SoftTag v-else text="未签到" color="red" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-link v-if="!row.time" type="primary" underline="never" @click="row.time = '人工补录'; ElMessage.success('已补录签到，操作已记录')">
              补录签到
            </el-link>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.status-tabs {
  :deep(.ep-tabs__item) {
    font-size: 15px;
    height: 52px;
    padding: 0 26px;
  }
}

.thumb {
  width: 50px;
  height: 36px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
}
</style>
