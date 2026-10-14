<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import { projects } from '~/mock'

const router = useRouter()
const list = ref(projects.map(p => ({ ...p })).sort((a, b) => Number(b.audit === '待审核') - Number(a.audit === '待审核')))
type Item = (typeof list.value)[number]
const tab = ref('待审核')
const rows = computed(() => (tab.value === 'all' ? list.value : list.value.filter(p => p.audit === tab.value)))
const count = (t: string) => list.value.filter(p => p.audit === t).length

function pass(p: Item) {
  p.audit = '已通过'
  ElMessage.success(`「${p.title}」已审核通过并发布`)
}
async function reject(p: Item) {
  const { value } = await ElMessageBox.prompt('请输入驳回原因', `驳回「${p.title}」`, {
    inputPlaceholder: '如：活动地点信息不完整',
    inputValidator: v => !!v || '请填写驳回原因',
  })
  p.audit = '已驳回'
  ElMessage.warning(`已驳回：${value}`)
}
</script>

<template>
  <div class="page">
    <PageHead title="项目审核" desc="对组织提交的志愿项目进行审核，审核通过后对志愿者公开" />
    <section class="card !pt-0">
      <el-tabs v-model="tab" class="audit-tabs">
        <el-tab-pane :label="`待审核 (${count('待审核')})`" name="待审核" />
        <el-tab-pane :label="`已通过 (${count('已通过')})`" name="已通过" />
        <el-tab-pane :label="`已驳回 (${count('已驳回')})`" name="已驳回" />
        <el-tab-pane label="全部" name="all" />
      </el-tabs>
      <el-table :data="rows" class="cv-table" max-height="640">
        <el-table-column label="项目名称" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-12px">
              <img :src="row.img" class="h-36px w-50px rounded-3px object-cover" alt="">{{ row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="服务类型" width="110" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.type" />
          </template>
        </el-table-column>
        <el-table-column prop="region" label="所属区域" width="100" />
        <el-table-column prop="org" label="申报组织" min-width="160" />
        <el-table-column prop="start" label="计划开始" width="150" />
        <el-table-column prop="recruit" label="招募人数" width="90" align="center" />
        <el-table-column label="审核状态" width="100" align="center">
          <template #default="{ row }">
            <SoftTag :text="row.audit" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <div class="op-links">
              <el-link type="primary" underline="never" @click="router.push(`/project/detail/${row.id}`)">
                查看
              </el-link>
              <template v-if="row.audit === '待审核'">
                <el-link type="success" underline="never" @click="pass(row as Item)">
                  通过
                </el-link>
                <el-link type="danger" underline="never" @click="reject(row as Item)">
                  驳回
                </el-link>
              </template>
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
