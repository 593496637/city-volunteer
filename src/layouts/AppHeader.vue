<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import avatarAdmin from '~/assets/img/avatar-admin.jpg'
import avatarVolunteer from '~/assets/img/avatar-volunteer.jpg'
import AppLogo from '~/components/AppLogo.vue'
import { noticeColor, notices } from '~/mock'

const route = useRoute()
const router = useRouter()

const subtitle = computed(() => route.meta.subtitle ?? '志愿同行 · 共建美好城市')
const isVolunteer = computed(() => route.meta.role === 'volunteer')
const userName = computed(() => (isVolunteer.value ? '张志愿者' : '张管理员'))
const avatar = computed(() => (isVolunteer.value ? avatarVolunteer : avatarAdmin))

const keyword = ref('')
function search() {
  router.push({ path: '/project/list', query: keyword.value ? { keyword: keyword.value } : {} })
}

function onCommand(cmd: string) {
  if (cmd === 'logout')
    ElMessage.info('当前为静态演示系统，无需登录')
  else
    router.push(cmd)
}
</script>

<template>
  <header class="app-header">
    <div class="brand" @click="router.push('/dashboard')">
      <AppLogo />
      <span class="brand-name">城市管理志愿服务平台</span>
    </div>
    <span class="divider" />
    <span class="subtitle" :class="{ slogan: !route.meta.subtitle }">{{ subtitle }}</span>

    <div class="flex-1" />

    <el-input
      v-model="keyword"
      class="header-search"
      placeholder="请输入关键词搜索项目、活动或组织"
      @keyup.enter="search"
    >
      <template #suffix>
        <i class="i-ri-search-line cursor-pointer" @click="search" />
      </template>
    </el-input>

    <el-popover placement="bottom-end" :width="340" trigger="click">
      <template #reference>
        <div class="bell">
          <el-badge :value="3" class="bell-badge">
            <i class="i-ri-notification-3-line text-22px" />
          </el-badge>
        </div>
      </template>
      <div class="notice-pop">
        <div class="notice-pop__title">
          消息通知 <span class="more-link" @click="router.push('/notice')">全部消息</span>
        </div>
        <div v-for="n in notices.slice(0, 3)" :key="n.id" class="notice-pop__item" @click="router.push('/notice')">
          <span class="soft-tag" :class="noticeColor[n.type]">{{ n.type }}</span>
          <span class="flex-1 truncate">{{ n.title }}</span>
        </div>
      </div>
    </el-popover>

    <el-dropdown trigger="click" @command="onCommand">
      <div class="user">
        <img :src="avatar" class="user-avatar" alt="">
        <span>{{ userName }}</span>
        <i class="i-ri-arrow-down-s-line" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="/personal/home">
            <i class="i-ri-user-line mr-6px" />个人中心
          </el-dropdown-item>
          <el-dropdown-item command="/notice">
            <i class="i-ri-notification-3-line mr-6px" />消息通知
          </el-dropdown-item>
          <el-dropdown-item command="/system">
            <i class="i-ri-settings-4-line mr-6px" />系统管理
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <i class="i-ri-logout-box-r-line mr-6px" />退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  height: var(--cv-header-h);
  display: flex;
  align-items: center;
  padding: 0 28px 0 22px;
  color: #fff;
  background: linear-gradient(90deg, #123f74 0%, #1d5597 45%, #2e70ba 100%);
  box-shadow: 0 2px 8px rgba(10, 40, 80, 0.25);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.brand-name {
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 1px;
}

.divider {
  width: 1px;
  height: 20px;
  margin: 0 16px;
  background: rgba(255, 255, 255, 0.45);
}

.subtitle {
  font-size: 17px;
  letter-spacing: 1px;
  opacity: 0.95;

  &.slogan {
    font-family: 'STKaiti', 'KaiTi', 'Kaiti SC', serif;
    font-size: 19px;
    letter-spacing: 3px;
  }
}

.header-search {
  width: 300px;
  --ep-input-border-radius: 4px;
  --ep-input-border-color: transparent;
  --ep-input-hover-border-color: transparent;

  :deep(.ep-input__wrapper) {
    box-shadow: none;
  }
}

.bell {
  margin: 0 26px 0 30px;
  cursor: pointer;
  display: flex;

  :deep(.ep-badge__content) {
    border: none;
  }
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  outline: none;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.notice-pop__title {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 8px;
}

.notice-pop__item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--cv-border);
  cursor: pointer;
  font-size: 13px;

  &:hover {
    color: var(--cv-primary);
  }
}
</style>
