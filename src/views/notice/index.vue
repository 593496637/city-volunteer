<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import { noticeColor, notices } from '~/mock'

const type = ref('')
const keyword = ref('')
const rows = computed(() => notices.filter(n => (!type.value || n.type === type.value) && (!keyword.value || n.title.includes(keyword.value))))
const current = ref<(typeof notices)[number]>()
const visible = ref(false)
function open(n: (typeof notices)[number]) {
  current.value = n
  visible.value = true
}

const messages = [
  { title: '报名审核通过', text: '您报名的「社区环境清洁行动」已审核通过，请于 06-02 14:00 前到达集合点。', time: '10 分钟前', icon: 'i-ri-checkbox-circle-fill', color: '#1fb36c' },
  { title: '活动变更提醒', text: '「垃圾分类知识讲座」开始时间调整为 10:00，地点不变。', time: '2 小时前', icon: 'i-ri-information-line', color: '#f7932c' },
  { title: '服务时长已确认', text: '「公园环境维护」4 小时服务时长已确认，积分 +40。', time: '昨天', icon: 'i-ri-time-fill', color: '#1a6fe0' },
]
</script>

<template>
  <div class="page">
    <PageHead title="通知公告" desc="报名结果、活动变更、培训通知、时长确认等关键节点消息">
      <el-button type="primary" size="large" @click="ElMessage.info('已打开公告发布（演示）')">
        <i class="i-ri-add-line mr-6px" />发布公告
      </el-button>
    </PageHead>

    <div class="layout">
      <section class="card min-w-0 flex-1">
        <div class="mb-14px flex items-center gap-14px">
          <el-radio-group v-model="type">
            <el-radio-button label="全部" value="" />
            <el-radio-button label="通知" value="通知" />
            <el-radio-button label="活动" value="活动" />
            <el-radio-button label="公示" value="公示" />
          </el-radio-group>
          <el-input v-model="keyword" placeholder="搜索公告标题" clearable class="ml-auto !w-240px">
            <template #prefix>
              <i class="i-ri-search-line" />
            </template>
          </el-input>
        </div>
        <div v-for="n in rows" :key="n.id" class="notice" @click="open(n)">
          <SoftTag :text="n.type" :color="noticeColor[n.type]" size="lg" />
          <div class="min-w-0 flex-1">
            <div class="title">
              {{ n.title }}
            </div>
            <div class="text-muted mt-4px text-12px">
              {{ n.publisher }} <span class="dot-sep" />阅读 {{ n.views }}
            </div>
          </div>
          <span class="text-muted">{{ n.date }}</span>
        </div>
        <el-empty v-if="!rows.length" description="暂无公告" />
      </section>

      <section class="card w-380px">
        <div class="card-title">
          <h3>我的消息</h3>
          <span class="more-link" @click="ElMessage.success('已全部标记为已读')">全部已读</span>
        </div>
        <div v-for="m in messages" :key="m.title" class="msg">
          <i :class="m.icon" :style="{ color: m.color }" />
          <div class="flex-1">
            <div class="flex justify-between">
              <b>{{ m.title }}</b><span class="text-muted text-12px">{{ m.time }}</span>
            </div>
            <p>{{ m.text }}</p>
          </div>
        </div>
      </section>
    </div>

    <el-dialog v-model="visible" :title="current?.title" width="620px">
      <template v-if="current">
        <div class="text-muted mb-14px">
          {{ current.publisher }} <span class="dot-sep" />{{ current.date }} <span class="dot-sep" />阅读 {{ current.views }}
        </div>
        <p class="leading-28px">
          各区城市管理部门、各志愿服务组织：
        </p>
        <p class="indent-2em leading-28px">
          为深入推进城市管理志愿服务工作，持续巩固垃圾分类工作成效，现就{{ current.title.replace(/^关于/, '').replace(/的通知$/, '') }}有关事项通知如下。请各单位结合辖区实际，认真组织志愿者报名参与，做好活动前培训、活动中签到签退和活动后时长确认等工作，确保服务记录真实、完整、可追溯。
        </p>
        <p class="indent-2em leading-28px">
          活动期间如遇问题，请通过平台“消息通知”或联系辖区志愿服务组织负责人反馈。
        </p>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.notice {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 6px;
  border-bottom: 1px solid var(--cv-border);
  cursor: pointer;

  .title {
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover .title {
    color: var(--cv-primary);
  }
}

.msg {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--cv-border);

  > i {
    font-size: 22px;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--cv-text-2);
    line-height: 20px;
  }
}
</style>
