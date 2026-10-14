<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import StatTile from '~/components/StatTile.vue'
import { serviceRecords, volunteers } from '~/mock'

const tab = ref('records')
const records = ref(serviceRecords.map(r => ({ ...r })))
type Rec = (typeof records.value)[number]
const status = ref('')
const rows = computed(() => (status.value ? records.value.filter(r => r.status === status.value) : records.value))
const selection = ref<Rec[]>([])

function confirm(list: Rec[]) {
  list.forEach(r => (r.status = '已确认'))
  ElMessage.success(`已确认 ${list.length} 条服务记录，时长与积分已计入志愿者档案`)
}

const fixVisible = ref(false)
const fix = reactive({ id: 0, signIn: '', signOut: '', hours: 0, reason: '' })
function openFix(r: Rec) {
  Object.assign(fix, { id: r.id, signIn: r.signIn, signOut: r.signOut, hours: r.hours, reason: '' })
  fixVisible.value = true
}
function saveFix() {
  const r = records.value.find(x => x.id === fix.id)
  if (r)
    Object.assign(r, { signIn: fix.signIn, signOut: fix.signOut, hours: fix.hours, abnormal: '人工补录', status: '待确认' })
  fixVisible.value = false
  ElMessage.success('已提交人工修正，操作记录已保留')
}

const rules = [
  { item: '志愿服务时长', rule: '每服务 1 小时', points: '+10' },
  { item: '参与活动', rule: '每完成 1 次活动并签退', points: '+5' },
  { item: '服务评价', rule: '获得 5 星评价', points: '+5' },
  { item: '完成培训', rule: '通过 1 门必修课程考核', points: '+20' },
  { item: '异常扣减', rule: '报名后无故缺席', points: '-10' },
]
const ranking = [...volunteers].sort((a, b) => b.points - a.points).slice(0, 10)
</script>

<template>
  <div class="page">
    <PageHead title="时长积分管理" desc="签到签退生成服务时长，经组织负责人确认后计入个人档案" />

    <section class="kpis">
      <StatTile icon="i-ri-time-line" color="#3a8bf5" label="本月服务时长(小时)" value="2,160" trend="9%" />
      <StatTile icon="i-ri-timer-flash-line" color="#f7932c" label="待确认记录" :value="records.filter(r => r.status === '待确认').length" />
      <StatTile icon="i-ri-alarm-line" color="#f05454" label="异常记录" :value="records.filter(r => r.status === '异常').length" />
      <StatTile icon="i-ri-coins-line" color="#1fb36c" label="本月发放积分" value="21,600" trend="12%" />
    </section>

    <section class="card !pt-0">
      <el-tabs v-model="tab" class="pts-tabs">
        <el-tab-pane label="服务时长确认" name="records" />
        <el-tab-pane label="积分规则" name="rules" />
        <el-tab-pane label="积分排行" name="rank" />
      </el-tabs>

      <template v-if="tab === 'records'">
        <div class="mb-12px flex justify-between">
          <el-radio-group v-model="status">
            <el-radio-button label="全部" value="" />
            <el-radio-button label="待确认" value="待确认" />
            <el-radio-button label="异常" value="异常" />
            <el-radio-button label="已确认" value="已确认" />
          </el-radio-group>
          <el-button type="primary" :disabled="!selection.length" @click="confirm(selection)">
            批量确认
          </el-button>
        </div>
        <el-table :data="rows" class="cv-table" @selection-change="(v: Rec[]) => (selection = v)">
          <el-table-column type="selection" width="48" :selectable="(r: Rec) => r.status === '待确认'" />
          <el-table-column prop="volunteer" label="志愿者" width="90" />
          <el-table-column prop="code" label="编号" width="130" />
          <el-table-column prop="activity" label="活动名称" min-width="160" />
          <el-table-column prop="date" label="日期" width="110" />
          <el-table-column prop="signIn" label="签到" width="90" align="center" />
          <el-table-column prop="signOut" label="签退" width="90" align="center" />
          <el-table-column prop="hours" label="时长(h)" width="80" align="center" />
          <el-table-column label="异常标识" width="100" align="center">
            <template #default="{ row }">
              <SoftTag v-if="row.abnormal" :text="row.abnormal" :color="row.abnormal === '人工补录' ? 'purple' : 'red'" />
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="points" label="积分" width="70" align="center" />
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <SoftTag :text="row.status" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template #default="{ row }">
              <div class="op-links">
                <el-link v-if="row.status === '待确认'" type="primary" underline="never" @click="confirm([row as Rec])">
                  确认
                </el-link>
                <el-link v-if="row.status !== '已确认'" type="warning" underline="never" @click="openFix(row as Rec)">
                  补录修正
                </el-link>
                <span v-if="row.status === '已确认'" class="text-muted">-</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-table v-else-if="tab === 'rules'" :data="rules" class="cv-table" border>
        <el-table-column prop="item" label="积分项" width="200" />
        <el-table-column prop="rule" label="规则说明" />
        <el-table-column label="积分" width="120" align="center">
          <template #default="{ row }">
            <b :class="row.points.startsWith('-') ? 'text-#f05454' : 'text-#1fb36c'">{{ row.points }}</b>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else :data="ranking" class="cv-table">
        <el-table-column type="index" label="排名" width="70" align="center" />
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="org" label="所属组织" min-width="180" />
        <el-table-column prop="hours" label="服务时长(h)" width="120" align="center" />
        <el-table-column prop="points" label="积分" width="100" align="center" />
        <el-table-column label="等级" width="130" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.level" color="orange" />
          </template>
        </el-table-column>
      </el-table>
    </section>

    <el-dialog v-model="fixVisible" title="人工补录 / 修正" width="460px">
      <el-form :model="fix" label-width="80px">
        <el-form-item label="签到时间">
          <el-time-select v-model="fix.signIn" start="06:00" step="00:05" end="22:00" class="!w-full" />
        </el-form-item>
        <el-form-item label="签退时间">
          <el-time-select v-model="fix.signOut" start="06:00" step="00:05" end="22:00" class="!w-full" />
        </el-form-item>
        <el-form-item label="服务时长">
          <el-input-number v-model="fix.hours" :min="0" :max="12" :step="0.5" />
        </el-form-item>
        <el-form-item label="修正原因">
          <el-input v-model="fix.reason" type="textarea" placeholder="如：现场网络异常，无法扫码签到" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="fixVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveFix">
          提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.pts-tabs :deep(.ep-tabs__item) {
  height: 52px;
  font-size: 15px;
}
</style>
