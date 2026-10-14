<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import StatTile from '~/components/StatTile.vue'
import { districts, levels, volunteers } from '~/mock'

const form = reactive({ name: '', region: '', level: '', status: '' })
const applied = ref({ ...form })
const filtered = computed(() => volunteers.filter(v =>
  (!applied.value.name || v.name.includes(applied.value.name) || v.code.includes(applied.value.name))
  && (!applied.value.region || v.region === applied.value.region)
  && (!applied.value.level || v.level === applied.value.level)
  && (!applied.value.status || v.status === applied.value.status),
))
const page = ref(1)
const size = ref(10)
const rows = computed(() => filtered.value.slice((page.value - 1) * size.value, page.value * size.value))
watch(applied, () => (page.value = 1))
const search = () => (applied.value = { ...form })
function reset() {
  Object.assign(form, { name: '', region: '', level: '', status: '' })
  search()
}

type Volunteer = (typeof volunteers)[number]
const current = ref<Volunteer>()
const drawer = ref(false)
function view(v: Volunteer) {
  current.value = v
  drawer.value = true
}
</script>

<template>
  <div class="page">
    <PageHead title="志愿者管理" desc="统一的志愿者电子档案，服务记录统一归集到个人">
      <el-button size="large" @click="ElMessage.success('志愿者档案已导出')">
        <i class="i-ri-download-line mr-6px" />导出
      </el-button>
      <el-button type="primary" size="large" @click="ElMessage.info('请在移动端邀请志愿者完成注册与实名认证')">
        <i class="i-ri-user-add-line mr-6px" />新增志愿者
      </el-button>
    </PageHead>

    <section class="kpis">
      <StatTile icon="i-ri-team-fill" color="#3a8bf5" label="注册志愿者" value="12,586" trend="8%" />
      <StatTile icon="i-ri-user-follow-line" color="#1fb36c" label="本月活跃" value="3,208" trend="11%" />
      <StatTile icon="i-ri-book-open-line" color="#f7932c" label="已完成培训" value="9,874" trend="6%" />
      <StatTile icon="i-ri-user-star-fill" color="#8a6cf7" label="星级志愿者" value="1,126" trend="4%" />
    </section>

    <section class="card filter-card mb-14px">
      <el-form inline :model="form" label-width="72px">
        <el-form-item label="姓名/编号">
          <el-input v-model="form.name" placeholder="请输入" clearable class="!w-170px" @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select v-model="form.region" placeholder="请选择" clearable class="!w-140px">
            <el-option v-for="d in districts" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="志愿等级">
          <el-select v-model="form.level" placeholder="请选择" clearable class="!w-140px">
            <el-option v-for="l in levels" :key="l" :label="l" :value="l" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择" clearable class="!w-110px">
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item class="!ml-auto !mr-0">
          <el-button class="!w-90px" @click="reset">
            重置
          </el-button>
          <el-button type="primary" class="!w-100px" @click="search">
            <i class="i-ri-search-line mr-6px" />查询
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="card">
      <el-table :data="rows" class="cv-table">
        <el-table-column prop="code" label="志愿者编号" width="130" />
        <el-table-column prop="name" label="姓名" width="90" />
        <el-table-column prop="gender" label="性别" width="60" align="center" />
        <el-table-column prop="age" label="年龄" width="60" align="center" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="region" label="服务区域" width="100" />
        <el-table-column prop="org" label="所属组织" min-width="170" />
        <el-table-column prop="hours" label="服务时长(h)" width="100" align="center" sortable />
        <el-table-column prop="points" label="积分" width="80" align="center" sortable />
        <el-table-column label="等级" width="110" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.level" color="orange" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template #default="{ row }">
            <div class="op-links">
              <el-link type="primary" underline="never" @click="view(row as Volunteer)">
                档案
              </el-link>
              <el-link :type="row.status === '正常' ? 'danger' : 'success'" underline="never" @click="row.status = row.status === '正常' ? '停用' : '正常'">
                {{ row.status === '正常' ? '停用' : '启用' }}
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <span>共 {{ filtered.length }} 条</span>
        <el-pagination v-model:current-page="page" v-model:page-size="size" :total="filtered.length" background layout="prev, pager, next, sizes" />
      </div>
    </section>

    <el-drawer v-model="drawer" title="志愿者档案" size="480px">
      <template v-if="current">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">
            {{ current.name }}
          </el-descriptions-item>
          <el-descriptions-item label="编号">
            {{ current.code }}
          </el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ current.gender }}
          </el-descriptions-item>
          <el-descriptions-item label="年龄">
            {{ current.age }}
          </el-descriptions-item>
          <el-descriptions-item label="服务区域">
            {{ current.region }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ current.registered }}
          </el-descriptions-item>
          <el-descriptions-item label="所属组织" :span="2">
            {{ current.org }}
          </el-descriptions-item>
          <el-descriptions-item label="累计时长">
            {{ current.hours }} 小时
          </el-descriptions-item>
          <el-descriptions-item label="参与次数">
            {{ current.times }} 次
          </el-descriptions-item>
          <el-descriptions-item label="积分">
            {{ current.points }}
          </el-descriptions-item>
          <el-descriptions-item label="等级">
            {{ current.level }}
          </el-descriptions-item>
          <el-descriptions-item label="培训情况" :span="2">
            {{ current.trained ? '垃圾分类基础培训（已通过）' : '未完成培训' }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="mb-10px mt-18px font-600">
          近期服务记录
        </div>
        <el-timeline>
          <el-timeline-item timestamp="2024-06-01" type="primary">
            垃圾分类宣传进社区 · 2.5 小时
          </el-timeline-item>
          <el-timeline-item timestamp="2024-05-26">
            公园环境维护 · 4 小时
          </el-timeline-item>
          <el-timeline-item timestamp="2024-05-18">
            桶前值守引导 · 2 小时
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}
</style>
