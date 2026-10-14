<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import { activities, volunteers } from '~/mock'

const tab = ref('signup')

// 报名审核
const signups = ref(volunteers.slice(0, 16).map((v, i) => ({
  id: i + 1,
  name: v.name,
  gender: v.gender,
  phone: v.phone,
  hours: v.hours,
  trained: v.trained,
  activity: activities[i % 6].name,
  post: ['宣传引导', '桶前值守', '环境清理', '秩序维护'][i % 4],
  time: `2024-05-${String(20 + (i % 9)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
  status: i < 9 ? '待审核' : i < 13 ? '已通过' : i < 15 ? '候补' : '已驳回',
})))
type Signup = (typeof signups.value)[number]
const signupStatus = ref('待审核')
const signupRows = computed(() => (signupStatus.value ? signups.value.filter(s => s.status === signupStatus.value) : signups.value))
const selection = ref<Signup[]>([])

function setStatus(rows: Signup[], status: string) {
  rows.forEach(r => (r.status = status))
  ElMessage.success(`已将 ${rows.length} 条报名设为「${status}」，系统已通知志愿者`)
}

// 活动发布审核
const pending = ref(activities.filter(a => a.status === '待审核').map(a => ({ ...a })))
type Pending = (typeof pending.value)[number]
async function auditActivity(a: Pending, ok: boolean) {
  if (!ok)
    await ElMessageBox.prompt('请输入驳回原因', '驳回活动', { inputValidator: v => !!v || '请填写驳回原因' })
  pending.value = pending.value.filter(x => x !== a)
  ElMessage.success(ok ? '活动审核通过，已进入招募' : '活动已驳回')
}
</script>

<template>
  <div class="page">
    <PageHead title="活动审核" desc="审核志愿者报名与组织提交的活动，可设置候补人员" />

    <section class="card !pt-0">
      <el-tabs v-model="tab" class="audit-tabs">
        <el-tab-pane label="报名审核" name="signup" />
        <el-tab-pane :label="`活动发布审核 (${pending.length})`" name="activity" />
      </el-tabs>

      <template v-if="tab === 'signup'">
        <div class="mb-12px flex items-center justify-between">
          <el-radio-group v-model="signupStatus">
            <el-radio-button label="待审核" value="待审核" />
            <el-radio-button label="已通过" value="已通过" />
            <el-radio-button label="候补" value="候补" />
            <el-radio-button label="已驳回" value="已驳回" />
            <el-radio-button label="全部" value="" />
          </el-radio-group>
          <div>
            <el-button type="primary" :disabled="!selection.length" @click="setStatus(selection, '已通过')">
              批量通过
            </el-button>
            <el-button :disabled="!selection.length" @click="setStatus(selection, '候补')">
              设为候补
            </el-button>
          </div>
        </div>
        <el-table :data="signupRows" class="cv-table" @selection-change="(v: Signup[]) => (selection = v)">
          <el-table-column type="selection" width="48" />
          <el-table-column prop="name" label="志愿者" width="100" />
          <el-table-column prop="gender" label="性别" width="70" align="center" />
          <el-table-column prop="phone" label="联系电话" width="130" />
          <el-table-column prop="activity" label="报名活动" min-width="170" />
          <el-table-column prop="post" label="意向岗位" width="110" />
          <el-table-column label="累计时长" width="100" align="center">
            <template #default="{ row }">
              {{ row.hours }} h
            </template>
          </el-table-column>
          <el-table-column label="培训情况" width="100" align="center">
            <template #default="{ row }">
              <SoftTag :text="row.trained ? '已培训' : '未培训'" :color="row.trained ? 'green' : 'gray'" />
            </template>
          </el-table-column>
          <el-table-column prop="time" label="报名时间" width="150" />
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <SoftTag :text="row.status" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" align="center">
            <template #default="{ row }">
              <div v-if="row.status === '待审核' || row.status === '候补'" class="op-links">
                <el-link type="success" underline="never" @click="setStatus([row as Signup], '已通过')">
                  通过
                </el-link>
                <el-link v-if="row.status === '待审核'" type="primary" underline="never" @click="setStatus([row as Signup], '候补')">
                  候补
                </el-link>
                <el-link type="danger" underline="never" @click="setStatus([row as Signup], '已驳回')">
                  退回
                </el-link>
              </div>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-table v-else :data="pending" class="cv-table" empty-text="暂无待审核活动">
        <el-table-column label="活动名称" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-12px">
              <img :src="row.img" class="h-36px w-50px rounded-3px object-cover" alt="">{{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" width="110" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.type" />
          </template>
        </el-table-column>
        <el-table-column prop="region" label="所属区域" width="100" />
        <el-table-column prop="org" label="组织单位" min-width="160" />
        <el-table-column label="活动时间" width="170">
          <template #default="{ row }">
            {{ row.start }}<br>{{ row.end }}
          </template>
        </el-table-column>
        <el-table-column prop="recruit" label="招募人数" width="90" align="center" />
        <el-table-column label="操作" width="140" align="center">
          <template #default="{ row }">
            <div class="op-links">
              <el-link type="success" underline="never" @click="auditActivity(row as Pending, true)">
                通过
              </el-link>
              <el-link type="danger" underline="never" @click="auditActivity(row as Pending, false)">
                驳回
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<style scoped>
.audit-tabs :deep(.ep-tabs__item) {
  height: 52px;
  font-size: 15px;
}
</style>
