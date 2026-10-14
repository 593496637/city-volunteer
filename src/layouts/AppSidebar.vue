<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import sideCity from '~/assets/img/side-city.jpg'
import { menus } from '~/router/menu'

const route = useRoute()
const active = computed(() => route.meta.activeMenu ?? route.path)
</script>

<template>
  <aside class="app-sidebar">
    <el-menu :default-active="active" router unique-opened class="side-menu">
      <template v-for="m in menus" :key="m.path">
        <el-sub-menu v-if="m.children" :index="m.path">
          <template #title>
            <i :class="m.icon" class="menu-icon" />
            <span>{{ m.title }}</span>
          </template>
          <el-menu-item v-for="c in m.children" :key="c.path" :index="c.path">
            {{ c.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="m.path">
          <i :class="m.icon" class="menu-icon" />
          <span>{{ m.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>

    <div class="side-deco">
      <img :src="sideCity" alt="">
      <p>志愿同行</p>
      <p class="indent">
        共建美好城市
      </p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.app-sidebar {
  position: fixed;
  top: var(--cv-header-h);
  bottom: 0;
  left: 0;
  z-index: 90;
  width: var(--cv-side-w);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(180deg, #14375c 0%, #183d66 60%, #163a62 100%);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.side-menu {
  --ep-menu-bg-color: transparent;
  --ep-menu-hover-bg-color: rgba(255, 255, 255, 0.07);
  --ep-menu-text-color: #d7e3f4;
  --ep-menu-active-color: #fff;
  --ep-menu-item-height: 50px;
  --ep-menu-sub-item-height: 40px;
  --ep-menu-item-font-size: 15px;
  --ep-menu-base-level-padding: 22px;
  border-right: none;
  padding-top: 10px;

  .menu-icon {
    font-size: 20px;
    margin-right: 12px;
    opacity: 0.95;
  }

  :deep(.ep-menu-item),
  :deep(.ep-sub-menu__title) {
    letter-spacing: 0.5px;
  }

  // 一级菜单选中：通栏高亮
  :deep(> .ep-menu-item.is-active) {
    background: linear-gradient(90deg, #1a6fe0, #2a7ef0);
    box-shadow: inset 4px 0 0 #6fb4ff;
  }

  // 二级菜单
  :deep(.ep-menu--inline) {
    background: rgba(5, 20, 40, 0.18);
    padding: 4px 0;

    .ep-menu-item {
      margin: 2px 10px;
      padding-left: 44px !important;
      border-radius: 6px;
      font-size: 14px;
      color: #c7d5ea;

      &.is-active {
        background: #1a6fe0;
        color: #fff;
      }
    }
  }

  :deep(.ep-sub-menu.is-active > .ep-sub-menu__title) {
    color: #fff;
    background: rgba(26, 111, 224, 0.35);
  }
}

.side-deco {
  margin-top: auto;
  position: relative;
  padding-bottom: 26px;
  pointer-events: none;
  user-select: none;

  img {
    display: block;
    width: 100%;
    opacity: 0.9;
    mask-image: linear-gradient(180deg, transparent 0%, #000 35%);
  }

  p {
    margin: 4px 0 0 30px;
    color: rgba(255, 255, 255, 0.85);
    font-family: 'STKaiti', 'KaiTi', 'Kaiti SC', serif;
    font-size: 19px;
    letter-spacing: 4px;

    &.indent {
      margin-left: 22px;
    }
  }
}
</style>
