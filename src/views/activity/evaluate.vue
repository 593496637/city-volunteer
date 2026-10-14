<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import { activities, volunteers } from '~/mock'

const list = ref(activities.filter(a => a.status === '已结束').map(a => ({ ...a })))
type Row = (typeof list.value)[number]

const current = ref<Row>()
const visible = ref(false)
const members = ref<{ name: string, attendance: number, task: number, attitude: number, comment: string }[]>([])
const summary = reactive({ text: '' })

function open(a: Row) {
  current.value = a
  members.value = volunteers.slice(a.id % 10, (a.id % 10) + 5).map(v => ({ name: v.name, attendance: 5, task: 5, attitude: 5, comment: '' }))
  summary.text = ''
  visible.value = true
}
function save() {
  if (current.value)
    current.value.rated = true
  visible.value = false
  ElMessage.success('评价已提交，积分将自动计入志愿者档案')
}
</script>

<template>
  <div class="page">
    <PageHead title="活动评价" desc="活动结束后从出勤、任务完成、服务态度等方面对志愿者进行评价，并形成活动总结" />
    <section class="card">
      <el-table :data="list" class="cv-table">
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
        <el-table-column prop="start" label="活动时间" width="160" />
        <el-table-column label="参与人数" width="90" align="center">
          <template #default="{ row }">
            {{ row.signed }}
          </template>
        </el-table-column>
        <el-table-column label="评价状态" width="100" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.rated ? '已评价' : '待评价'" :color="row.rated ? 'green' : 'orange'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-link type="primary" underline="never" @click="open(row as Row)">
              {{ row.rated ? '查看评价' : '去评价' }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <el-dialog v-model="visible" :title="`志愿者评价 - ${current?.name ?? ''}`" width="820px">
      <el-table :data="members" class="cv-table" border size="small">
        <el-table-column prop="name" label="志愿者" width="90" />
        <el-table-column label="出勤情况" width="150">
          <template #default="{ row }">
            <el-rate v-model="row.attendance" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="任务完成" width="150">
          <template #default="{ row }">
            <el-rate v-model="row.task" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="服务态度" width="150">
          <template #default="{ row }">
            <el-rate v-model="row.attitude" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="评语">
          <template #default="{ row }">
            <el-input v-model="row.comment" size="small" placeholder="选填" />
          </template>
        </el-table-column>
      </el-table>
      <div class="mb-6px mt-14px font-600">
        活动总结
      </div>
      <el-input v-model="summary.text" type="textarea" :rows="3" placeholder="填写本次活动开展情况、亮点与问题" />
      <template #footer>
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" @click="save">
          提交评价
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
