<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import PageHead from '~/components/PageHead.vue'
import SoftTag from '~/components/SoftTag.vue'
import { sysDicts, sysRoles, sysUsers } from '~/mock'

const tab = ref('users')
const users = ref(sysUsers.map(u => ({ ...u })))
const params = reactive({
  signRadius: 500,
  signEarly: 30,
  lateLimit: 15,
  autoConfirm: false,
  remindBefore: 24,
  cancelBefore: 24,
})
const perms = ['项目管理', '活动管理', '报名审核', '签到管理', '时长确认', '评价管理', '数据统计', '系统设置']
const rolePerms: Record<string, string[]> = {
  ADMIN: perms,
  CITY_MGR: ['项目管理', '数据统计'],
  ORG_ADMIN: ['项目管理', '活动管理', '报名审核', '签到管理', '时长确认', '评价管理'],
  COMMUNITY: ['活动管理', '签到管理'],
  VOLUNTEER: [],
}
</script>

<template>
  <div class="page">
    <PageHead title="系统管理" desc="维护用户、组织、角色权限、基础字典和系统参数" />
    <section class="card !pt-0">
      <el-tabs v-model="tab" class="sys-tabs">
        <el-tab-pane label="用户管理" name="users" />
        <el-tab-pane label="角色权限" name="roles" />
        <el-tab-pane label="数据字典" name="dicts" />
        <el-tab-pane label="系统参数" name="params" />
        <el-tab-pane label="操作日志" name="logs" />
      </el-tabs>

      <template v-if="tab === 'users'">
        <div class="mb-12px flex justify-end">
          <el-button type="primary" @click="ElMessage.info('新增用户（演示）')">
            <i class="i-ri-add-line mr-6px" />新增用户
          </el-button>
        </div>
        <el-table :data="users" class="cv-table">
          <el-table-column prop="account" label="账号" width="120" />
          <el-table-column prop="name" label="姓名" width="110" />
          <el-table-column label="角色" width="140">
            <template #default="{ row }">
              <SoftTag :text="row.role" color="blue" />
            </template>
          </el-table-column>
          <el-table-column prop="org" label="所属组织" min-width="180" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="last" label="最近登录" width="160" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-switch :model-value="row.status === '启用'" @change="(v: string | number | boolean) => (row.status = v ? '启用' : '停用')" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template #default>
              <div class="op-links">
                <el-link type="primary" underline="never">
                  编辑
                </el-link>
                <el-link type="primary" underline="never" @click="ElMessage.success('密码已重置为初始密码')">
                  重置密码
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-table v-else-if="tab === 'roles'" :data="sysRoles" class="cv-table">
        <el-table-column prop="name" label="角色名称" width="140" />
        <el-table-column prop="code" label="角色编码" width="120" />
        <el-table-column prop="users" label="用户数" width="90" align="center" />
        <el-table-column prop="desc" label="说明" min-width="240" />
        <el-table-column label="功能权限" min-width="320">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-6px">
              <SoftTag v-for="p in rolePerms[row.code]" :key="p" :text="p" color="cyan" />
              <span v-if="!rolePerms[row.code].length" class="text-muted">仅志愿者端功能</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="tab === 'dicts'" :data="sysDicts" class="cv-table">
        <el-table-column prop="name" label="字典名称" width="160" />
        <el-table-column prop="code" label="字典编码" width="180" />
        <el-table-column prop="items" label="字典项" />
        <el-table-column label="操作" width="100" align="center">
          <template #default>
            <el-link type="primary" underline="never">
              维护
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-form v-else-if="tab === 'params'" :model="params" label-width="160px" class="max-w-640px pt-10px">
        <el-form-item label="定位签到有效半径">
          <el-input-number v-model="params.signRadius" :step="50" /> <span class="text-muted ml-8px">米</span>
        </el-form-item>
        <el-form-item label="允许提前签到">
          <el-input-number v-model="params.signEarly" :step="5" /> <span class="text-muted ml-8px">分钟</span>
        </el-form-item>
        <el-form-item label="迟到判定阈值">
          <el-input-number v-model="params.lateLimit" :step="5" /> <span class="text-muted ml-8px">分钟</span>
        </el-form-item>
        <el-form-item label="活动开始前提醒">
          <el-input-number v-model="params.remindBefore" /> <span class="text-muted ml-8px">小时</span>
        </el-form-item>
        <el-form-item label="允许取消报名截止">
          <el-input-number v-model="params.cancelBefore" /> <span class="text-muted ml-8px">小时（活动开始前）</span>
        </el-form-item>
        <el-form-item label="无异常记录自动确认">
          <el-switch v-model="params.autoConfirm" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ElMessage.success('系统参数已保存')">
            保存
          </el-button>
        </el-form-item>
      </el-form>

      <el-timeline v-else class="pt-10px">
        <el-timeline-item timestamp="2024-06-20 09:12" type="primary">
          张管理员 修改了系统参数「迟到判定阈值」15 → 15 分钟
        </el-timeline-item>
        <el-timeline-item timestamp="2024-06-19 17:40">
          李主任 导出了《2024 年上半年志愿服务统计报表》
        </el-timeline-item>
        <el-timeline-item timestamp="2024-06-18 15:22" type="warning">
          赵老师 对「社区环境清洁行动」2 条签到记录进行了人工补录
        </el-timeline-item>
        <el-timeline-item timestamp="2024-06-18 08:03">
          王队长 审核通过 9 条活动报名
        </el-timeline-item>
      </el-timeline>
    </section>
  </div>
</template>

<style scoped>
.sys-tabs :deep(.ep-tabs__item) {
  height: 52px;
  font-size: 15px;
}
</style>
